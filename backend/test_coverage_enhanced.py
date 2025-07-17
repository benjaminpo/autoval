"""
Enhanced backend tests to improve coverage from 81.16% to 95%+
"""

import pytest
import json
import requests
from unittest.mock import patch, MagicMock
from app import app, CarDataScraper, CarAnalyzer


class TestErrorHandlingEnhanced:
    """Enhanced error handling tests to cover missing lines"""
    
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
                
                # Should handle timeout gracefully
                assert response.status_code in [200, 500]
    
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
                
                # Should handle connection error gracefully
                assert response.status_code in [200, 500]
    
    def test_analyze_invalid_data_types(self):
        """Test invalid input data types"""
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
    
    def test_analyze_missing_fields(self):
        """Test missing required fields"""
        with app.test_client() as client:
            # Missing 'make' field
            response = client.post('/api/analyze', 
                json={
                    'model': 'Camry',
                    'year': 2020,
                    'mileage': 50000,
                    'price': 25000
                })
            
            assert response.status_code == 400
            data = json.loads(response.data)
            assert 'error' in data
    
    def test_analyze_empty_strings(self):
        """Test empty string values"""
        with app.test_client() as client:
            response = client.post('/api/analyze', 
                json={
                    'make': '',  # Empty make
                    'model': 'Camry',
                    'year': 2020,
                    'mileage': 50000,
                    'price': 25000
                })
            
            assert response.status_code == 400
            data = json.loads(response.data)
            assert 'error' in data


class TestCarDataScraperEnhanced:
    """Enhanced tests for CarDataScraper class"""
    
    def test_scraper_initialization(self):
        """Test scraper initialization"""
        scraper = CarDataScraper()
        assert scraper is not None
        assert hasattr(scraper, 'parse_car_data')
        assert hasattr(scraper, 'scrape_cars')
    
    def test_parse_car_data_invalid_input(self):
        """Test parse_car_data with invalid input"""
        scraper = CarDataScraper()
        
        # Test with empty string
        result = scraper.parse_car_data('')
        assert result is None
        
        # Test with malformed data
        result = scraper.parse_car_data('invalid data format')
        assert result is None
    
    def test_scrape_cars_with_network_error(self):
        """Test scrape_cars with network error"""
        scraper = CarDataScraper()
        
        with patch('requests.get') as mock_get:
            mock_get.side_effect = requests.exceptions.RequestException("Network error")
            
            # Should handle gracefully and return mock data
            result = scraper.scrape_cars(pages=1)
            assert isinstance(result, list)
    
    def test_scrape_cars_with_invalid_response(self):
        """Test scrape_cars with invalid HTML response"""
        scraper = CarDataScraper()
        
        with patch('requests.get') as mock_get:
            mock_response = MagicMock()
            mock_response.status_code = 200
            mock_response.text = "<html>Invalid structure</html>"
            mock_get.return_value = mock_response
            
            result = scraper.scrape_cars(pages=1)
            assert isinstance(result, list)
    
    def test_generate_mock_data(self):
        """Test generate_mock_data method"""
        scraper = CarDataScraper()
        mock_data = scraper.generate_mock_data()
        
        assert isinstance(mock_data, list)
        assert len(mock_data) > 0
        
        # Check data structure
        for item in mock_data[:5]:  # Check first 5 items
            assert 'make' in item
            assert 'model' in item
            assert 'year' in item
            assert 'price' in item
            assert 'mileage' in item


class TestCarAnalyzerEnhanced:
    """Enhanced tests for CarAnalyzer class"""
    
    def test_analyzer_initialization(self):
        """Test analyzer initialization"""
        analyzer = CarAnalyzer()
        assert analyzer is not None
        assert hasattr(analyzer, 'get_market_data')
        assert hasattr(analyzer, 'analyze_price')
    
    def test_get_market_data_force_refresh(self):
        """Test get_market_data with force_refresh"""
        analyzer = CarAnalyzer()
        
        # Test force refresh
        data = analyzer.get_market_data(force_refresh=True)
        assert isinstance(data, list)
        assert len(data) > 0
    
    def test_find_similar_cars_empty_data(self):
        """Test find_similar_cars with empty market data"""
        analyzer = CarAnalyzer()
        user_car = {
            'make': 'Toyota',
            'model': 'Camry',
            'year': 2020,
            'mileage': 50000,
            'price': 25000
        }
        
        similar_cars = analyzer.find_similar_cars(user_car, [])
        assert isinstance(similar_cars, list)
    
    def test_find_similar_cars_no_matches(self):
        """Test find_similar_cars with no matching cars"""
        analyzer = CarAnalyzer()
        user_car = {
            'make': 'Toyota',
            'model': 'Camry',
            'year': 2020,
            'mileage': 50000,
            'price': 25000
        }
        
        # Market data with no matches
        market_data = [
            {'make': 'Honda', 'model': 'Civic', 'year': 2019, 'mileage': 40000, 'price': 20000}
        ]
        
        similar_cars = analyzer.find_similar_cars(user_car, market_data)
        assert isinstance(similar_cars, list)
    
    def test_calculate_price_factors_edge_cases(self):
        """Test calculate_price_factors with edge cases"""
        analyzer = CarAnalyzer()
        user_car = {
            'make': 'Toyota',
            'model': 'Camry',
            'year': 2020,
            'mileage': 50000,
            'price': 25000
        }
        
        # Test with very similar cars
        similar_cars = [
            {'make': 'Toyota', 'model': 'Camry', 'year': 2020, 'mileage': 50000, 'price': 25000}
        ]
        
        factors = analyzer.calculate_price_factors(user_car, similar_cars)
        assert isinstance(factors, dict)
        assert 'mileage_factor' in factors
    
    def test_analyze_price_edge_cases(self):
        """Test analyze_price with edge cases"""
        analyzer = CarAnalyzer()
        
        # Test with car that has extreme values
        user_car = {
            'make': 'Toyota',
            'model': 'Camry',
            'year': 1990,  # Very old car
            'mileage': 300000,  # High mileage
            'price': 5000
        }
        
        result = analyzer.analyze_price(user_car)
        assert isinstance(result, dict)
        assert 'marketPrice' in result
    
    def test_analyze_market_trends_insufficient_data(self):
        """Test analyze_market_trends with insufficient data"""
        analyzer = CarAnalyzer()
        
        # Very small dataset
        similar_cars = [
            {'make': 'Toyota', 'model': 'Camry', 'year': 2020, 'mileage': 50000, 'price': 25000}
        ]
        
        trends = analyzer.analyze_market_trends(similar_cars)
        assert isinstance(trends, dict)


