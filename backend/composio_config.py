from composio import ComposioToolSet, App, Composio, Action
from composio.client.exceptions import NoItemsFound
import os
from dotenv import load_dotenv
load_dotenv()
from firebase.init_class import FirebaseService

firebase_service = FirebaseService()

COMPOSIO_API_KEY = os.getenv('COMPOSIO_API_KEY')

def isEntityConnected(entity_id: str, appType: str):
    toolset = ComposioToolSet(api_key=COMPOSIO_API_KEY,
                              entity_id=entity_id)
    entity = toolset.get_entity()
    app_enum = getattr(App, appType)
    try:
        entity.get_connection(app=app_enum)
        response = {
            "authenticated": "yes",
            "message": f"User {entity_id} is authenticated with {appType}",
        }
        return response
    except NoItemsFound as e:
        response = {
            "authenticated": "no",
            "message": f"User {entity_id} is not authenticated with {appType}",
        }
        return response

def createNewEntity(newUserId: str, redirectUrl: str, appName: str):
    toolset = ComposioToolSet(api_key=COMPOSIO_API_KEY,
                              entity_id=newUserId)
    entity = toolset.get_entity()
    app_enum = getattr(App, appName)
    try:
        entity.get_connection(app=app_enum)
        response = {
            "authenticated": "yes",
            "message": f"User {newUserId} is already authenticated with {appName}",
            "url": ""
        }
        return response
    except NoItemsFound as e:
        app_integration_ids = {
            "TWITTER": os.getenv('TWITTER_INTEGRATION_ID'),
            "GITHUB": os.getenv('GITHUB_INTEGRATION_ID')
        }
        integration = entity.client.integrations.get_by_id(app_integration_ids[app_enum])
        request = entity.initiate_connection(
                app_name=app_enum, redirect_url=redirectUrl, integration=integration
        )
        response = {
            "authenticated": "no",
            "message": f"User {newUserId} is not yet authenticated with {appName}. Please authenticate.",
            "url": request.redirectUrl
        }
        return response
    
# print(createNewEntity("TestUser", "https://www.google.com", "GITHUB"))