from fastapi import FastAPI
from app import routes
import os
from dotenv import load_dotenv


# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Include the routes from the app module
app.include_router(routes.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the League of Legends Stats API!"}