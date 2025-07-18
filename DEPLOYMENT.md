# Vercel Deployment Setup Guide

This guide will help you set up automatic deployment to Vercel using GitHub Actions.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Vercel CLI**: Install globally with `npm install -g vercel`

## Step 1: Create Vercel Project

1. Login to Vercel CLI:
   ```bash
   vercel login
   ```

2. Link your local project to Vercel:
   ```bash
   vercel link
   ```

3. Get your project information:
   ```bash
   vercel env ls
   ```

## Step 2: Set up GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add these secrets:

### Required Secrets:

1. **VERCEL_TOKEN**
   - Go to [Vercel Account Settings](https://vercel.com/account/tokens)
   - Create a new token
   - Copy the token value

2. **VERCEL_ORG_ID**
   - Run `vercel org ls` in your terminal
   - Copy your organization ID

3. **VERCEL_PROJECT_ID**
   - Run `cat .vercel/project.json` in your project root
   - Copy the `projectId` value

### Optional Secrets (for enhanced features):

4. **SLACK_WEBHOOK** (for notifications)
   - Create a Slack webhook URL
   - Add it to receive deployment notifications

5. **SONAR_TOKEN** (for code quality analysis)
   - Go to [SonarCloud](https://sonarcloud.io)
   - Create a new project
   - Generate a token

6. **SNYK_TOKEN** (for security scanning)
   - Go to [Snyk](https://snyk.io)
   - Create account and get API token

## Step 3: Configure Vercel Project Settings

### Environment Variables in Vercel Dashboard:

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Domain Configuration:

1. In Vercel Dashboard, go to Settings → Domains
2. Add your custom domain (if you have one)
3. Configure DNS records as instructed

## Step 4: Update Backend URL Configuration

If you have a separate backend, update the `vercel.json` file:

```json
{
  "redirects": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-actual-backend-url.com/api/$1",
      "permanent": false
    }
  ]
}
```

## Step 5: Test the Deployment

1. **Create a Pull Request**:
   - Make a small change to your frontend code
   - Create a PR to the `main` branch
   - GitHub Actions will automatically create a preview deployment
   - Check the PR comments for the preview URL

2. **Deploy to Production**:
   - Merge the PR to the `main` branch
   - GitHub Actions will automatically deploy to production
   - Check the Actions tab for deployment status

## Step 6: Monitor Deployments

### GitHub Actions Dashboard:
- Go to your repository → Actions tab
- Monitor deployment status and logs

### Vercel Dashboard:
- Check deployment status at [vercel.com/dashboard](https://vercel.com/dashboard)
- View deployment logs and metrics

### Lighthouse Reports:
- Lighthouse audits run automatically on each deployment
- Check the Actions artifacts for performance reports

## Workflow Features

### Automatic Quality Checks:
- ✅ TypeScript type checking
- ✅ ESLint validation
- ✅ Frontend tests with coverage
- ✅ Build verification
- ✅ Lighthouse performance audit

### Preview Deployments:
- Every PR gets a unique preview URL
- Automatic updates on new commits
- Comment on PR with deployment status

### Production Deployments:
- Only deploys from `main` branch
- Creates GitHub releases automatically
- Health checks after deployment
- Slack notifications (if configured)

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   ```bash
   # Check build locally
   npm run build
   ```

2. **Missing Environment Variables**:
   - Verify all secrets are set in GitHub
   - Check Vercel project environment variables

3. **Deploy Timeout**:
   - Check if the build is taking too long
   - Consider optimizing bundle size

4. **Domain Issues**:
   - Verify DNS configuration
   - Check domain settings in Vercel

### Debug Commands:

```bash
# Test Vercel build locally
vercel build

# Check project configuration
cat .vercel/project.json

# View deployment logs
vercel logs [deployment-url]
```

## Performance Optimization

### Bundle Analysis:
```bash
# Add to package.json
"analyze": "cross-env ANALYZE=true npm run build"

# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer
```

### Image Optimization:
- Use Next.js `<Image>` component
- Configure image domains in `next.config.js`

### Caching Strategy:
- Configure headers in `vercel.json`
- Use Next.js built-in caching

## Security Considerations

1. **Environment Variables**:
   - Never commit secrets to git
   - Use different values for preview vs production

2. **Headers Configuration**:
   - Security headers are configured in `vercel.json`
   - Regular security audits via Snyk

3. **Dependencies**:
   - Regular `npm audit` checks
   - Dependabot for automated updates

## Monitoring and Analytics

### Vercel Analytics:
```bash
# Add Vercel Analytics
npm install @vercel/analytics
```

### Custom Monitoring:
- Set up error tracking (e.g., Sentry)
- Performance monitoring
- User analytics

## Support

- 📚 [Vercel Documentation](https://vercel.com/docs)
- 🤖 [GitHub Actions Documentation](https://docs.github.com/en/actions)
- 💬 Check the repository Issues for common problems

---

**Next Steps**: After setting up deployment, consider implementing:
- [ ] Custom domain configuration
- [ ] CDN optimization
- [ ] Error tracking
- [ ] Performance monitoring
- [ ] A/B testing setup
