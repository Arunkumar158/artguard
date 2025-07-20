import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'artguard_cnn.pth')
CLASS_LABELS = {0: "Handmade", 1: "AI", 2: "Print"}

# ImageNet normalization values
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

def load_model():
    try:
        # Load the model architecture
        from torchvision.models import mobilenet_v2
        model = mobilenet_v2(num_classes=3)
        # Load the trained weights
        model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
        model.eval()
        return model
    except Exception as e:
        raise RuntimeError(f"Failed to load model: {e}")

def preprocess_image(image_path):
    try:
        image = Image.open(image_path).convert('RGB')
    except Exception as e:
        raise ValueError(f"Invalid image path or unreadable image: {e}")
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD)
    ])
    return transform(image).unsqueeze(0)  # Add batch dimension

def predict_artwork_type(image_path: str):
    """
    Predicts the artwork type from an image file.
    Args:
        image_path (str): Path to the image file.
    Returns:
        (label: str, confidence: float): Predicted label and confidence score.
    Raises:
        ValueError: If image loading fails.
        RuntimeError: If model loading fails.
    """
    # Preprocess image
    input_tensor = preprocess_image(image_path)
    # Load model
    model = load_model()
    # Run inference
    with torch.no_grad():
        outputs = model(input_tensor)
        probs = torch.softmax(outputs, dim=1)
        confidence, pred_idx = torch.max(probs, dim=1)
        label = CLASS_LABELS.get(pred_idx.item(), "Unknown")
        return label, confidence.item()
