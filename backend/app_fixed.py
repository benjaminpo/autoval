from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import json
import re
import pandas as pd
import numpy as np
from datetime import datetime
import time
import random
from urllib.parse import quote
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CarDataScraper:
    def __init__(self):
        self.base_url = "https://dj1jklak2e.28car.com"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
    
    def generate_mock_data(self):
        """Generate mock car data for testing"""
        # Updated with more realistic Hong Kong car market data
        makes = [
            "Toyota", "Honda", "BMW", "Mercedes-Benz", "Audi", "Nissan", "Hyundai", "Kia", 
            "Mazda", "Lexus", "Volkswagen", "Ford", "Chevrolet", "Subaru", "Mitsubishi",
            "Infiniti", "Acura", "Volvo", "Jaguar", "Land Rover", "Porsche", "Tesla",
            "MINI", "Suzuki", "Peugeot", "Renault", "Citroën", "Fiat", "Alfa Romeo"
        ]
        
        # Common models for each make
        model_mapping = {
            "Toyota": ["Camry", "Corolla", "RAV4", "Highlander", "Prius", "Vios", "Wish", "Alphard"],
            "Honda": ["Civic", "Accord", "CR-V", "HR-V", "Fit", "Vezel", "Freed", "Odyssey"],
            "BMW": ["X3", "X5", "3 Series", "5 Series", "1 Series", "X1", "X6", "7 Series"],
            "Mercedes-Benz": ["C200", "C300", "E200", "E300", "GLC", "GLE", "A200", "S500"],
            "Audi": ["A4", "A6", "Q3", "Q5", "A3", "Q7", "A8", "TT"],
            "Nissan": ["Altima", "X-Trail", "Qashqai", "Sentra", "Murano", "Juke", "Note"],
            "Hyundai": ["Elantra", "Tucson", "Santa Fe", "i30", "Sonata", "Accent", "Kona"],
            "Kia": ["Optima", "Sorento", "Sportage", "Rio", "Forte", "Soul", "Stinger"],
            "Mazda": ["CX-5", "CX-3", "Mazda3", "Mazda6", "CX-9", "MX-5", "CX-30"],
            "Lexus": ["IS", "ES", "RX", "NX", "GS", "LS", "UX", "LX"],
            "Tesla": ["Model 3", "Model S", "Model X", "Model Y"],
            "Volkswagen": ["Golf", "Passat", "Tiguan", "Polo", "Jetta", "Touareg"]
        }
        
        colors = ["black", "white", "silver", "grey", "red", "blue", "green", "yellow", 
                 "orange", "purple", "brown", "gold", "bronze", "maroon", "navy", 
                 "beige", "cream", "charcoal", "pearl", "metallic"]
        
        fuel_types = ["petrol", "diesel", "hybrid", "electric"]
        transmissions = ["automatic", "manual"]
        
        cars = []
        
        # Generate more cars with better distribution
        for _ in range(1000):  # Increased from 500 to 1000
            make = random.choice(makes)
            
            # Use realistic models for each make
            if make in model_mapping:
                model = random.choice(model_mapping[make])
            else:
                model = random.choice(["Sedan", "SUV", "Hatchback", "Coupe", "Wagon"])
            
            year = random.randint(2010, 2025)  # Extended to 2025
            age = 2025 - year
            
            # More realistic price calculation based on make and year
            if make in ["BMW", "Mercedes-Benz", "Audi", "Lexus", "Porsche", "Tesla"]:
                base_price = random.randint(200000, 1500000)  # Luxury cars
            elif make in ["Toyota", "Honda", "Nissan", "Mazda", "Hyundai", "Kia"]:
                base_price = random.randint(80000, 600000)   # Popular brands
            else:
                base_price = random.randint(100000, 800000)  # Other brands
            
            # Adjust price based on age with more gradual depreciation
            depreciation_rate = 0.08 + (0.05 * random.random())  # 8-13% per year
            depreciation = min(depreciation_rate * age, 0.85)  # Max 85% depreciation
            price = int(base_price * (1 - depreciation))
            
            # Ensure minimum price
            price = max(price, 20000)
            
            # Realistic mileage based on age
            avg_km_per_year = random.randint(10000, 25000)
            mileage = avg_km_per_year * age + random.randint(-10000, 20000)
            mileage = max(mileage, 1000)  # Minimum mileage
            
            # Fuel type distribution based on make and year
            if make == "Tesla":
                fuel_type = "electric"
            elif year >= 2020 and random.random() < 0.3:
                fuel_type = random.choice(["hybrid", "electric"])
            elif make in ["Toyota", "Honda"] and random.random() < 0.4:
                fuel_type = "hybrid"
            else:
                fuel_type = random.choice(["petrol", "diesel"])
            
            car = {
                'make': make,
                'model': model,
                'year': year,
                'mileage': mileage,
                'color': random.choice(colors),
                'owners': random.choices([1, 2, 3, 4], weights=[60, 25, 12, 3])[0],
                'price': price,
                'fuel_type': fuel_type,
                'transmission': random.choices(transmissions, weights=[85, 15])[0],  # More automatics
                'seats': random.choices([5, 7, 2, 4], weights=[70, 20, 5, 5])[0],
                'engine_cc': random.randint(1000, 4000),
                'date_listed': datetime.now().strftime('%Y-%m-%d')
            }
            cars.append(car)
        
        return cars

