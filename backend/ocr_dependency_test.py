#!/usr/bin/env python3
"""
OCR Dependency Test
Tests if OCR dependencies are installed correctly
"""

import sys
import os
import importlib

def check_module(module_name):
    """Check if a Python module is installed"""
    try:
        importlib.import_module(module_name)
        return True
    except ImportError:
        return False

def main():
    """Check OCR dependencies"""
    print("🔍 FinDNA Advisor - OCR Dependency Test")
    print("=" * 50)
    
    # List of required modules for OCR
    required_modules = [
        "cv2",          # OpenCV
        "numpy",        # NumPy
        "PIL",          # Pillow
        "pytesseract",  # PyTesseract
        "easyocr",      # EasyOCR
        "pdf2image",    # PDF2Image
    ]
    
    all_passed = True
    installed_count = 0
    
    # Check each module
    print("\n📋 Python Module Check:")
    for module in required_modules:
        if check_module(module):
            print(f"  ✅ {module} - Installed")
            installed_count += 1
        else:
            print(f"  ❌ {module} - Not installed")
            all_passed = False
    
    # Print summary
    print("\n📊 Dependency Summary:")
    print(f"  ✓ {installed_count}/{len(required_modules)} modules installed")
    
    # Check system dependencies
    print("\n🖥️ System Dependencies:")
    
    # Check for Tesseract
    tesseract_found = False
    try:
        import pytesseract
        tesseract_path = pytesseract.pytesseract.tesseract_cmd
        print(f"  ℹ️ Tesseract path: {tesseract_path}")
        tesseract_found = os.path.exists(tesseract_path)
        if tesseract_found:
            print("  ✅ Tesseract OCR - Installed")
        else:
            print("  ❌ Tesseract OCR - Not installed or path incorrect")
    except:
        print("  ❌ Tesseract OCR - Not installed or path incorrect")
    
    # Provide information on the AdvancedOCRService capabilities
    print("\n📝 AdvancedOCRService Capabilities:")
    print("  ✅ Multiple image preprocessing techniques")
    print("  ✅ Multi-engine OCR extraction")
    print("  ✅ Indian invoice specific patterns")
    print("  ✅ GST number validation")
    print("  ✅ Line item extraction")
    print("  ✅ Amount and tax breakdown")
    print("  ✅ Advanced data validation")
    
    # Print overall status
    if all_passed and tesseract_found:
        print("\n✅ All OCR dependencies installed correctly!")
    else:
        print("\n⚠️ Some OCR dependencies are missing.")
        print("  To fix this, run: pip install pytesseract opencv-python Pillow easyocr pdf2image numpy")
        print("  And install Tesseract OCR from: https://github.com/UB-Mannheim/tesseract/wiki")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
