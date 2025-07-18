#!/bin/bash

# AutoVal Backend Deployment Setup for Railway
# This script prepares your backend for Railway deployment

set -e

echo "🚂 AutoVal Railway Backend Setup"
echo "================================"
echo ""

# Create Railway-specific files
echo "📝 Creating Railway configuration files..."

# Create railway.json
cat > backend/railway.json << 'EOF'
{
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "cronSchedule": null,
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "sleepApplication": false
  }
}
EOF

echo "✅ Created railway.json"

# Create Procfile for Railway
cat > backend/Procfile << 'EOF'
web: python app.py
EOF

echo "✅ Created Procfile"

# Create railway start script
cat > backend/railway.sh << 'EOF'
#!/bin/bash
# Railway startup script
pip install -r requirements.txt
python app.py
EOF

chmod +x backend/railway.sh
echo "✅ Created railway.sh"

# Update requirements.txt with production packages
echo ""
echo "📦 Updating requirements.txt for production..."

cat > backend/requirements.txt << 'EOF'
Flask==2.3.3
Flask-CORS==4.0.0
requests==2.31.0
beautifulsoup4==4.12.2
pandas==2.1.1
numpy==1.24.3
lxml==4.9.3
python-dateutil==2.8.2
pytz==2023.3
gunicorn==21.2.0
pytest==7.4.2
pytest-cov==4.1.0
pytest-flask==1.3.0
python-dotenv==1.0.0
EOF

echo "✅ Updated requirements.txt"

# Create .env.example for Railway
cat > backend/.env.example << 'EOF'
# Railway Environment Variables
FLASK_ENV=production
FLASK_DEBUG=False
PORT=5001
PYTHONPATH=/app
EOF

echo "✅ Created .env.example"

echo ""
echo "🚀 Next Steps:"
echo "1. Go to https://railway.app"
echo "2. Sign up with GitHub"
echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
echo "4. Select your autoval repository"
echo "5. Choose 'backend' as the root directory"
echo "6. Add environment variables:"
echo "   - FLASK_ENV=production"
echo "   - PORT=5001"
echo "7. Deploy!"
echo ""
echo "📋 Your backend URL will be: https://[random-name].up.railway.app"
echo "📝 Copy this URL to update your vercel.json"
echo ""
echo "✅ Railway setup files created successfully!"
EOF
