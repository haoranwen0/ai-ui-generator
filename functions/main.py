# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

import json
import os
import re
import requests
from typing import Dict

import anthropic
import stripe
from dotenv import load_dotenv
from jsonschema import validate
from firebase_admin import auth, credentials, firestore, initialize_app
from firebase_functions import https_fn

from prompt import user_initial_prompt, assistant_initial_prompt


load_dotenv()
anthropic_api_key = os.environ.get("ANTHROPIC_API_KEY")
stripe_api_key = os.environ.get("STRIPE_API_KEY")

IS_EMULATOR = os.environ.get('FUNCTIONS_EMULATOR') == 'true'

# Initialize Firebase Admin SDK
# cred = credentials.ApplicationDefault()
cred = credentials.Certificate(
    "secrets/ai-ui-generator-firebase-adminsdk-3vcyq-02d8742a7f.json"
)
initialize_app(cred)

db = firestore.client()


project_schema = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "code": {"type": "string"},
        "framework": {"type": "string"},
    },
}

# def requires_auth(f):
#   @wraps(f)
#   def decorated_function(*args, **kwargs):
#     uid = current_uid.get()
#     if uid is None:
#       return functions.https.HttpResponse('Unauthorized', status=401)
#     return f(*args, **kwargs)
#   return decorated_function


def get_headers():
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "3600",
    }
    return headers


def router(request):
    if request.method == "OPTIONS":
        return https_fn.Response("", status=204, headers=get_headers())

    path = request.path
    method = request.method

    # Define your routes with dynamic segments
    routes = [
        {
            "pattern": r"^/projects$",
            "methods": {"GET": list_projects, "POST": create_project},
        },
        {
            "pattern": r"^/project/(?P<projectid>[^/]+)$",
            "methods": {
                "GET": get_project,
                "PUT": update_project,
                "PATCH": update_code,
                # "DELETE": delete_project
            },
        },
        {"pattern": r"^/chat/(?P<projectid>[^/]+)$", "methods": {"POST": chat}},
        {
            "pattern": r"^/history/(?P<projectid>[^/]+)$",
            "methods": {"GET": get_chat_history},
        },
        {"pattern": r"^/usage$", "methods": {"GET": get_api_count}},
        {"pattern": r"^/checkout$", "methods": {"POST": create_checkout_session}},
        {"pattern": r"^/webhook$", "methods": {"POST": stripe_webhook_handler}},
        {"pattern": r"^/test$", "methods": {"GET": get_test_user}},
        # {
        #   "pattern": r"^/api/products/(?P<product_id>\w+)$",
        #   "methods": {
        #     "GET": get_product,
        #     "PUT": update_product,
        #     "DELETE": delete_product
        #   }
        # }
    ]

    # Find matching route
    for route in routes:
        match = re.match(route["pattern"], path)
        if match:
            if method in route["methods"]:
                # Extract parameters from the URL
                params = match.groupdict()
                # Call the appropriate function with parameters
                return route["methods"][method](request, **params)
            else:
                return https_fn.Response("Method not allowed", status=405)

    return https_fn.Response("Not found", status=404)


@https_fn.on_request()
def main(req: https_fn.Request) -> https_fn.Response:
    if req.method == "OPTIONS":
        return https_fn.Response("", status=204, headers=get_headers())

    return router(req)


# def add_message(req: https_fn.Request) -> https_fn.Response:
#   # Get the message from the request
#   original = req.args.get('text', '')

#   # Add the message to Firestore
#   doc_ref = db.collection('messages').document()
#   doc_ref.set({
#     'original': original
#   })

#   return https_fn.Response(f"Message added with ID: {doc_ref.id}")


def get_api_count(req: https_fn.Request) -> https_fn.Response:
    uid = get_uid(req.headers)
    doc_ref = db.collection("users").document(uid)
    doc = doc_ref.get()
    # Check if the document doesn't exist
    if not doc.exists or "api_count" not in doc.to_dict():
        doc_ref.set({"api_count": 15})
    return https_fn.Response(
        json.dumps({"message": doc.to_dict(), "count": doc.get("api_count")}),
        status=200,
        headers=get_headers(),
    )


def list_projects(req: https_fn.Request) -> https_fn.Response:
    uid = get_uid(req.headers)
    docs = db.collection("users").document(uid).collection("projects").stream()
    project_list = []
    for doc in docs:
        project_dict = {"id": doc.id, "name": doc.get("name")}
        project_list.append(project_dict)
        # print(f"{doc.id} => {doc.to_dict()}")
    return https_fn.Response(json.dumps(project_list), status=200, headers=get_headers())


def create_project(req: https_fn.Request) -> https_fn.Response:
    uid = get_uid(req.headers)
    project = req.json
    try:
        validate(project, project_schema)
    except:
        return https_fn.Response("Invalid project structure", status=405)
    _, doc_ref = (
        db.collection("users").document(uid).collection("projects").add(project)
    )

    # Now initialize the user's API count
    user_ref = db.collection("users").document(uid)
    user = user_ref.get()
    if not user.exists or "api_count" not in user.to_dict():
        user_ref.set({"api_count": 15}, merge=True)

    return https_fn.Response(
        json.dumps({"message": "Project created", "projectid": doc_ref.id}),
        status=200,
        headers=get_headers(),
    )


