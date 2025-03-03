from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from chatbot_logic import get_response
from fastapi.responses import Response

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://chatbot-1-507g.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: str

@app.post("/chat")
def chat(msg: Message):
    response = get_response(msg.message)
    return {"response": response}

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI Chatbot API!"}

@app.get("/favicon.ico")
def favicon():
    return Response(status_code=204)
