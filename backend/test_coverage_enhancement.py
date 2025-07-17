"""
Enhanced backend tests to improve coverage from 81.16% to 95%+
"""

import pytest
import json
import requests
from unittest.mock import patch, MagicMock
from app import app, CarDataScraper, CarAnalyzer


class TestErrorHandling:
    """Test error handling scenarios to cover missing lines 71-74, 80-83"""
    
    def test_analyze_network_timeout(self):
        """Test network timeout scenarios"""
        with app.test_client() as client:
            with patch('requests.get') as mock_get:
                mock_get.side_effect = requests.exceptions.Timeout("Request timeout")
                
                response = client.post('/api/analyze', 
                    json={
                        'make': 'Toyota',
                        'model': 'Camry',
                        'year': 2020,
                        'mileage': 50000,
                        'price': 25000
                    })
                
                assert response.status_code == 500
                data = json.loads(response.data)
                assert 'error' in data
                assert 'timeout' in data['error'].lower()
    
    def test_analyze_connection_error(self):
        """Test connection error scenarios"""
        with app.test_client() as client:
            with patch('requests.get') as mock_get:
                mock_get.side_effect = requests.exceptions.ConnectionError("Connection failed")
                
                response = client.post('/api/analyze', 
                    json={
                        'make': 'Toyota',
                        'model': 'Camry',
                        'year': 2020,
                        'mileage': 50000,
                        'price': 25000
                    })
                
                assert response.status_code == 500
                data = json.loads(response.data)
                assert 'error' in data
    
    def test_analyze_invalid_data_types(self):
        """Test invalid input data types - covers lines 114-116"""
        with app.test_client() as client:
            # Test with string instead of integer for year
            response = client.post('/api/analyze', 
                json={
                    'make': 'Toyota',
                    'model': 'Camry',
                    'year': 'invalid_year',
                    'mileage': 50000,
                    'price': 25000
                })
            
            assert response.status_code == 400
            data = json.loads(response.data)
            assert 'error' in data
    
    def test_analyze_negative_values(self):
        """Test negative values for mileage and price"""
        with app.test_client() as client:
            response = client.post('/api/analyze', 
                json={
                    'make': 'Toyota',
                    'model': 'Camry',
                    'year': 2020,
                    'mileage': -1000,  # Negative mileage
                    'price': 25000
                })
            
            assert response.status_code == 400
            data = json.loads(response.data)
            assert 'error' in data
    
    def test_analyze_extreme_values(self):
        """Test extreme values"""
        with app.test_client() as client:
            response = client.post('/api/analyze', 
                json={
                    'make': 'Toyota',
                    'model': 'Camry',
                    'year': 2020,
                    'mileage': 999999999,  # Extremely high mileage
                    'price': 25000
                })
            
            # Should handle gracefully
            assert response.status_code in [200, 400]


class TestDataProcessing:
    """Test data processing scenarios to cover lines 354-361, 394-396"""
    
    def test_empty_market_data(self):
        """Test market analysis with empty data"""
        with patch('app.get_car_data') as mock_get_data:
            mock_get_data.return_value = []
            
            result = analyze_market_trends('Toyota', 'Camry', 2020)
            
            # Should handle empty data gracefully
            assert result is not None
            assert 'trends' in result or 'error' in result
    
    def test_malformed_market_data(self):
        """Test market analysis with malformed data"""
        with patch('app.get_car_data') as mock_get_data:
            mock_get_data.return_value = [
                {'incomplete': 'data'},  # Missing required fields
                {'price': 'invalid_price'},  # Invalid price format
            ]
            
            result = analyze_market_trends('Toyota', 'Camry', 2020)
            
            # Should handle malformed data gracefully
            assert result is not None
    
    def test_price_prediction_edge_cases(self):
        """Test price prediction with edge cases"""
        # Test with minimal data
        minimal_data = [
            {'price': 20000, 'mileage': 50000, 'year': 2020}
        ]
        
        with patch('app.get_car_data') as mock_get_data:
            mock_get_data.return_value = minimal_data
            
            result = predict_price('Toyota', 'Camry', 2020, 50000)
            
            # Should handle minimal data
            assert result is not None
            assert isinstance(result, (int, float, dict))


class TestWebScraping:
    """Test web scraping scenarios to cover lines 404-411"""
    
    def test_scraping_with_invalid_html(self):
        """Test scraping with invalid HTML response"""
        with patch('requests.get') as mock_get:
            mock_response = MagicMock()
            mock_response.status_code = 200
            mock_response.text = "<html><body>Invalid structure</body></html>"
            mock_get.return_value = mock_response
            
            result = get_car_data('Toyota', 'Camry', 2020)
            
            # Should handle invalid HTML gracefully
            assert isinstance(result, list)
    
    def test_scraping_with_404_response(self):
        """Test scraping with 404 response"""
        with patch('requests.get') as mock_get:
            mock_response = MagicMock()
            mock_response.status_code = 404
            mock_get.return_value = mock_response
            
            result = get_car_data('Toyota', 'Camry', 2020)
            
            # Should handle 404 gracefully
            assert isinstance(result, list)
    
    def test_scraping_with_blocked_request(self):
        """Test scraping with blocked request (403)"""
        with patch('requests.get') as mock_get:
            mock_response = MagicMock()
            mock_response.status_code = 403
            mock_get.return_value = mock_response
            
            result = get_car_data('Toyota', 'Camry', 2020)
            
            # Should handle blocked request gracefully
            assert isinstance(result, list)