def get_project(req: https_fn.Request, projectid: str) -> https_fn.Response:
    uid = get_uid(req.headers)
    project = (
        db.collection("users")
        .document(uid)
        .collection("projects")
        .document(projectid)
        .get()
    )
    if not project.exists:
        return https_fn.Response("Project not found", status=404)
    return https_fn.Response(json.dumps(project.to_dict()), status=200, headers=get_headers())


# TODO: Change so that project can't be renamed
def update_code(req: https_fn.Request, projectid: str) -> https_fn.Response:
    uid = get_uid(req.headers)
    project_ref = (
        db.collection("users").document(uid).collection("projects").document(projectid)
    )
    old_project = project_ref.get()
    if not old_project.exists:
        return https_fn.Response("Project not found", status=404)
    new_code = req.json["code"]
    project_ref.update({"code": new_code})
    return https_fn.Response(
        json.dumps({"message": "Code updated"}), status=200, headers=get_headers()
    )


# TODO: Change so that project can't be renamed
def update_project(req: https_fn.Request, projectid: str) -> https_fn.Response:
    uid = get_uid(req.headers)
    project_ref = (
        db.collection("users").document(uid).collection("projects").document(projectid)
    )
    old_project = project_ref.get()
    if not old_project.exists:
        return https_fn.Response("Project not found", status=404)
    new_project = req.json
    try:
        validate(new_project, project_schema)
    except:
        return https_fn.Response("Invalid project structure", status=405)
    project_ref.update(req.json)
    return https_fn.Response(
        json.dumps({"message": "Project updated"}), status=200, headers=get_headers()
    )


stripe.api_key = stripe_api_key
stripe.max_network_retries = 5
FRONTEND_DOMAIN = "http://localhost:3000" if IS_EMULATOR else "https://augment-ui.com"

