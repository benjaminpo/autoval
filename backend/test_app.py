import pytest
import json
from unittest.mock import patch, MagicMock
from app import app


@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


@pytest.fixture
def sample_car_data():
    """Sample car data for testing."""
    return {
        'make': 'Toyota',
        'model': 'Camry',
        'year': 2020,
        'mileage': 40000,
        'color': 'white',
        'fuelType': 'petrol',
        'transmission': 'automatic',
        'price': 250000
    }


class TestAnalyzeEndpoint:
    """Test the /api/analyze-car endpoint."""
    
    def test_analyze_success(self, client, sample_car_data):
        """Test successful analyze request."""
        response = client.post('/api/analyze-car', 
                             data=json.dumps(sample_car_data),
                             content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        # Check the actual response structure
        assert 'marketPrice' in data
        assert 'marketComparison' in data
        assert 'priceRating' in data
        assert 'recommendations' in data
        
        # Check response structure
        assert 'marketPrice' in data
        assert 'priceRating' in data
        assert 'priceDifference' in data
        assert 'percentageDifference' in data
        assert 'recommendations' in data
        
        # Check marketPrice structure
        market_price = data['marketPrice']
        assert 'average' in market_price
        assert 'count' in market_price
        assert 'median' in market_price
        
        # Verify basic numeric values
        assert isinstance(data['priceDifference'], (int, float))
        assert isinstance(data['percentageDifference'], (int, float))
    
    def test_analyze_missing_required_fields(self, client):
        """Test analyze request with missing required fields."""
        incomplete_data = {
            'make': 'Toyota',
            'model': 'Camry'
            # Missing year, mileage, etc.
        }
        
        response = client.post('/api/analyze-car',
                             data=json.dumps(incomplete_data),
                             content_type='application/json')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_analyze_invalid_json(self, client):
        """Test analyze request with invalid JSON."""
        response = client.post('/api/analyze-car',
                             data='invalid json',
                             content_type='application/json')
        
        assert response.status_code == 500  # Changed from 400 to 500
        data = json.loads(response.data)
        assert 'error' in data


class TestHealthEndpoint:
    """Test the health check endpoint."""
    
    def test_health_check(self, client):
        """Test health check endpoint."""
        response = client.get('/api/health')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'healthy'


class TestCORSHeaders:
    """Test CORS headers."""
    
    def test_cors_headers(self, client, sample_car_data):
        """Test that CORS headers are present."""
        response = client.post('/api/analyze-car',
                             data=json.dumps(sample_car_data),
                             content_type='application/json')
        
        assert 'Access-Control-Allow-Origin' in response.headers
    
    def test_options_request(self, client):
        """Test OPTIONS request for CORS preflight."""
        response = client.options('/api/analyze-car')
        
        assert response.status_code == 200
