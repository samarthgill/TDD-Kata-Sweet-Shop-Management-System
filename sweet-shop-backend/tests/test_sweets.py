import pytest
import json
from app import create_app, db
from app.models import User, Sweet

@pytest.fixture
def client():
    app = create_app('testing')
    app.config['TESTING'] = True
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            
            # Create test users
            user = User('user@test.com', 'password123', 'Test User', 'user')
            admin = User('admin@test.com', 'password123', 'Admin User', 'admin')
            db.session.add(user)
            db.session.add(admin)
            db.session.commit()
            
            yield client
            db.session.remove()
            db.drop_all()

def get_auth_token(client, email, password):
    """Helper to get auth token"""
    response = client.post('/api/auth/login',
                          json={'email': email, 'password': password})
    data = json.loads(response.data)
    return data['token']

def test_create_sweet_admin(client):
    """Test creating sweet as admin"""
    token = get_auth_token(client, 'admin@test.com', 'password123')
    
    response = client.post('/api/sweets',
                         json={
                             'name': 'Chocolate Bar',
                             'category': 'Chocolate',
                             'price': 2.99,
                             'quantity': 100
                         },
                         headers={'Authorization': f'Bearer {token}'})
    
    data = json.loads(response.data)
    assert response.status_code == 201
    assert data['name'] == 'Chocolate Bar'
    assert data['price'] == 2.99

def test_create_sweet_non_admin(client):
    """Test creating sweet as non-admin should fail"""
    token = get_auth_token(client, 'user@test.com', 'password123')
    
    response = client.post('/api/sweets',
                         json={
                             'name': 'Chocolate Bar',
                             'category': 'Chocolate',
                             'price': 2.99,
                             'quantity': 100
                         },
                         headers={'Authorization': f'Bearer {token}'})
    
    assert response.status_code == 403

def test_get_all_sweets(client):
    """Test getting all sweets"""
    # First create a sweet as admin
    admin_token = get_auth_token(client, 'admin@test.com', 'password123')
    client.post('/api/sweets',
               json={
                   'name': 'Chocolate Bar',
                   'category': 'Chocolate',
                   'price': 2.99,
                   'quantity': 100
               },
               headers={'Authorization': f'Bearer {admin_token}'})
    
    # Get sweets (no auth required)
    response = client.get('/api/sweets')
    data = json.loads(response.data)
    
    assert response.status_code == 200
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]['name'] == 'Chocolate Bar'

def test_search_sweets(client):
    """Test searching sweets"""
    admin_token = get_auth_token(client, 'admin@test.com', 'password123')
    
    # Create multiple sweets
    sweets_data = [
        {'name': 'Chocolate Bar', 'category': 'Chocolate', 'price': 2.99, 'quantity': 100},
        {'name': 'Gummy Bears', 'category': 'Gummies', 'price': 1.99, 'quantity': 50},
        {'name': 'Caramel Candy', 'category': 'Caramel', 'price': 3.49, 'quantity': 75}
    ]
    
    for sweet in sweets_data:
        client.post('/api/sweets',
                   json=sweet,
                   headers={'Authorization': f'Bearer {admin_token}'})
    
    # Search by category
    response = client.get('/api/sweets/search?category=Chocolate')
    data = json.loads(response.data)
    
    assert response.status_code == 200
    assert len(data) == 1
    assert data[0]['category'] == 'Chocolate'
    
    # Search by price range
    response = client.get('/api/sweets/search?min_price=2.0&max_price=3.0')
    data = json.loads(response.data)
    
    assert response.status_code == 200
    assert len(data) == 1
    assert data[0]['name'] == 'Chocolate Bar'