def create_checkout_session(req: https_fn.Request) -> https_fn.Response:
    uid = get_uid(req.headers)
    email = get_email(req.headers)
    project_id = req.json["project_id"]

    try:
        checkout_session = stripe.checkout.Session.create(
            client_reference_id=uid,
            customer_email=email,
            line_items=[
                {
                    # Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    'price': 'price_1QAzMzRrf8g03FvpxHIyqfxS',#'price_1QAomQRrf8g03Fvpwq4Kl89N',
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url=f"{FRONTEND_DOMAIN}/design/{project_id}?success=true?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_DOMAIN}/design/{project_id}?canceled=true?session_id={{CHECKOUT_SESSION_ID}}",
            automatic_tax={'enabled': True},
        )
    except Exception as e:
        print(e)
        return https_fn.Response(str(e), status=400, headers=get_headers())

    return https_fn.Response(json.dumps({"url": checkout_session.url}), status=200, headers=get_headers())

def stripe_webhook_handler(req: https_fn.Request):
    payload = req.data
    sig_header = req.headers.get('stripe-signature')
    stripe_webhook_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, stripe_webhook_secret
        )
    except ValueError as e:
        return https_fn.Response({'error': 'Invalid payload'}, status=400, headers=get_headers())
    except stripe.error.SignatureVerificationError as e:
        return https_fn.Response({'error': 'Invalid signature'}, status=400, headers=get_headers())

    # Handle successful payment here
    # e.g., fulfill the order, update database, etc.
    if event['type'] == 'checkout.session.completed' or event['type'] == 'checkout.session.async_payment_succeeded':
        session = event['data']['object']
        session_id = session['id']

        # Retrieve the session to get customer details
        client_reference_id = session.get('client_reference_id')
        print(client_reference_id)
        if not client_reference_id:
            return https_fn.Response({'error': 'No client_reference_id found'}, status=400, headers=get_headers())

        # Check if this session has already been processed
        session_ref = db.collection('processed_sessions').document(session_id)
        if session_ref.get().exists:
            print(f"Session {session_id} has already been processed. Ignoring.")
            return https_fn.Response('Session already processed, ignoring', status=200)

        user_ref = db.collection("users").document(client_reference_id)
        user_ref.update({"api_count": firestore.Increment(100)})

        session_ref.set({
            'session_id': session_id,
            'processed_at': firestore.SERVER_TIMESTAMP,
            'event_type': event['type'],
            'user_id': client_reference_id
        })
    # TODO: Handle other event types
    else:
        return https_fn.Response({'error': 'Invalid event type'}, status=400, headers=get_headers())

    return https_fn.Response({'success': True}, status=200, headers=get_headers())


def get_chat_history(req: https_fn.Request, projectid: str) -> https_fn.Response:
    uid = get_uid(req.headers)
    project_ref = (
        db.collection("users").document(uid).collection("projects").document(projectid)
    )
    project = project_ref.get()
    if not project.exists or "chat_history" not in project.to_dict():
        return https_fn.Response(json.dumps([]), status=200, headers=get_headers())
    chat_history = project.get("chat_history")
    return https_fn.Response(json.dumps(chat_history), status=200, headers=get_headers())


client = anthropic.Anthropic(api_key=anthropic_api_key)


def chat(req: https_fn.Request, projectid: str) -> https_fn.Response:
    uid = get_uid(req.headers)

    # Decrement the API count
    doc_ref = db.collection("users").document(uid)
    doc = doc_ref.get()
    # Check if the document doesn't exist
    if not doc.exists or "api_count" not in doc.to_dict():
        doc_ref.set({"api_count": 15})
    else:
        doc_ref.update({"api_count": firestore.Increment(-1)})
    # Check if the user has enough API calls
    if doc.to_dict()["api_count"] <= 0:
        return https_fn.Response("Out of API calls", status=405)

    # Get the UI framework for the project
    project_ref = (
        db.collection("users").document(uid).collection("projects").document(projectid)
    )

    project = project_ref.get()
    if not project.exists:
        return https_fn.Response("Project not found", status=404)

    framework = project.get("framework")
    if framework is None:
        framework = "Chakra UI"

    # Get the chat history
    chat_history = req.json["chat_history"]

    # Add the initial prompts
    chat_history.insert(0, {"role": "user", "content": user_initial_prompt(framework)})
    chat_history.insert(
        1, {"role": "assistant", "content": assistant_initial_prompt(framework)}
    )

    print("chat_history: ", chat_history)

    completion = client.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=8192,
        tools=[
            {
                "name": "get_code",
                "description": "Get the UI/UX code for the design",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "questions": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {"type": "integer"},
                                    "text": {"type": "string"},
                                    "type": {
                                        "type": "string",
                                        "enum": [
                                            "multiple_choice",
                                            "text",
                                            "multi_select",
                                        ],
                                    },
                                    "options": {
                                        "type": "array",
                                        "items": {"type": "string"},
                                    },
                                },
                                "required": ["id", "text", "type"],
                                "dependencies": {
                                    "type": {
                                        "oneOf": [
                                            {
                                                "properties": {
                                                    "type": {
                                                        "enum": ["multiple_choice"]
                                                    },
                                                    "options": {"type": "array"},
                                                },
                                                "required": ["options"],
                                            },
                                            {
                                                "properties": {
                                                    "type": {"enum": ["text"]}
                                                }
                                            },
                                        ]
                                    }
                                },
                            },
                        },
                        "explanation": {"type": "string"},
                        "code": {"type": "string"},
                    },
                    "dependencies": {
                        "questions": {"not": {"required": ["explanation", "code"]}},
                        "explanation": {"not": {"required": ["questions"]}},
                        "code": {"not": {"required": ["questions"]}},
                    },
                },
            }
        ],
        tool_choice={
            "type": "tool",
            "name": "get_code",
        },
        messages=chat_history,
        temperature=0.5,
    )

    print(completion.content[0])

    # tool_name = completion.content[0].name
    json_completion_output = completion.content[0].input

    # Now update chat history
    new_history = chat_history[2:] + [
        {"content": json.dumps(json_completion_output), "role": "assistant"}
    ]

    if "chat_history" not in project.to_dict():
        project_ref.set({"chat_history": new_history}, merge=True)

    project_ref.update({"chat_history": new_history})

    return https_fn.Response(
        json.dumps(
            json_completion_output
        ),  # This will now be a properly formatted JSON
        status=200,
        headers=get_headers(),
    )


def get_uid(header: Dict[str, str]) -> str:
    """
    Verifies the token using Firebase Auth.
    """
    if "Authorization" not in header:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "No authorization token provided",
        )

    token = header["Authorization"].split(" ")[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token["uid"]
    except auth.InvalidIdTokenError:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.UNAUTHENTICATED, "Unauthorized"
        )

def get_email(header: Dict[str, str]) -> str:
    """
    Gets the email from Firebase Auth.
    """
    if "Authorization" not in header:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "No authorization token provided",
        )

    token = header["Authorization"].split(" ")[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token.get("email", "")
    except auth.InvalidIdTokenError:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.UNAUTHENTICATED, "Unauthorized"
        )


def get_test_user(req: https_fn.Request) -> https_fn.Response:
    def create_custom_token(uid):
        try:
            return auth.create_custom_token(uid)
        except Exception as e:
            print(f"Error creating custom token: {e}")
            return None

    uid = req.json["uid"]
    # Generate a custom token
    custom_token = create_custom_token(uid).decode("utf-8")

    def exchange_custom_token_for_id_token(custom_token):
        url = f"http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=fake-api-key"
        data = {"token": custom_token, "returnSecureToken": True}
        response = requests.post(url, json=data)
        if response.status_code == 200:
            return response.json()["idToken"]
        else:
            print(f"Error exchanging custom token: {response.text}")
            return None

    # Exchange the custom token for an ID token
    id_token = exchange_custom_token_for_id_token(custom_token)
    return https_fn.Response(id_token)
