#!/bin/bash

# AutoVal Demo Script
# This script demonstrates the key features of the AutoVal application

echo "🚗 AutoVal - Car Price Analyzer Demo"
echo "===================================="
echo

echo "📊 Testing Backend API..."
echo

# Test health endpoint
echo "1. Health Check:"
curl -s http://localhost:5001/api/health | python3 -m json.tool
echo

# Test car analysis with sample data
echo "2. Analyzing a 2020 Toyota Camry priced at HK$200,000:"
curl -s -X POST "http://localhost:5001/api/analyze-car" \
  -H "Content-Type: application/json" \
  -d '{
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "price": 200000,
    "mileage": 50000,
    "color": "white",
    "owners": 1,
    "fuel_type": "petrol",
    "transmission": "automatic",
    "seats": 5,
    "engine_cc": 2000
  }' | python3 -c "
import json
import sys
data = json.load(sys.stdin)
print(f'Price Rating: {data[\"price_rating\"]}')
print(f'Market Average: HK${data[\"market_price\"][\"average\"]:,.0f}')
print(f'Price Difference: HK${data[\"price_difference\"]:,.0f} ({data[\"percentage_difference\"]:.1f}%)')
print(f'Similar Cars Found: {data[\"market_price\"][\"count\"]}')
print(f'Cars Priced Lower: {data[\"market_comparison\"][\"lower_priced\"]}')
print(f'Cars Priced Higher: {data[\"market_comparison\"][\"higher_priced\"]}')
print('\\nTop Recommendations:')
for i, rec in enumerate(data['recommendations'][:3], 1):
    print(f'{i}. {rec}')
"
echo

echo "3. Analyzing a 2018 Honda Civic priced at HK$120,000:"
curl -s -X POST "http://localhost:5001/api/analyze-car" \
  -H "Content-Type: application/json" \
  -d '{
    "make": "Honda",
    "model": "Civic",
    "year": 2018,
    "price": 120000,
    "mileage": 80000,
    "color": "black",
    "owners": 2,
    "fuel_type": "petrol",
    "transmission": "automatic",
    "seats": 5,
    "engine_cc": 1800
  }' | python3 -c "
import json
import sys
data = json.load(sys.stdin)
print(f'Price Rating: {data[\"price_rating\"]}')
print(f'Market Average: HK${data[\"market_price\"][\"average\"]:,.0f}')
print(f'Price Difference: HK${data[\"price_difference\"]:,.0f} ({data[\"percentage_difference\"]:.1f}%)')
print(f'Similar Cars Found: {data[\"market_price\"][\"count\"]}')
print(f'Cars Priced Lower: {data[\"market_comparison\"][\"lower_priced\"]}')
print(f'Cars Priced Higher: {data[\"market_comparison\"][\"higher_priced\"]}')
print('\\nTop Recommendations:')
for i, rec in enumerate(data['recommendations'][:3], 1):
    print(f'{i}. {rec}')
"
echo

echo "✅ Demo completed!"
echo
echo "🌐 Access the full application at: http://localhost:3001"
echo "🔧 API documentation at: http://localhost:5001/api/health"
echo
echo "Features demonstrated:"
echo "• Car price analysis and rating"
echo "• Market comparison with similar vehicles"
echo "• Intelligent recommendations"
echo "• Data-driven insights"
echo "• RESTful API endpoints"
echo
