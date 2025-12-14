from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.models import Sweet

inventory_bp = Blueprint('inventory', __name__)

def check_admin():
    """Check if current user is admin"""
    claims = get_jwt()
    return claims.get('role') == 'admin'

@inventory_bp.route('/<sweet_id>/purchase', methods=['POST'])
@jwt_required()
def purchase_sweet(sweet_id):
    try:
        sweet = Sweet.find_by_id(sweet_id)
        if not sweet:
            return jsonify({'error': 'Sweet not found'}), 404
        
        data = request.get_json()
        quantity = int(data.get('quantity', 1))
        
        if quantity <= 0:
            return jsonify({'error': 'Quantity must be greater than 0'}), 400
        
        if sweet['quantity'] < quantity:
            return jsonify({'error': f'Not enough stock. Available: {sweet["quantity"]}'}), 400
        
        # Update quantity
        new_quantity = sweet['quantity'] - quantity
        update_data = {'quantity': new_quantity}
        
        updated_sweet = Sweet.update(sweet_id, update_data)
        
        if not updated_sweet:
            return jsonify({'error': 'Failed to process purchase'}), 400
        
        return jsonify({
            'message': f'Purchased {quantity} {sweet["name"]}(s) successfully',
            'sweet': Sweet.to_dict(updated_sweet)
        }), 200
        
    except ValueError:
        return jsonify({'error': 'Invalid quantity value'}), 400
    except Exception as e:
        print(f"Purchase error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@inventory_bp.route('/<sweet_id>/restock', methods=['POST'])
@jwt_required()
def restock_sweet(sweet_id):
    try:
        # Check if user is admin
        if not check_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        sweet = Sweet.find_by_id(sweet_id)
        if not sweet:
            return jsonify({'error': 'Sweet not found'}), 404
        
        data = request.get_json()
        quantity = int(data.get('quantity', 0))
        
        if quantity <= 0:
            return jsonify({'error': 'Quantity must be greater than 0'}), 400
        
        # Update quantity
        new_quantity = sweet['quantity'] + quantity
        update_data = {'quantity': new_quantity}
        
        updated_sweet = Sweet.update(sweet_id, update_data)
        
        if not updated_sweet:
            return jsonify({'error': 'Failed to restock'}), 400
        
        return jsonify({
            'message': f'Restocked {quantity} {sweet["name"]}(s) successfully',
            'sweet': Sweet.to_dict(updated_sweet)
        }), 200
        
    except ValueError:
        return jsonify({'error': 'Invalid quantity value'}), 400
    except Exception as e:
        print(f"Restock error: {e}")
        return jsonify({'error': 'Internal server error'}), 500