from datetime import datetime
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from bson import ObjectId
from bson.errors import InvalidId

# Initialize extensions
mongo = PyMongo()
bcrypt = Bcrypt()

def to_object_id(id_str):
    """Convert string to ObjectId, return None if invalid"""
    try:
        return ObjectId(id_str)
    except (InvalidId, TypeError):
        return None

class User:
    @staticmethod
    def create(email, password, name, role='customer'):
        users = mongo.db.users
        
        # Check if user already exists
        if users.find_one({'email': email}):
            return None
        
        # Create user document
        user_data = {
            'email': email,
            'password': bcrypt.generate_password_hash(password).decode('utf-8'),
            'name': name,
            'role': role,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = users.insert_one(user_data)
        user_data['id'] = str(result.inserted_id)
        return user_data
    
    @staticmethod
    def find_by_email(email):
        users = mongo.db.users
        user = users.find_one({'email': email})
        if user:
            user['id'] = str(user['_id'])
            del user['_id']
        return user
    
    @staticmethod
    def find_by_id(user_id):
        users = mongo.db.users
        obj_id = to_object_id(user_id)
        if not obj_id:
            return None
        user = users.find_one({'_id': obj_id})
        if user:
            user['id'] = str(user['_id'])
            del user['_id']
        return user
    
    @staticmethod
    def verify_password(stored_password, provided_password):
        return bcrypt.check_password_hash(stored_password, provided_password)
    
    @staticmethod
    def to_dict(user):
        if not user:
            return None
        return {
            'id': user.get('id'),
            'email': user.get('email'),
            'name': user.get('name'),
            'role': user.get('role'),
            'created_at': user.get('created_at').isoformat() if user.get('created_at') else None
        }

class Sweet:
    @staticmethod
    def create(name, category, price, quantity=0):
        sweets = mongo.db.sweets
        
        # Check if sweet already exists
        if sweets.find_one({'name': name}):
            return None
        
        # Create sweet document
        sweet_data = {
            'name': name,
            'category': category,
            'price': float(price),
            'quantity': int(quantity),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = sweets.insert_one(sweet_data)
        sweet_data['id'] = str(result.inserted_id)
        return sweet_data
    
    @staticmethod
    def get_all():
        sweets = mongo.db.sweets.find().sort('name', 1)
        result = []
        for sweet in sweets:
            sweet['id'] = str(sweet['_id'])
            del sweet['_id']
            result.append(sweet)
        return result
    
    @staticmethod
    def find_by_id(sweet_id):
        sweets = mongo.db.sweets
        obj_id = to_object_id(sweet_id)
        if not obj_id:
            return None
        sweet = sweets.find_one({'_id': obj_id})
        if sweet:
            sweet['id'] = str(sweet['_id'])
            del sweet['_id']
        return sweet
    
    @staticmethod
    def update(sweet_id, update_data):
        sweets = mongo.db.sweets
        obj_id = to_object_id(sweet_id)
        if not obj_id:
            return None
            
        update_data['updated_at'] = datetime.utcnow()
        
        result = sweets.update_one(
            {'_id': obj_id},
            {'$set': update_data}
        )
        
        if result.modified_count > 0:
            return Sweet.find_by_id(sweet_id)
        return None
    
    @staticmethod
    def delete(sweet_id):
        sweets = mongo.db.sweets
        obj_id = to_object_id(sweet_id)
        if not obj_id:
            return False
        result = sweets.delete_one({'_id': obj_id})
        return result.deleted_count > 0
    
    @staticmethod
    def search(name=None, category=None, min_price=None, max_price=None):
        sweets = mongo.db.sweets
        query = {}
        
        if name:
            query['name'] = {'$regex': name, '$options': 'i'}
        
        if category:
            query['category'] = {'$regex': category, '$options': 'i'}
        
        if min_price is not None or max_price is not None:
            query['price'] = {}
            if min_price is not None:
                query['price']['$gte'] = float(min_price)
            if max_price is not None:
                query['price']['$lte'] = float(max_price)
        
        results = sweets.find(query).sort('name', 1)
        sweet_list = []
        for sweet in results:
            sweet['id'] = str(sweet['_id'])
            del sweet['_id']
            sweet_list.append(sweet)
        return sweet_list
    
    @staticmethod
    def to_dict(sweet):
        if not sweet:
            return None
        return {
            'id': sweet.get('id'),
            'name': sweet.get('name'),
            'category': sweet.get('category'),
            'price': sweet.get('price'),
            'quantity': sweet.get('quantity'),
            'created_at': sweet.get('created_at').isoformat() if sweet.get('created_at') else None,
            'updated_at': sweet.get('updated_at').isoformat() if sweet.get('updated_at') else None
        }

# Export mongo and bcrypt
__all__ = ['mongo', 'bcrypt', 'User', 'Sweet']