from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from firebase.init import auth
from composio_config import createNewEntity, isEntityConnected
import logging
from actions.twitter import create_new_tweet
from actions.github import star_github_repo

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

origins = [
    "https://whitelabel.composio.dev",
    "https://whitelabel-green.vercel.app",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def verify_token(auth_credentials: HTTPAuthorizationCredentials = Depends(
    HTTPBearer())):
    token = auth_credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# Pydantic models
class UserData(BaseModel):
    username: str
    appType: str

class TwitterUserData(BaseModel):
    username: str

class InitialiseAgentData(BaseModel):
    username: str

class TweetRequestData(BaseModel):
    initial_tweet_entity_id: str
    post: str
    repost_data_list: list

class ExecuteActionData(BaseModel):
    entity_id: str

class NewEntityData(BaseModel):
    newUserId: str
    redirectUrl: str
    appName: str
    
@app.post("/newentity")
async def handle_request(user_data: NewEntityData,
                         decoded_token: dict = Depends(verify_token)):
    print("\n\nuser_data :: ", user_data)
    newUserId = user_data.newUserId
    redirectUrl = user_data.redirectUrl
    appName = user_data.appName
    res = createNewEntity(newUserId, redirectUrl, appName)
    return res

@app.post("/checkconnection")
async def handle_request(user_data: UserData,
                         decoded_token: dict = Depends(verify_token)):
    
    username = user_data.username
    appType = user_data.appType
    res = isEntityConnected(username, appType)
    return res

@app.post("/createtweet")
async def create_tweet(execute_action_data: ExecuteActionData, decoded_token: dict = Depends(verify_token)):
    entity_id = execute_action_data.entity_id
    res = create_new_tweet(entity_id)
    return {"result": res}

@app.post("/stargithubrepo")
async def star_repo(execute_action_data: ExecuteActionData, decoded_token: dict = Depends(verify_token)):
    entity_id = execute_action_data.entity_id
    res = star_github_repo(entity_id)
    return {"result": res}

@app.get("/")
async def handle_request():
    return "ok"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Start the server (if running locally)
# Run the following command in your terminal: uvicorn main:app --reload
