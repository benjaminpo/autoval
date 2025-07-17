import pytest
import json
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from app import app


@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_api_integration(client):
    """Integration test for the complete API workflow."""
    # Test data
    test_data = {
        'make': 'Toyota',
        'model': 'Camry',
        'year': 2020,
        'mileage': 40000,
        'color': 'white',
        'fuelType': 'petrol',
        'transmission': 'automatic',
        'price': 250000
    }
    
    # Make API call
    response = client.post('/api/analyze-car', 
                          data=json.dumps(test_data),
                          content_type='application/json')
    
    # Verify response
    assert response.status_code == 200
    data = json.loads(response.data)
    
    # Check response structure
    assert 'marketPrice' in data
    assert 'priceRating' in data
    assert 'priceDifference' in data
    assert 'percentageDifference' in data
    assert 'marketTrends' in data
    assert 'factors' in data
    assert 'recommendations' in data
    
    # Check marketPrice structure
    market_price = data['marketPrice']
    assert 'average' in market_price
    assert 'min' in market_price
    assert 'max' in market_price
    assert 'median' in market_price
    assert 'count' in market_price
    
    # Check types
    assert isinstance(market_price['average'], (int, float))
    assert isinstance(data['priceDifference'], (int, float))
    assert isinstance(data['percentageDifference'], (int, float))
    assert isinstance(data['priceRating'], str)
    assert isinstance(data['marketTrends'], dict)
    assert isinstance(data['factors'], dict)
    assert isinstance(data['recommendations'], list)


def test_health_endpoint(client):
    """Test the health check endpoint."""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'healthy'


def test_cors_integration(client):
    """Test CORS headers in integration."""
    response = client.post('/api/analyze-car',
                          data=json.dumps({
                              'make': 'Toyota',
                              'model': 'Camry',
                              'year': 2020,
                              'mileage': 40000,
                              'color': 'white',
                              'fuel_type': 'petrol',
                              'transmission': 'automatic',
                              'price': 250000
                          }),
                          content_type='application/json')
    
    assert 'Access-Control-Allow-Origin' in response.headers
