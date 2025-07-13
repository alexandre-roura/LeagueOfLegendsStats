from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import routes
import os
from dotenv import load_dotenv


# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="League of Legends Stats API",
    description="A robust API for retrieving League of Legends player statistics",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React default
        "http://localhost:5173",  # Vite default
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Include the routes from the app module
app.include_router(routes.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the League of Legends Stats API!"}