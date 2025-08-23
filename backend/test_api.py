#!/usr/bin/env python3
"""
Test script for FinVoice Backend API
Tests core functionality including authentication, file upload, and AI services
"""

import asyncio
import aiohttp
import json
import os
from pathlib import Path

# Test configuration
BASE_URL = "http://localhost:8000"
TEST_USER = {
    "email": "test@finvoice.com",
    "password": "testpassword123",
    "full_name": "Test User"
}

class FinVoiceAPITester:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session = None
        self.auth_token = None
        
    async def start_session(self):
        """Start HTTP session"""
        self.session = aiohttp.ClientSession()
        
    async def close_session(self):
        """Close HTTP session"""
        if self.session:
            await self.session.close()
    
    async def test_health_check(self):
        """Test basic health check"""
        print("Testing health check...")
        try:
            async with self.session.get(f"{self.base_url}/health") as response:
                data = await response.json()
                print(f"✅ Health check: {data}")
                return response.status == 200
        except Exception as e:
            print(f"❌ Health check failed: {e}")
            return False
    
    async def test_root_endpoint(self):
        """Test root endpoint"""
        print("Testing root endpoint...")
        try:
            async with self.session.get(f"{self.base_url}/") as response:
                data = await response.json()
                print(f"✅ Root endpoint: {data.get('message', 'No message')}")
                return response.status == 200
        except Exception as e:
            print(f"❌ Root endpoint failed: {e}")
            return False
    
    async def test_features_endpoint(self):
        """Test features endpoint"""
        print("Testing features endpoint...")
        try:
            async with self.session.get(f"{self.base_url}/api/features") as response:
                data = await response.json()
                features = data.get('features', {})
                print(f"✅ Features available: {len(features)} features")
                for feature, description in list(features.items())[:3]:
                    print(f"   - {feature}: {description}")
                return response.status == 200
        except Exception as e:
            print(f"❌ Features endpoint failed: {e}")
            return False
    
    async def test_user_registration(self):
        """Test user registration"""
        print("Testing user registration...")
        try:
            async with self.session.post(
                f"{self.base_url}/api/auth/register",
                json=TEST_USER
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"✅ User registration successful: {data.get('email')}")
                    return True
                elif response.status == 400:
                    error_data = await response.json()
                    if "already registered" in error_data.get("detail", "").lower():
                        print("✅ User already exists (expected for subsequent tests)")
                        return True
                    else:
                        print(f"❌ Registration failed: {error_data}")
                        return False
                else:
                    print(f"❌ Registration failed with status: {response.status}")
                    return False
        except Exception as e:
            print(f"❌ User registration failed: {e}")
            return False
    
    async def test_user_login(self):
        """Test user login and get auth token"""
        print("Testing user login...")
        try:
            login_data = {
                "username": TEST_USER["email"],  # OAuth2 format
                "password": TEST_USER["password"]
            }
            async with self.session.post(
                f"{self.base_url}/api/auth/token",
                data=login_data  # OAuth2 expects form data
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    self.auth_token = data.get("access_token")
                    print(f"✅ Login successful, token received")
                    return True
                else:
                    error_data = await response.json()
                    print(f"❌ Login failed: {error_data}")
                    return False
        except Exception as e:
            print(f"❌ User login failed: {e}")
            return False
    
    async def test_protected_endpoint(self):
        """Test accessing a protected endpoint"""
        print("Testing protected endpoint access...")
        if not self.auth_token:
            print("❌ No auth token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            async with self.session.get(
                f"{self.base_url}/api/dashboard/overview",
                headers=headers
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"✅ Protected endpoint accessible")
                    print(f"   Dashboard period: {data.get('period', 'N/A')}")
                    return True
                else:
                    error_data = await response.json()
                    print(f"❌ Protected endpoint failed: {error_data}")
                    return False
        except Exception as e:
            print(f"❌ Protected endpoint test failed: {e}")
            return False
    
    async def test_transaction_creation(self):
        """Test creating a transaction"""
        print("Testing transaction creation...")
        if not self.auth_token:
            print("❌ No auth token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            transaction_data = {
                "amount": 100.50,
                "type": "expense",
                "category": "food",
                "description": "Test restaurant expense",
                "date": "2024-01-15T12:00:00",
                "merchant_name": "Test Restaurant"
            }
            async with self.session.post(
                f"{self.base_url}/api/transactions",
                headers=headers,
                json=transaction_data
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"✅ Transaction created: ID {data.get('id')}")
                    return True
                else:
                    error_data = await response.json()
                    print(f"❌ Transaction creation failed: {error_data}")
                    return False
        except Exception as e:
            print(f"❌ Transaction creation test failed: {e}")
            return False
    
    async def test_financial_health(self):
        """Test financial health calculation"""
        print("Testing financial health calculation...")
        if not self.auth_token:
            print("❌ No auth token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            async with self.session.get(
                f"{self.base_url}/api/dashboard/financial-health",
                headers=headers
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    score = data.get('overall_score', 0)
                    level = data.get('health_level', 'unknown')
                    print(f"✅ Financial health calculated: {score}/100 ({level})")
                    return True
                else:
                    error_data = await response.json()
                    print(f"❌ Financial health calculation failed: {error_data}")
                    return False
        except Exception as e:
            print(f"❌ Financial health test failed: {e}")
            return False

    async def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting FinVoice API Tests...")
        print("=" * 50)
        
        await self.start_session()
        
        tests = [
            ("Health Check", self.test_health_check),
            ("Root Endpoint", self.test_root_endpoint),
            ("Features Endpoint", self.test_features_endpoint),
            ("User Registration", self.test_user_registration),
            ("User Login", self.test_user_login),
            ("Protected Endpoint", self.test_protected_endpoint),
            ("Transaction Creation", self.test_transaction_creation),
            ("Financial Health", self.test_financial_health),
        ]
        
        results = []
        for test_name, test_func in tests:
            print(f"\n📋 {test_name}")
            print("-" * 30)
            success = await test_func()
            results.append((test_name, success))
        
        await self.close_session()
        
        # Print summary
        print("\n" + "=" * 50)
        print("📊 TEST SUMMARY")
        print("=" * 50)
        
        passed = sum(1 for _, success in results if success)
        total = len(results)
        
        for test_name, success in results:
            status = "✅ PASS" if success else "❌ FAIL"
            print(f"{test_name:<25} {status}")
        
        print(f"\nResults: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! FinVoice API is working correctly.")
        else:
            print("⚠️  Some tests failed. Check the logs above for details.")
        
        return passed == total

async def main():
    """Main test runner"""
    print("FinVoice Backend API Test Suite")
    print("================================")
    print(f"Testing against: {BASE_URL}")
    print("Make sure the backend server is running!")
    print()
    
    tester = FinVoiceAPITester(BASE_URL)
    success = await tester.run_all_tests()
    
    return 0 if success else 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
