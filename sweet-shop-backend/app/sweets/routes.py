from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.models import Sweet

sweets_bp = Blueprint('sweets', __name__)

def check_admin():
    """Check if current user is admin"""
    claims = get_jwt()
    return claims.get('role') == 'admin'

@sweets_bp.route('', methods=['POST'])
@jwt_required()
def create_sweet():
    try:
        # Check if user is admin
        if not check_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.get_json()
        
        # Validate input
        required_fields = ['name', 'category', 'price']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        name = data['name'].strip()
        category = data['category'].strip()
        
        try:
            price = float(data['price'])
            if price <= 0:
                return jsonify({'error': 'Price must be greater than 0'}), 400
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid price value'}), 400
        
        quantity = int(data.get('quantity', 0))
        if quantity < 0:
            return jsonify({'error': 'Quantity cannot be negative'}), 400
        
        # Create new sweet
        sweet = Sweet.create(
            name=name,
            category=category,
            price=price,
            quantity=quantity
        )
        
        if not sweet:
            return jsonify({'error': 'Sweet with this name already exists'}), 400
        
        return jsonify({
            'message': 'Sweet added successfully',
            'sweet': Sweet.to_dict(sweet)
        }), 201
        
    except Exception as e:
        print(f"Create sweet error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@sweets_bp.route('', methods=['GET'])
def get_all_sweets():
    try:
        sweets = Sweet.get_all()
        return jsonify({
            'message': 'Sweets retrieved successfully',
            'sweets': [Sweet.to_dict(sweet) for sweet in sweets]
        }), 200
    except Exception as e:
        print(f"Get sweets error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@sweets_bp.route('/search', methods=['GET'])
def search_sweets():
    try:
        name = request.args.get('name', '').strip()
        category = request.args.get('category', '').strip()
        min_price = request.args.get('min_price')
        max_price = request.args.get('max_price')
        
        # Convert price parameters
        min_price_val = float(min_price) if min_price else None
        max_price_val = float(max_price) if max_price else None
        
        if min_price_val is not None and min_price_val < 0:
            return jsonify({'error': 'Minimum price cannot be negative'}), 400
        
        if max_price_val is not None and max_price_val < 0:
            return jsonify({'error': 'Maximum price cannot be negative'}), 400
        
        if min_price_val is not None and max_price_val is not None:
            if min_price_val > max_price_val:
                return jsonify({'error': 'Minimum price cannot be greater than maximum price'}), 400
        
        sweets = Sweet.search(
            name=name if name else None,
            category=category if category else None,
            min_price=min_price_val,
            max_price=max_price_val
        )
        
        return jsonify({
            'message': 'Search results',
            'sweets': [Sweet.to_dict(sweet) for sweet in sweets],
            'count': len(sweets)
        }), 200
        
    except ValueError:
        return jsonify({'error': 'Invalid price value'}), 400
    except Exception as e:
        print(f"Search sweets error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@sweets_bp.route('/<sweet_id>', methods=['PUT'])
@jwt_required()
def update_sweet(sweet_id):
    try:
        # Check if user is admin
        if not check_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        sweet = Sweet.find_by_id(sweet_id)
        if not sweet:
            return jsonify({'error': 'Sweet not found'}), 404
        
        data = request.get_json()
        update_data = {}
        
        # Update fields if provided
        if 'name' in data and data['name']:
            new_name = data['name'].strip()
            if new_name != sweet['name']:
                # Check if new name already exists
                existing = Sweet.search(name=new_name)
                if existing and any(s['id'] != sweet_id for s in existing):
                    return jsonify({'error': 'Sweet with this name already exists'}), 400
                update_data['name'] = new_name
        
        if 'category' in data and data['category']:
            update_data['category'] = data['category'].strip()
        
        if 'price' in data:
            try:
                price = float(data['price'])
                if price <= 0:
                    return jsonify({'error': 'Price must be greater than 0'}), 400
                update_data['price'] = price
            except (ValueError, TypeError):
                return jsonify({'error': 'Invalid price value'}), 400
        
        if 'quantity' in data:
            try:
                quantity = int(data['quantity'])
                if quantity < 0:
                    return jsonify({'error': 'Quantity cannot be negative'}), 400
                update_data['quantity'] = quantity
            except (ValueError, TypeError):
                return jsonify({'error': 'Invalid quantity value'}), 400
        
        # Only update if there are changes
        if update_data:
            updated_sweet = Sweet.update(sweet_id, update_data)
            if not updated_sweet:
                return jsonify({'error': 'Failed to update sweet'}), 400
            
            return jsonify({
                'message': 'Sweet updated successfully',
                'sweet': Sweet.to_dict(updated_sweet)
            }), 200
        
        return jsonify({
            'message': 'No changes detected',
            'sweet': Sweet.to_dict(sweet)
        }), 200
        
    except Exception as e:
        print(f"Update sweet error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@sweets_bp.route('/<sweet_id>', methods=['DELETE'])
@jwt_required()
def delete_sweet(sweet_id):
    try:
        # Check if user is admin
        if not check_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        sweet = Sweet.find_by_id(sweet_id)
        if not sweet:
            return jsonify({'error': 'Sweet not found'}), 404
        
        # Delete sweet
        success = Sweet.delete(sweet_id)
        
        if not success:
            return jsonify({'error': 'Failed to delete sweet'}), 400
        
        return jsonify({'message': 'Sweet deleted successfully'}), 200
        
    except Exception as e:
        print(f"Delete sweet error: {e}")
        return jsonify({'error': 'Internal server error'}), 500