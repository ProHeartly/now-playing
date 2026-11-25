import asyncio
import json
import os
import urllib.parse
import urllib.request
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import Response
from fastapi.templating import Jinja2Templates

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="src")


@app.get("/")
@app.get("/{username}")
def root(request: Request, username: str = "heartlye"):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={"username": username}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)