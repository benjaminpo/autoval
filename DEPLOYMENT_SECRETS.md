# 🔐 Deployment Secrets Configuration

This guide will help you set up all the required secrets for your CI/CD pipeline to deploy to both Vercel (frontend) and Render (backend).

## 📋 Required Secrets

You need to add these secrets to your GitHub repository:

### 🚀 Vercel Secrets (Frontend)
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID` 
- `VERCEL_PROJECT_ID`

### 🐍 Render Secrets (Backend)
- `RENDER_SERVICE_ID`
- `RENDER_API_KEY`

## 🛠️ Step-by-Step Setup

### Step 1: Setup Vercel Secrets

#### Get Vercel Token
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your avatar → **Settings** → **Tokens**
3. Click **Create Token**
4. Name: `GitHub Actions`
5. Scope: `Full Account`
6. Copy the token (starts with `vercel_`)

#### Get Vercel Project Information
1. In Vercel Dashboard, select your project
2. Go to **Settings** → **General**
3. Copy **Project ID** (under Project ID section)
4. Copy **Team ID** (this is your ORG_ID)

#### Alternative Method - CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login and link project
vercel login
vercel link

# Get project info
vercel ls
cat .vercel/project.json
```

### Step 2: Setup Render Secrets

#### Get Render API Key
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click your avatar → **Account Settings** → **API Keys**
3. Click **Create API Key**
4. Name: `GitHub Actions`
5. Copy the API key (starts with `rnd_`)

#### Get Render Service ID
1. Go to your Render service dashboard
2. URL will be: `https://dashboard.render.com/web/srv-XXXXXXXXXXXXX`
3. Copy the service ID: `srv-XXXXXXXXXXXXX`

### Step 3: Add Secrets to GitHub

1. Go to your GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret:

```
Name: VERCEL_TOKEN
Value: vercel_1234567890abcdef...

Name: VERCEL_ORG_ID  
Value: team_1234567890abcdef...

Name: VERCEL_PROJECT_ID
Value: prj_1234567890abcdef...

Name: RENDER_SERVICE_ID
Value: srv-1234567890abcdef

Name: RENDER_API_KEY
Value: rnd_1234567890abcdef...
```

## ✅ Verification

### Test Vercel Connection
```bash
# Test with your token
curl -H "Authorization: Bearer YOUR_VERCEL_TOKEN" \
  "https://api.vercel.com/v2/user"
```

### Test Render Connection
```bash
# Test with your API key
curl -H "Authorization: Bearer YOUR_RENDER_API_KEY" \
  "https://api.render.com/v1/services"
```

## 🔄 Deployment Flow

Once secrets are configured:

1. **Push to `main` branch** triggers:
   - ✅ Run all tests
   - 🐍 Deploy backend to Render
   - 📱 Deploy frontend to Vercel
   - ✅ Verify deployments

2. **Push to `develop` branch** triggers:
   - ✅ Run all tests  
   - 📱 Deploy preview to Vercel

3. **Pull Requests** trigger:
   - ✅ Run all tests
   - 📱 Create preview deployment
   - 💬 Comment with preview URL

## 🚨 Security Notes

- **Never commit secrets** to your repository
- **Use specific scopes** for tokens when possible
- **Rotate tokens** regularly (every 3-6 months)
- **Monitor usage** in your platform dashboards

## 🔧 Troubleshooting

### Common Issues

1. **"Invalid token" errors**:
   - Check token format (vercel_ or rnd_ prefix)
   - Verify token hasn't expired
   - Ensure correct scope/permissions

2. **"Project not found" errors**:
   - Verify VERCEL_PROJECT_ID is correct
   - Check VERCEL_ORG_ID matches your team

3. **"Service not found" errors**:
   - Verify RENDER_SERVICE_ID format (srv-...)
   - Check service exists and is active

### Debug Commands

```bash
# Check Vercel project linking
vercel whoami
vercel ls

# Verify Render service
curl -H "Authorization: Bearer $RENDER_API_KEY" \
  "https://api.render.com/v1/services/$RENDER_SERVICE_ID"
```

## 📞 Support

- 📚 [Vercel API Docs](https://vercel.com/docs/rest-api)
- 📚 [Render API Docs](https://api-docs.render.com)
- 🐛 Check repository Issues for deployment problems

---

**Once configured, your deployments will be fully automated!** 🚀
