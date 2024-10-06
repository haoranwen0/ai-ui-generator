# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

import json
import os
import re
import requests
from typing import Dict

import anthropic
from dotenv import load_dotenv
from jsonschema import validate
from firebase_admin import auth, credentials, firestore, initialize_app
from firebase_functions import https_fn

from prompt import user_initial_prompt, assistant_initial_prompt


load_dotenv()
anthropic_api_key = os.environ.get('ANTHROPIC_API_KEY')

# Initialize Firebase Admin SDK
# cred = credentials.ApplicationDefault()
cred = credentials.Certificate("secrets/ai-ui-generator-firebase-adminsdk-3vcyq-02d8742a7f.json")
initialize_app(cred)

db = firestore.client()


project_schema = {
  "type": "object",
  "properties": {
    "name": {"type": "string"},
    "code": {"type": "string"}
  }
}

# def requires_auth(f):
#   @wraps(f)
#   def decorated_function(*args, **kwargs):
#     uid = current_uid.get()
#     if uid is None:
#       return functions.https.HttpResponse('Unauthorized', status=401)
#     return f(*args, **kwargs)
#   return decorated_function

def router(request):
  path = request.path
  method = request.method

  # Define your routes with dynamic segments
  routes = [
    {
      "pattern": r"^/projects$",
      "methods": {
        "GET": list_projects,
        "POST": create_project
      }
    },
    {
      "pattern": r"^/project/(?P<projectid>[^/]+)$",
      "methods": {
        "GET": get_project,
        "PUT": update_project,
        # "DELETE": delete_project
      }
    },
    {
      "pattern": r"^/chat$",
      "methods": {
        "POST": chat
      }
    },
    {
      "pattern": r"^/test$",
      "methods": {
        "GET": get_test_user
      }
    }
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

def list_projects(req: https_fn.Request) -> https_fn.Response:
  uid = get_uid(req.headers)
  docs = db.collection("users").document(uid).collection('projects').stream()
  project_list = []
  for doc in docs:
    project_list.append(doc.to_dict())
    # print(f"{doc.id} => {doc.to_dict()}")
  return https_fn.Response(
    json.dumps(project_list),
    status=200,
    headers={"Content-Type": "application/json"}
  )

def create_project(req: https_fn.Request) -> https_fn.Response:
  uid = get_uid(req.headers)
  project = req.json
  print(project)
  print(type(project))
  try:
    validate(project, project_schema)
  except:
    return https_fn.Response('Invalid project structure', status=405)
  _, doc_ref = db.collection("users").document(uid).collection('projects').add(project)
  return https_fn.Response(
    json.dumps({'message': 'Project created', 'projectid': doc_ref.id}),
    status=200,
    headers={"Content-Type": "application/json"}
  )

def get_project(req: https_fn.Request, projectid: str) -> https_fn.Response:
  uid = get_uid(req.headers)
  project = db.collection("users").document(uid).collection('projects').document(projectid).get()
  if not project.exists:
    return https_fn.Response('Project not found', status=404)
  return https_fn.Response(
    json.dumps(project.to_dict()),
    status=200,
    headers={"Content-Type": "application/json"}
  )

# TODO: Change so that project can't be renamed
def update_project(req: https_fn.Request, projectid: str) -> https_fn.Response:
  uid = get_uid(req.headers)
  project_ref = db.collection("users").document(uid).collection("projects").document(projectid)
  old_project = project_ref.get()
  if not old_project.exists:
    return https_fn.Response('Project not found', status=404)
  new_project = req.json
  try:
    validate(new_project, project_schema)
  except:
    return https_fn.Response('Invalid project structure', status=405)
  project_ref.update(req.json)
  return https_fn.Response(
    json.dumps({'message': 'Project updated'}),
    status=200,
    headers={"Content-Type": "application/json"}
  )

client = anthropic.Anthropic(api_key=anthropic_api_key)
def chat(req: https_fn.Request) -> https_fn.Response:
  uid = get_uid(req.headers)
  chat_history = req.json['chat_history']
  chat_history.insert(0, {'role': 'user', 'content': user_initial_prompt()})
  chat_history.insert(1, {'role': 'assistant', 'content': assistant_initial_prompt()})
  print("CHAT HISTORY", chat_history)
  completion = client.messages.create(
    model="claude-3-5-sonnet-20240620",
    messages=chat_history,
    max_tokens=8192
  )
  print(chat_history)
  print(completion.content)
  
  # Extract the text content from the completion
  response_content = completion.content[0].text if completion.content else ""
  
  # Parse the JSON string into a Python dictionary
  parsed_content = json.loads(response_content)
  
  return https_fn.Response(
    json.dumps(parsed_content),  # This will now be a properly formatted JSON
    status=200,
    headers={"Content-Type": "application/json"}
  )

def get_uid(header: Dict[str, str]) -> str:
  """
  Verifies the token using Firebase Auth.
  """
  if 'Authorization' not in header:
    raise https_fn.HttpsError(https_fn.FunctionsErrorCode.INVALID_ARGUMENT, 'No authorization token provided')

  token = header['Authorization'].split(' ')[1]
  try:
    decoded_token = auth.verify_id_token(token)
    return decoded_token['uid']
  except auth.InvalidIdTokenError:
    raise https_fn.HttpsError(https_fn.FunctionsErrorCode.UNAUTHENTICATED, 'Unauthorized')


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
    data = {
      "token": custom_token,
      "returnSecureToken": True
    }
    response = requests.post(url, json=data)
    if response.status_code == 200:
      return response.json()["idToken"]
    else:
      print(f"Error exchanging custom token: {response.text}")
      return None

  # Exchange the custom token for an ID token
  id_token = exchange_custom_token_for_id_token(custom_token)
  return https_fn.Response(id_token)
