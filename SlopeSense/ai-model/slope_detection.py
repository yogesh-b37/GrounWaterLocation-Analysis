import cv2
import numpy as np
import sys

def calculate_slope(image_path):
    """
    Calculate the average slope from a land image using image gradients.
    This is a simplified approach; for real terrain, use DEM data.
    """
    # Load image in grayscale
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        return "Error: Image not found or invalid format"

    # Apply Gaussian blur to reduce noise
    blurred = cv2.GaussianBlur(img, (5, 5), 0)

    # Calculate gradients using Sobel operator
    sobelx = cv2.Sobel(blurred, cv2.CV_64F, 1, 0, ksize=3)
    sobely = cv2.Sobel(blurred, cv2.CV_64F, 0, 1, ksize=3)

    # Calculate slope angle in degrees
    slope = np.arctan2(sobely, sobelx) * 180 / np.pi

    # Calculate average absolute slope
    avg_slope = np.mean(np.abs(slope))

    return f"Average slope: {avg_slope:.2f} degrees"

if __name__ == "__main__":
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
        result = calculate_slope(image_path)
        print(result)
    else:
        print("Usage: python slope_detection.py <image_path>")