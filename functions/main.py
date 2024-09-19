# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

import re
from functools import wraps
from typing import Dict

import firebase_admin
from firebase_admin import auth, credentials, firestore, initialize_app
from firebase_functions import https_fn

# Initialize Firebase Admin SDK
cred = credentials.ApplicationDefault()
initialize_app(cred)

db = firestore.client()


# def requires_auth(f):
#   @wraps(f)
#   def decorated_function(*args, **kwargs):
#     uid = current_uid.get()
#     if uid is None:
#       return functions.https.HttpResponse('Unauthorized', status=401)
#     return f(*args, **kwargs)
#   return decorated_function

def router(request):
  # Get the path from the request
  path = request.path

  # Define your routes with regex patterns
  routes = [
    (r'^/projects$', projects),
    (r'^/project/(?P<projectid>[^/]+)$', project)
  ]

  # Check if the path matches any of our routes
  for pattern, handler in routes:
    match = re.match(pattern, path)
    if match:
      # Call the corresponding function with captured groups as kwargs
      return handler(request, **match.groupdict())

  # Return a 404 if no route matches
  return https_fn.HttpResponse('Not Found', status=404)

@https_fn.on_request()
def main(req: https_fn.Request) -> https_fn.HttpResponse:
  return router(req)

def add_message(req: https_fn.Request) -> https_fn.Response:
  # Get the message from the request
  original = req.args.get('text', '')

  # Add the message to Firestore
  doc_ref = db.collection('messages').document()
  doc_ref.set({
    'original': original
  })

  return https_fn.Response(f"Message added with ID: {doc_ref.id}")

def projects(req: https_fn.Request) -> https_fn.Response:
  if req.method == "GET":
    return list_projects(req)
  elif req.method == "POST":
    return create_project(req)

def list_projects(req):
  uid = get_uid(req.headers)
  docs = db.collection("users").document(uid).collection('projects')
  for doc in docs:
    print(f"{doc.id} => {doc.to_dict()}")
  return https_fn.Response(f"Message added with ID: {doc_ref.id}")

def create_project(req: https_fn.Request) -> https_fn.Response:
  uid = get_uid(req.headers)
  project = req.json
  _, doc_ref = db.collection("users").document(uid).collection('projects').add(project)
  return {'message': 'Project created', 'id': doc_ref.id}

def project(req: https_fn.Request, projectid: str) -> https_fn.Response:
  if req.method == "GET":
    return get_project(req, projectid)
  else: 
    return https_fn.Response('Method not allowed', status=405)

def get_project(req: https_fn.Request, project_id: str) -> https_fn.Response: 
  uid = get_uid(req.headers)
  project = db.collection("users").document(uid).collection('projects').document(project_id).get()
  if not project.exists:
    return https_fn.Response('Project not found', status=404)
  if project.to_dict()['userId'] != uid: 
    return https_fn.Response('Unauthorized', status=401)
  return project.to_dict()

def create_project(req: https_fn.Request) -> https_fn.Response:
  # Get the message from the request
  original = req.args.get('text', '')

  # Add the message to Firestore
  doc_ref = db.collection('messages').document()
  doc_ref.set({
    'original': original
  })

  return https_fn.Response(f"Message added with ID: {doc_ref.id}")

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
