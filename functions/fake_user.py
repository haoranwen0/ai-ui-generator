# import requests

# import firebase_admin
# from firebase_admin import auth, credentials

# from main import get_id_token

# print(get_id_token("Rv2hcep1ulARPmJTqsft3797mOBP"))

# def create_test_user(email, password):
#     try:
#         user = auth.create_user(
#             email=email,
#             password=password
#         )
#         print(f"User created successfully: {user.uid}")
#         return user
#     except Exception as e:
#         print(f"Error creating user: {e}")
#         return None

# # Create a test user
# test_user = create_test_user("test@example.com", "testpassword123")

# def get_id_token():
#     def create_custom_token(uid):
#         try:
#             return auth.create_custom_token(uid)
#         except Exception as e:
#             print(f"Error creating custom token: {e}")
#             return None

#     # Generate a custom token
#     custom_token = create_custom_token("Rv2hcep1ulARPmJTqsft3797mOBP")


#     def exchange_custom_token_for_id_token(custom_token):
#         url = f"http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=fake-api-key"
#         data = {
#             "token": custom_token,
#             "returnSecureToken": True
#         }
#         response = requests.post(url, json=data)
#         if response.status_code == 200:
#             return response.json()["idToken"]
#         else:
#             print(f"Error exchanging custom token: {response.text}")
#             return None

#     # Exchange the custom token for an ID token
#     id_token = exchange_custom_token_for_id_token(custom_token)
#     print(id_token)

from jsonschema import validate

project_schema = {
  "type": "object",
  "properties": {
    "name": {"type": "string"},
    "code": {"type": "string"}
  }
}

print(validate({
  "name": "hello",
  "code": "hello"
  }, project_schema))