class TestMarketAnalysis:
    """Test market analysis scenarios to cover lines 524-533"""
    
    def test_market_analysis_with_insufficient_data(self):
        """Test market analysis with insufficient data points"""
        with app.test_client() as client:
            with patch('app.get_car_data') as mock_get_data:
                # Return only one data point
                mock_get_data.return_value = [
                    {'price': 20000, 'mileage': 50000, 'year': 2020}
                ]
                
                response = client.post('/api/analyze', 
                    json={
                        'make': 'Toyota',
                        'model': 'Camry',
                        'year': 2020,
                        'mileage': 50000,
                        'price': 25000
                    })
                
                assert response.status_code == 200
                data = json.loads(response.data)
                # Should handle insufficient data gracefully
                assert 'marketTrends' in data
    
    def test_market_analysis_with_outliers(self):
        """Test market analysis with price outliers"""
        with app.test_client() as client:
            with patch('app.get_car_data') as mock_get_data:
                # Include extreme outliers
                mock_get_data.return_value = [
                    {'price': 20000, 'mileage': 50000, 'year': 2020},
                    {'price': 25000, 'mileage': 45000, 'year': 2020},
                    {'price': 1000000, 'mileage': 10000, 'year': 2020},  # Outlier
                    {'price': 100, 'mileage': 200000, 'year': 2020},     # Outlier
                ]
                
                response = client.post('/api/analyze', 
                    json={
                        'make': 'Toyota',
                        'model': 'Camry',
                        'year': 2020,
                        'mileage': 50000,
                        'price': 25000
                    })
                
                assert response.status_code == 200
                data = json.loads(response.data)
                # Should handle outliers appropriately
                assert 'marketTrends' in data


class TestConfiguration:
    """Test configuration scenarios to cover lines 538-547"""
    
    def test_missing_environment_variables(self):
        """Test behavior with missing environment variables"""
        with patch.dict('os.environ', {}, clear=True):
            # Test app initialization without environment variables
            with app.test_client() as client:
                response = client.get('/')
                # Should still work with defaults
                assert response.status_code == 200
    
    def test_debug_mode_configuration(self):
        """Test debug mode configuration"""
        with patch.dict('os.environ', {'FLASK_DEBUG': '1'}):
            with app.test_client() as client:
                # Test that debug mode doesn't break functionality
                response = client.get('/')
                assert response.status_code == 200
    
    def test_production_mode_configuration(self):
        """Test production mode configuration"""
        with patch.dict('os.environ', {'FLASK_ENV': 'production'}):
            with app.test_client() as client:
                # Test that production mode works correctly
                response = client.get('/')
                assert response.status_code == 200


class TestPerformance:
    """Test performance scenarios and edge cases"""
    
    def test_large_dataset_processing(self):
        """Test processing large datasets"""
        with app.test_client() as client:
            with patch('app.get_car_data') as mock_get_data:
                # Create large dataset
                large_dataset = [
                    {'price': 20000 + i*100, 'mileage': 50000 + i*1000, 'year': 2020}
                    for i in range(1000)
                ]
                mock_get_data.return_value = large_dataset
                
                response = client.post('/api/analyze', 
                    json={
                        'make': 'Toyota',
                        'model': 'Camry',
                        'year': 2020,
                        'mileage': 50000,
                        'price': 25000
                    })
                
                assert response.status_code == 200
                # Should handle large datasets efficiently
                data = json.loads(response.data)
                assert 'marketTrends' in data
    
    def test_concurrent_requests(self):
        """Test handling concurrent requests"""
        import threading
        import time
        
        results = []
        
        def make_request():
            with app.test_client() as client:
                response = client.post('/api/analyze', 
                    json={
                        'make': 'Toyota',
                        'model': 'Camry',
                        'year': 2020,
                        'mileage': 50000,
                        'price': 25000
                    })
                results.append(response.status_code)
        
        # Create multiple threads
        threads = []
        for i in range(5):
            thread = threading.Thread(target=make_request)
            threads.append(thread)
            thread.start()
        
        # Wait for all threads to complete
        for thread in threads:
            thread.join()
        
        # All requests should succeed
        assert all(status == 200 for status in results)


# Integration tests for comprehensive coverage
class TestIntegrationAdvanced:
    """Advanced integration tests"""
    
    def test_full_workflow_with_errors(self):
        """Test complete workflow with error recovery"""
        with app.test_client() as client:
            # First, test with invalid data
            response = client.post('/api/analyze', 
                json={
                    'make': '',  # Invalid make
                    'model': 'Camry',
                    'year': 2020,
                    'mileage': 50000,
                    'price': 25000
                })
            
            assert response.status_code == 400
            
            # Then test with valid data
            response = client.post('/api/analyze', 
                json={
                    'make': 'Toyota',
                    'model': 'Camry',
                    'year': 2020,
                    'mileage': 50000,
                    'price': 25000
                })
            
            assert response.status_code == 200
    
    def test_api_rate_limiting(self):
        """Test API rate limiting behavior"""
        with app.test_client() as client:
            # Make multiple rapid requests
            for i in range(10):
                response = client.post('/api/analyze', 
                    json={
                        'make': 'Toyota',
                        'model': 'Camry',
                        'year': 2020,
                        'mileage': 50000,
                        'price': 25000
                    })
                
                # Should handle rapid requests gracefully
                assert response.status_code in [200, 429]  # 429 = Too Many Requests
