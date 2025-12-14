import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_connection():
    """Test if server is running"""
    try:
        response = requests.get(f"{BASE_URL}/sweets")
        print(f"Connection test: {response.status_code}")
        return True
    except Exception as e:
        print(f"Connection failed: {e}")
        return False

def test_registration():
    """Test registration endpoint"""
    test_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123",
        "role": "customer"
    }
    
    print(f"\nTesting registration with data: {test_data}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            data = response.json()
            print(f"Success! Token: {data.get('token', 'No token')}")
            return data.get('token')
        return None
        
    except Exception as e:
        print(f"Request failed: {e}")
        return None

def test_login():
    """Test login endpoint"""
    login_data = {
        "email": "test@example.com",
        "password": "password123"
    }
    
    print(f"\nTesting login with data: {login_data}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Success! Token: {data.get('token', 'No token')}")
            return data.get('token')
        return None
        
    except Exception as e:
        print(f"Request failed: {e}")
        return None

def test_protected_endpoint(token):
    """Test a protected endpoint"""
    print(f"\nTesting protected endpoint with token")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(
            f"{BASE_URL}/sweets",
            headers=headers
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    print("=" * 50)
    print("Testing TDD Kata Backend API")
    print("=" * 50)
    
    # Test connection
    if not test_connection():
        print("Server is not running. Please start the backend first.")
        exit(1)
    
    # Test registration
    token = test_registration()
    
    # Test login
    if token:
        test_protected_endpoint(token)
    else:
        print("\nRegistration failed, testing login with existing user...")
        token = test_login()
        if token:
            test_protected_endpoint(token)