class CarAnalyzer:
    def __init__(self):
        self.scraper = CarDataScraper()
        self.market_data = None
        self.last_update = None
    
    def get_market_data(self, force_refresh=False):
        """Get market data, refresh if needed"""
        if (self.market_data is None or force_refresh or 
            (self.last_update and (datetime.now() - self.last_update).total_seconds() > 3600)):
            
            logger.info("Fetching fresh market data...")
            self.market_data = self.scraper.generate_mock_data()  # Use mock data directly
            self.last_update = datetime.now()
        
        return self.market_data
    
    def find_similar_cars(self, user_car, market_data):
        """Find similar cars in the market with flexible matching"""
        similar_cars = []
        
        # First pass - strict matching
        for car in market_data:
            similarity_score = 0
            
            # Make and model match (high weight)
            if car['make'].lower() == user_car['make'].lower():
                similarity_score += 40
                if car['model'].lower() == user_car['model'].lower():
                    similarity_score += 30
            
            # Year similarity (medium weight)
            year_diff = abs(car['year'] - user_car['year'])
            if year_diff <= 1:
                similarity_score += 20
            elif year_diff <= 3:
                similarity_score += 15
            elif year_diff <= 5:
                similarity_score += 10
            
            # Fuel type match (medium weight)
            if car['fuel_type'] == user_car['fuel_type']:
                similarity_score += 15
            
            # Transmission match (low weight)
            if car['transmission'] == user_car['transmission']:
                similarity_score += 10
            
            # Seats match (low weight)
            if car['seats'] == user_car['seats']:
                similarity_score += 5
            
            # If similarity is high enough, include the car
            if similarity_score >= 60:
                car['similarity_score'] = similarity_score
                similar_cars.append(car)
        
        # If not enough similar cars found, lower the threshold
        if len(similar_cars) < 10:
            similar_cars = []
            for car in market_data:
                similarity_score = 0
                
                # Make match only (more lenient)
                if car['make'].lower() == user_car['make'].lower():
                    similarity_score += 50
                
                # Year similarity (more lenient)
                year_diff = abs(car['year'] - user_car['year'])
                if year_diff <= 2:
                    similarity_score += 25
                elif year_diff <= 5:
                    similarity_score += 20
                elif year_diff <= 8:
                    similarity_score += 15
                
                # Fuel type match
                if car['fuel_type'] == user_car['fuel_type']:
                    similarity_score += 15
                
                # Transmission match
                if car['transmission'] == user_car['transmission']:
                    similarity_score += 10
                
                # Price range similarity (new factor)
                price_ratio = min(car['price'], user_car['price']) / max(car['price'], user_car['price'])
                if price_ratio >= 0.5:  # Within 50% price range
                    similarity_score += 10
                
                # Lower threshold for second pass
                if similarity_score >= 40:
                    car['similarity_score'] = similarity_score
                    similar_cars.append(car)
        
        # If still not enough, use very lenient matching
        if len(similar_cars) < 5:
            similar_cars = []
            for car in market_data:
                similarity_score = 0
                
                # Any luxury vs non-luxury brand match
                luxury_brands = ["BMW", "Mercedes-Benz", "Audi", "Lexus", "Porsche", "Tesla", "Jaguar", "Land Rover"]
                user_is_luxury = user_car['make'] in luxury_brands
                car_is_luxury = car['make'] in luxury_brands
                
                if user_is_luxury == car_is_luxury:
                    similarity_score += 30
                
                # Year similarity (very lenient)
                year_diff = abs(car['year'] - user_car['year'])
                if year_diff <= 10:
                    similarity_score += 20 - year_diff
                
                # Price range similarity
                price_ratio = min(car['price'], user_car['price']) / max(car['price'], user_car['price'])
                similarity_score += price_ratio * 20
                
                # Very low threshold for third pass
                if similarity_score >= 20:
                    car['similarity_score'] = similarity_score
                    similar_cars.append(car)
        
        # Sort by similarity score
        similar_cars.sort(key=lambda x: x['similarity_score'], reverse=True)
        
        # Return top 50 similar cars, or all if less than 50
        return similar_cars[:50]
    
    def analyze_price(self, user_car):
        """Analyze the price of a user's car against market data"""
        try:
            # Get market data
            market_data = self.get_market_data()
            
            # Ensure we have market data
            if not market_data:
                logger.warning("No market data available, generating fresh mock data")
                market_data = self.scraper.generate_mock_data()
                self.market_data = market_data
                self.last_update = datetime.now()
            
            # Find similar cars
            similar_cars = self.find_similar_cars(user_car, market_data)
            
            # If still no similar cars, use fallback analysis
            if not similar_cars:
                logger.warning("No similar cars found, using fallback analysis")
                return self.fallback_analysis(user_car, market_data)
            
            # Calculate market statistics
            prices = [car['price'] for car in similar_cars if car['price'] is not None and not np.isnan(car['price']) and car['price'] > 0]
            
            if not prices:
                logger.warning("No valid price data found, using fallback analysis")
                return self.fallback_analysis(user_car, market_data)
            
            market_stats = {
                'average': float(np.mean(prices)),
                'median': float(np.median(prices)),
                'min': float(np.min(prices)),
                'max': float(np.max(prices)),
                'count': len(prices)
            }
            
            # Verify market stats are valid
            if np.isnan(market_stats['average']) or np.isinf(market_stats['average']):
                logger.warning("Invalid market statistics, using fallback analysis")
                return self.fallback_analysis(user_car, market_data)
            
            # Calculate price difference
            price_diff = float(user_car['price'] - market_stats['average'])
            percent_diff = float((price_diff / market_stats['average']) * 100)
            
            # Determine price rating
            if percent_diff <= -15:
                rating = 'excellent'
            elif percent_diff <= -5:
                rating = 'good'
            elif percent_diff <= 10:
                rating = 'fair'
            elif percent_diff <= 25:
                rating = 'high'
            else:
                rating = 'very_high'
            
            # Market comparison
            lower_priced = sum(1 for p in prices if p < user_car['price'])
            higher_priced = sum(1 for p in prices if p > user_car['price'])
            similar_priced = len(prices) - lower_priced - higher_priced
            
            # Generate recommendations
            recommendations = self.generate_recommendations(user_car, market_stats, rating)
            
            return {
                'user_car': user_car,
                'marketPrice': market_stats,
                'priceRating': rating,
                'priceDifference': price_diff,
                'percentageDifference': percent_diff,
                'marketComparison': {
                    'lowerPriced': lower_priced,
                    'higherPriced': higher_priced,
                    'similarPriced': similar_priced
                },
                'similar_cars_count': len(similar_cars),
                'recommendations': recommendations
            }
            
        except Exception as e:
            logger.error(f"Error analyzing price: {e}")
            # Return fallback analysis instead of raising error
            try:
                return self.fallback_analysis(user_car, self.market_data or [])
            except:
                raise Exception(f"Critical error in price analysis: {e}")
    
    def fallback_analysis(self, user_car, market_data):
        """Provide fallback analysis when normal analysis fails"""
        logger.info("Using fallback analysis method")
        
        # Generate estimated market price based on car age and make
        age = 2025 - user_car['year']
        
        # Base price estimates by make category
        luxury_brands = ["BMW", "Mercedes-Benz", "Audi", "Lexus", "Porsche", "Tesla", "Jaguar", "Land Rover"]
        premium_brands = ["Infiniti", "Acura", "Volvo", "Genesis"]
        
        if user_car['make'] in luxury_brands:
            base_price = 400000
        elif user_car['make'] in premium_brands:
            base_price = 250000
        else:
            base_price = 150000
        
        # Apply depreciation (10% per year, max 80%)
        depreciation = min(0.10 * age, 0.80)
        estimated_price = base_price * (1 - depreciation)
        
        # Adjust for mileage (high mileage = lower price)
        if user_car['mileage'] > 100000:
            estimated_price *= 0.85
        elif user_car['mileage'] > 200000:
            estimated_price *= 0.70
        
        # Create market stats
        market_stats = {
            'average': float(estimated_price),
            'median': float(estimated_price * 0.95),
            'min': float(estimated_price * 0.7),
            'max': float(estimated_price * 1.4),
            'count': 10  # Simulated count
        }
        
        # Calculate price difference
        price_diff = float(user_car['price'] - market_stats['average'])
        percent_diff = float((price_diff / market_stats['average']) * 100)
        
        # Determine price rating
        if percent_diff <= -15:
            rating = 'excellent'
        elif percent_diff <= -5:
            rating = 'good'
        elif percent_diff <= 10:
            rating = 'fair'
        elif percent_diff <= 25:
            rating = 'high'
        else:
            rating = 'very_high'
        
        # Market comparison (estimated)
        lower_priced = 3 if rating in ['excellent', 'good'] else 6
        higher_priced = 6 if rating in ['high', 'very_high'] else 3
        similar_priced = 10 - lower_priced - higher_priced
        
        # Generate recommendations
        recommendations = self.generate_recommendations(user_car, market_stats, rating)
        recommendations.append("Note: This analysis is based on estimated market data due to limited comparable vehicles.")
        
        return {
            'user_car': user_car,
            'marketPrice': market_stats,
            'priceRating': rating,
            'priceDifference': price_diff,
            'percentageDifference': percent_diff,
            'marketComparison': {
                'lowerPriced': lower_priced,
                'higherPriced': higher_priced,
                'similarPriced': similar_priced
            },
            'similar_cars_count': 10,
            'recommendations': recommendations,
            'fallback_analysis': True
        }
    
    def generate_recommendations(self, user_car, market_stats, rating):
        """Generate recommendations based on analysis"""
        recommendations = []
        
        if rating == 'excellent':
            recommendations.append("This is an excellent price! Consider buying soon as it's well below market value.")
        elif rating == 'good':
            recommendations.append("This is a good deal. The price is reasonable compared to similar cars.")
        elif rating == 'fair':
            recommendations.append("The price is fair but you might be able to negotiate a bit lower.")
        elif rating == 'high':
            recommendations.append("The price is above market average. Consider negotiating or looking for alternatives.")
        else:
            recommendations.append("The price is significantly above market value. Strong negotiation or alternative options recommended.")
        
        # Add specific recommendations based on car characteristics
        if user_car['mileage'] > 150000:
            recommendations.append("High mileage significantly affects the price. Consider this when negotiating.")
        
        if user_car['owners'] > 2:
            recommendations.append("Multiple previous owners may affect resale value and reliability.")
        
        age = 2025 - user_car['year']
        if age > 10:
            recommendations.append("The car's age is a significant factor in its current market value.")
        
        if user_car['price'] > market_stats['average'] * 1.2:
            recommendations.append("Consider expanding your search to include more options within your budget.")
        
        return recommendations

# Initialize analyzer
analyzer = CarAnalyzer()

@app.route('/api/analyze-car', methods=['POST'])
def analyze_car():
    """Analyze a car's price against market data"""
    try:
        raw_data = request.json
        
        # Validate input
        required_fields = ['make', 'model', 'year', 'price']
        for field in required_fields:
            if field not in raw_data or not raw_data[field]:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Convert camelCase to snake_case for backend compatibility
        user_car = {
            'make': raw_data.get('make'),
            'model': raw_data.get('model'),
            'year': raw_data.get('year'),
            'price': raw_data.get('price'),
            'mileage': raw_data.get('mileage', 50000),
            'color': raw_data.get('color', 'black'),
            'owners': raw_data.get('owners', 1),
            'fuel_type': raw_data.get('fuelType', 'petrol'),
            'transmission': raw_data.get('transmission', 'automatic'),
            'seats': raw_data.get('seats', 5),
            'engine_cc': raw_data.get('engineCC', 2000)
        }
        
        # Analyze the car
        analysis = analyzer.analyze_price(user_car)
        
        return jsonify(analysis)
        
    except Exception as e:
        logger.error(f"Error in analyze_car: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'market_data_count': len(analyzer.market_data) if analyzer.market_data else 0
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
