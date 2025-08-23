#!/usr/bin/env python3

import sys
import os

# Add current directory to Python path
sys.path.insert(0, os.getcwd())

print(f"Current working directory: {os.getcwd()}")
print(f"Python path: {sys.path}")

try:
    print("Attempting to import app...")
    import app
    print("✅ app module imported successfully")
    
    print("Attempting to import app.main...")
    import app.main
    print("✅ app.main imported successfully")
    
    print("Attempting to access app.main.app...")
    from app.main import app as fastapi_app
    print("✅ FastAPI app imported successfully")
    print(f"FastAPI app type: {type(fastapi_app)}")
    
except Exception as e:
    print(f"❌ Import error: {e}")
    import traceback
    traceback.print_exc()
