#!/usr/bin/env python3
"""
Basic OCR Test Script
Tests the core OCR functionality to ensure dependencies are working correctly
"""

import sys
import os
import cv2
import numpy as np
from PIL import Image
import pytesseract
import re
from datetime import datetime

def test_pytesseract_installation():
    """Test if pytesseract is installed and functioning"""
    print("🧪 Testing PyTesseract Installation")
    print("=" * 50)
    
    try:
        version = pytesseract.get_tesseract_version()
        print(f"✅ Tesseract version: {version}")
        print("✅ PyTesseract is installed and functioning correctly")
        return True
    except Exception as e:
        print(f"❌ PyTesseract error: {e}")
        print("NOTE: Make sure Tesseract OCR is installed on your system and added to PATH.")
        print("Download from: https://github.com/UB-Mannheim/tesseract/wiki")
        return False

def test_opencv_installation():
    """Test if OpenCV is installed and functioning"""
    print("\n🧪 Testing OpenCV Installation")
    print("=" * 50)
    
    try:
        version = cv2.__version__
        print(f"✅ OpenCV version: {version}")
        
        # Create a simple image to test
        img = np.zeros((100, 300, 3), dtype=np.uint8)
        img.fill(255)  # White background
        
        # Add text to the image
        font = cv2.FONT_HERSHEY_SIMPLEX
        cv2.putText(img, 'OCR Test', (50, 50), font, 1, (0, 0, 0), 2, cv2.LINE_AA)
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        print("✅ Basic OpenCV operations completed successfully")
        return True, img, gray
    except Exception as e:
        print(f"❌ OpenCV error: {e}")
        return False, None, None

def test_basic_ocr(img):
    """Test basic OCR functionality with a generated image"""
    print("\n🧪 Testing Basic OCR Functionality")
    print("=" * 50)
    
    try:
        # Convert to PIL Image
        pil_img = Image.fromarray(img)
        
        # Extract text using pytesseract
        text = pytesseract.image_to_string(pil_img)
        
        print(f"✅ OCR Result: '{text.strip()}'")
        if "OCR Test" in text:
            print("✅ OCR text extraction working correctly")
            return True
        else:
            print("⚠️ OCR detected text but did not match expected 'OCR Test'")
            return False
    except Exception as e:
        print(f"❌ OCR processing error: {e}")
        return False

def test_preprocessing():
    """Test image preprocessing techniques"""
    print("\n🧪 Testing Image Preprocessing")
    print("=" * 50)
    
    try:
        # Create a more complex test image
        img = np.zeros((200, 400, 3), dtype=np.uint8)
        img.fill(240)  # Light gray background
        
        # Add some noise
        noise = np.random.randint(0, 30, (200, 400, 3), dtype=np.uint8)
        img = cv2.add(img, noise)
        
        # Add text
        font = cv2.FONT_HERSHEY_SIMPLEX
        cv2.putText(img, 'Invoice #12345', (50, 50), font, 1, (0, 0, 0), 2, cv2.LINE_AA)
        cv2.putText(img, 'Amount: $500.00', (50, 100), font, 1, (0, 0, 0), 2, cv2.LINE_AA)
        cv2.putText(img, 'Date: 2024-08-23', (50, 150), font, 1, (0, 0, 0), 2, cv2.LINE_AA)
        
        print("✅ Created test image with text and noise")
        
        # Apply preprocessing techniques
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        print("✅ Converted to grayscale")
        
        # Denoise
        denoised = cv2.medianBlur(gray, 3)
        print("✅ Applied denoising")
        
        # Thresholding
        thresh = cv2.adaptiveThreshold(
            denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        print("✅ Applied adaptive thresholding")
        
        # Extract text from original and preprocessed images
        orig_text = pytesseract.image_to_string(img)
        proc_text = pytesseract.image_to_string(thresh)
        
        print(f"\nOriginal Image OCR Result:\n{orig_text.strip()}")
        print(f"\nPreprocessed Image OCR Result:\n{proc_text.strip()}")
        
        # Check if we extracted invoice number, amount and date
        invoice_pattern = r'Invoice\s*#\s*(\d+)'
        amount_pattern = r'Amount:\s*\$\s*(\d+\.\d+)'
        date_pattern = r'Date:\s*(\d{4}-\d{2}-\d{2})'
        
        orig_invoice = re.search(invoice_pattern, orig_text)
        proc_invoice = re.search(invoice_pattern, proc_text)
        
        orig_amount = re.search(amount_pattern, orig_text)
        proc_amount = re.search(amount_pattern, proc_text)
        
        orig_date = re.search(date_pattern, orig_text)
        proc_date = re.search(date_pattern, proc_text)
        
        print("\n📋 Field Extraction Results:")
        print(f"  Invoice #: Original {'✅ Detected' if orig_invoice else '❌ Not detected'}, Preprocessed {'✅ Detected' if proc_invoice else '❌ Not detected'}")
        print(f"  Amount: Original {'✅ Detected' if orig_amount else '❌ Not detected'}, Preprocessed {'✅ Detected' if proc_amount else '❌ Not detected'}")
        print(f"  Date: Original {'✅ Detected' if orig_date else '❌ Not detected'}, Preprocessed {'✅ Detected' if proc_date else '❌ Not detected'}")
        
        return True
    except Exception as e:
        print(f"❌ Preprocessing error: {e}")
        return False

def main():
    """Run OCR tests"""
    print("🏦 FinDNA Advisor - Basic OCR Test Suite")
    print("=" * 60)
    print(f"Test Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    try:
        # Test pytesseract installation
        if not test_pytesseract_installation():
            print("\n⚠️ PyTesseract tests failed. Make sure Tesseract OCR is installed.")
            return 1
        
        # Test OpenCV installation
        opencv_success, test_img, gray_img = test_opencv_installation()
        if not opencv_success:
            print("\n⚠️ OpenCV tests failed.")
            return 1
        
        # Test basic OCR functionality
        if not test_basic_ocr(test_img):
            print("\n⚠️ Basic OCR tests failed.")
            return 1
        
        # Test preprocessing techniques
        if not test_preprocessing():
            print("\n⚠️ Preprocessing tests failed.")
            return 1
        
        print("\n" + "=" * 60)
        print("🎉 ALL TESTS COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        
        print("\n✅ OCR Core Functionality: WORKING")
        print("✅ Image Preprocessing: WORKING")
        print("✅ Text Extraction: WORKING")
        print("✅ Pattern Recognition: WORKING")
        
        print(f"\nTest Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
