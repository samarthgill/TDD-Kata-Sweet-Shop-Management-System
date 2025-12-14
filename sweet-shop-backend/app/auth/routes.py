from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.models import User
from datetime import datetime
import re

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    """Simple email validation"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        print("Registration endpoint hit")
        
        # Get request data
        data = request.get_json()
        print(f"Received data: {data}")
        
        if not data:
            print("No data provided")
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['name', 'email', 'password']
        missing_fields = []
        for field in required_fields:
            if field not in data or not data[field]:
                missing_fields.append(field)
        
        if missing_fields:
            print(f"Missing fields: {missing_fields}")
            return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400
        
        # Extract and clean data
        name = data['name'].strip()
        email = data['email'].strip().lower()
        password = data['password'].strip()
        
        # Get role with default to 'customer'
        role = data.get('role', 'customer').strip().lower()
        
        # Validate role
        if role not in ['admin', 'customer']:
            print(f"Invalid role: {role}")
            return jsonify({'error': 'Role must be either "admin" or "customer"'}), 400
        
        # Validate email format
        if not validate_email(email):
            print(f"Invalid email format: {email}")
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password length
        if len(password) < 6:
            print("Password too short")
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        # Check if user already exists
        existing_user = User.find_by_email(email)
        if existing_user:
            print(f"User already exists: {email}")
            return jsonify({'error': 'User with this email already exists'}), 400
        
        # Create new user
        print(f"Creating user: {email}, role: {role}")
        user = User.create(
            email=email,
            password=password,
            name=name,
            role=role
        )
        
        if not user:
            print("User creation failed")
            return jsonify({'error': 'Failed to create user'}), 500
        
        print(f"User created successfully: {user['id']}")
        
        # Create access token
        access_token = create_access_token(
            identity=str(user['id']),
            additional_claims={
                'email': user['email'],
                'role': user['role'],
                'name': user['name']
            }
        )
        
        response_data = {
            'message': 'User registered successfully',
            'token': access_token,
            'user': User.to_dict(user)
        }
        
        print(f"Registration successful: {response_data['user']['email']}")
        return jsonify(response_data), 201
        
    except Exception as e:
        print(f"Registration error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        print("Login endpoint hit")
        data = request.get_json()
        print(f"Login data: {data}")
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '').strip()
        
        if not email or not password:
            return jsonify({'error': 'Missing email or password'}), 400
        
        # Find user
        user = User.find_by_email(email)
        
        if not user:
            print(f"User not found: {email}")
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Verify password
        if not User.verify_password(user['password'], password):
            print(f"Invalid password for: {email}")
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create access token
        access_token = create_access_token(
            identity=str(user['id']),
            additional_claims={
                'email': user['email'],
                'role': user['role'],
                'name': user['name']
            }
        )
        
        response_data = {
            'message': 'Login successful',
            'token': access_token,
            'user': User.to_dict(user)
        }
        
        print(f"Login successful: {email}")
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Internal server error'}), 500