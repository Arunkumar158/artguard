
"""
FastAPI Backend for Art Classification

To run locally:
pip install fastapi uvicorn python-multipart pillow torch torchvision

Run with:
uvicorn fastapi_backend:app --reload
"""

import io
import json
from typing import Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import torch
import torchvision.transforms as transforms

# Initialize FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define image transformation
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Mock model prediction function
# In production, replace with your actual fine-tuned model
def predict_image(image):
    # This is a placeholder - replace with your model inference code
    # For example:
    # model = torch.load("path/to/your/model.pth")
    # with torch.no_grad():
    #     outputs = model(image.unsqueeze(0))
    
    # Mock response for demonstration
    import random
    labels = ["Handmade", "AI-Generated", "Digital"]
    label = random.choice(labels)
    confidence = 0.7 + random.random() * 0.3  # Between 0.7 and 1.0
    
    return {
        "label": label,
        "confidence": confidence
    }

@app.get("/")
def read_root():
    return {"status": "Art Classification API is running"}

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    # Check file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read and process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Preprocess the image
        img_tensor = transform(image)
        
        # Get prediction
        result = predict_image(img_tensor)
        
        return JSONResponse(content=result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

# Run using: uvicorn fastapi_backend:app --reload