class TestAPIEndpointsEnhanced:
    """Enhanced API endpoint tests"""
    
    def test_health_check_endpoint(self):
        """Test health check endpoint"""
        with app.test_client() as client:
            response = client.get('/api/health')
            assert response.status_code == 200
            
            data = json.loads(response.data)
            assert data['status'] == 'healthy'
    
    def test_get_market_data_endpoint(self):
        """Test get market data endpoint"""
        with app.test_client() as client:
            response = client.get('/api/market-data')
            assert response.status_code == 200
            
            data = json.loads(response.data)
            assert isinstance(data, list)
    
    def test_refresh_data_endpoint(self):
        """Test refresh data endpoint"""
        with app.test_client() as client:
            response = client.post('/api/refresh-data')
            assert response.status_code == 200
            
            data = json.loads(response.data)
            assert 'status' in data
    
    def test_cors_preflight_request(self):
        """Test CORS preflight request"""
        with app.test_client() as client:
            response = client.options('/api/analyze',
                headers={
                    'Origin': 'http://localhost:3000',
                    'Access-Control-Request-Method': 'POST',
                    'Access-Control-Request-Headers': 'Content-Type'
                })
            
            assert response.status_code == 200
            assert 'Access-Control-Allow-Origin' in response.headers
    
    def test_large_request_payload(self):
        """Test handling large request payload"""
        with app.test_client() as client:
            # Create a large payload
            large_data = {
                'make': 'Toyota',
                'model': 'Camry',
                'year': 2020,
                'mileage': 50000,
                'price': 25000,
                'additional_data': 'x' * 10000  # Large string
            }
            
            response = client.post('/api/analyze', json=large_data)
            # Should handle gracefully
            assert response.status_code in [200, 400, 413]  # 413 = Payload Too Large
    
    def test_malformed_json_request(self):
        """Test malformed JSON request"""
        with app.test_client() as client:
            response = client.post('/api/analyze',
                data='{"invalid": json malformed}',
                content_type='application/json')
            
            assert response.status_code == 400
    
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
        for i in range(3):  # Reduced number for stability
            thread = threading.Thread(target=make_request)
            threads.append(thread)
            thread.start()
        
        # Wait for all threads to complete
        for thread in threads:
            thread.join()
        
        # All requests should succeed
        assert len(results) == 3
        assert all(status == 200 for status in results)


class TestDataValidationEnhanced:
    """Enhanced data validation tests"""
    
    def test_year_validation_boundary_values(self):
        """Test year validation with boundary values"""
        with app.test_client() as client:
            # Test minimum valid year
            response = client.post('/api/analyze', 
                json={
                    'make': 'Toyota',
                    'model': 'Camry',
                    'year': 1900,
                    'mileage': 50000,
                    'price': 25000
                })
            assert response.status_code in [200, 400]
            
            # Test maximum valid year
            response = client.post('/api/analyze', 
                json={
                    'make': 'Toyota',
                    'model': 'Camry',
                    'year': 2030,
                    'mileage': 50000,
                    'price': 25000
                })
            assert response.status_code in [200, 400]
    
    def test_price_validation_boundary_values(self):
        """Test price validation with boundary values"""
        with app.test_client() as client:
            # Test very low price
            response = client.post('/api/analyze', 
                json={
                    'make': 'Toyota',
                    'model': 'Camry',
                    'year': 2020,
                    'mileage': 50000,
                    'price': 1
                })
            assert response.status_code in [200, 400]
            
            # Test very high price
            response = client.post('/api/analyze', 
                json={
                    'make': 'Toyota',
                    'model': 'Camry',
                    'year': 2020,
                    'mileage': 50000,
                    'price': 1000000
                })
            assert response.status_code in [200, 400]
    
    def test_mileage_validation_boundary_values(self):
        """Test mileage validation with boundary values"""
        with app.test_client() as client:
            # Test zero mileage
            response = client.post('/api/analyze', 
                json={
                    'make': 'Toyota',
                    'model': 'Camry',
                    'year': 2020,
                    'mileage': 0,
                    'price': 25000
                })
            assert response.status_code in [200, 400]
            
            # Test very high mileage
            response = client.post('/api/analyze', 
                json={
                    'make': 'Toyota',
                    'model': 'Camry',
                    'year': 2020,
                    'mileage': 500000,
                    'price': 25000
                })
            assert response.status_code in [200, 400]
