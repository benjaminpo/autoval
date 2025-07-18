# 🚀 Render Backend Deployment Guide

Deploy your AutoVal Python Flask backend to Render for **FREE**!

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be in GitHub
2. **Render Account**: Sign up at [render.com](https://render.com) (free)

## 🚀 Step-by-Step Deployment

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended)
3. Authorize GitHub access

### Step 2: Create Web Service
1. **Dashboard** → **New** → **Web Service**
2. **Connect Repository**: Select `autoval` repo
3. **Settings**:
   - **Name**: `autoval-backend`
   - **Region**: `Singapore` (closest to Hong Kong)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`

### Step 3: Configure Environment Variables
In Render dashboard → Environment:
```bash
FLASK_ENV=production
PORT=5001
```

### Step 4: Deploy
1. Click **Create Web Service**
2. Render will automatically deploy from GitHub
3. Your backend URL will be: `https://autoval-backend.onrender.com`

## ⚙️ Automatic Deployment Setup

### GitHub Secrets (for CI/CD)
Add these to GitHub repo → Settings → Secrets:

1. **RENDER_API_KEY**:
   - Go to Render Account Settings → API Keys
   - Create new key, copy value

2. **RENDER_SERVICE_ID**:
   - Go to your service dashboard
   - Copy the service ID from URL

## 🔧 Backend Configuration

Update your Flask app for production:

```python
# In backend/app.py
import os

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(
        debug=False,
        host='0.0.0.0',
        port=port
    )
```

## 🌐 Frontend Integration

Your `vercel.json` is already configured to route API calls to:
```
https://autoval-backend.onrender.com/api/*
```

## 📊 Monitoring & Logs

### View Logs:
1. Render Dashboard → Your Service
2. **Logs** tab for real-time logs
3. **Metrics** tab for performance

### Health Checks:
- Endpoint: `https://autoval-backend.onrender.com/api/health`
- Render automatically monitors this

## ⚠️ Free Tier Limitations

**Render Free Tier**:
- ✅ 750 hours/month (enough for most projects)
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ Cold start time: ~30-60 seconds
- ✅ Custom domains supported
- ✅ Automatic HTTPS

**Perfect for**:
- Development/staging
- Portfolio projects
- Low-traffic applications
- Demos

## 🚀 Production Optimization

### Reduce Cold Starts:
1. **Uptime Robot**: Free service to ping your app every 5 minutes
2. **Cron Job**: Set up a simple cron to keep it warm

### Performance Tips:
```python
# Add to backend/app.py
from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

# Enable gzip compression
from flask_compress import Compress
Compress(app)
```

## 🔄 Deployment Workflow

**Automatic Deployment**:
1. Push code to `main` branch
2. GitHub Actions runs tests
3. If tests pass, deploys to Render
4. Render builds and deploys automatically

**Manual Deployment**:
1. Render Dashboard → Your Service
2. **Manual Deploy** button

## 🆔 Your Backend URLs

After deployment, your backend will be available at:
- **Production**: `https://autoval-backend.onrender.com`
- **Health Check**: `https://autoval-backend.onrender.com/api/health`
- **API Endpoint**: `https://autoval-backend.onrender.com/api/analyze-car`

## 🔧 Troubleshooting

### Common Issues:

1. **Build Fails**:
   ```bash
   # Check requirements.txt format
   # Ensure Python version compatibility
   ```

2. **App Doesn't Start**:
   ```python
   # Verify app.py has correct port binding
   port = int(os.environ.get('PORT', 5001))
   app.run(host='0.0.0.0', port=port)
   ```

3. **Cold Start Issues**:
   - First request after sleep takes 30-60 seconds
   - Subsequent requests are fast
   - Consider uptime monitoring for production

### Debug Commands:
```bash
# Test locally first
cd backend
python app.py

# Check requirements
pip freeze > requirements.txt
```

## 💰 Cost Comparison

| Platform | Free Tier | Cold Starts | Always On |
|----------|-----------|-------------|-----------|
| **Render** | ✅ 750hrs | ⚠️ Yes | ❌ |
| Railway | ❌ $5/month | ✅ No | ✅ |
| Fly.io | ✅ Limited | ✅ No | ✅ |
| Heroku | ❌ Discontinued | ⚠️ Yes | ❌ |

## 🎯 Next Steps

1. **Deploy to Render** using steps above
2. **Test your API** at the Render URL
3. **Update frontend** to use new backend URL
4. **Set up monitoring** for production use
5. **Consider upgrading** to paid plan if needed

## 📞 Support

- 📚 [Render Documentation](https://render.com/docs)
- 💬 [Render Community](https://community.render.com)
- 🐛 Check repository Issues for common problems

---

**Your backend will be live at**: `https://autoval-backend.onrender.com` 🚀
