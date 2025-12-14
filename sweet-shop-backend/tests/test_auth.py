import pytest
import json
from app import create_app, db
from app.models import User

@pytest.fixture
def client():
    app = create_app('testing')
    app.config['TESTING'] = True
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

def test_register_user(client):
    """Test user registration"""
    response = client.post('/api/auth/register', 
                         json={
                             'name': 'John Doe',
                             'email': 'john@example.com',
                             'password': 'password123'
                         })
    
    data = json.loads(response.data)
    assert response.status_code == 201
    assert 'token' in data
    assert data['user']['email'] == 'john@example.com'
    assert data['user']['role'] == 'user'

def test_register_duplicate_email(client):
    """Test registration with existing email"""
    # First registration
    client.post('/api/auth/register', 
               json={
                   'name': 'John Doe',
                   'email': 'john@example.com',
                   'password': 'password123'
               })
    
    # Second registration with same email
    response = client.post('/api/auth/register', 
                         json={
                             'name': 'Jane Doe',
                             'email': 'john@example.com',
                             'password': 'password456'
                         })
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data

def test_login_success(client):
    """Test successful login"""
    # Register user first
    client.post('/api/auth/register', 
               json={
                   'name': 'John Doe',
                   'email': 'john@example.com',
                   'password': 'password123'
               })
    
    # Login
    response = client.post('/api/auth/login',
                          json={
                              'email': 'john@example.com',
                              'password': 'password123'
                          })
    
    data = json.loads(response.data)
    assert response.status_code == 200
    assert 'token' in data
    assert data['user']['email'] == 'john@example.com'

def test_login_invalid_password(client):
    """Test login with invalid password"""
    # Register user
    client.post('/api/auth/register', 
               json={
                   'name': 'John Doe',
                   'email': 'john@example.com',
                   'password': 'password123'
               })
    
    # Login with wrong password
    response = client.post('/api/auth/login',
                          json={
                              'email': 'john@example.com',
                              'password': 'wrongpassword'
                          })
    
    assert response.status_code == 401

def test_login_nonexistent_user(client):
    """Test login with non-existent user"""
    response = client.post('/api/auth/login',
                          json={
                              'email': 'nonexistent@example.com',
                              'password': 'password123'
                          })
    
    assert response.status_code == 401