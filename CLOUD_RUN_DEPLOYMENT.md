# Cloud Run Deployment Guide

This guide explains how to deploy the Oracle AI Migration app to Google Cloud Run.

## Prerequisites

1. **Google Cloud Project** with billing enabled
2. **Google Cloud CLI** installed and configured
3. **Docker** installed locally (for testing)
4. **Oracle Database** accessible from Google Cloud

## Required APIs

Enable these APIs in your Google Cloud project:
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## Environment Variables

Set these environment variables in Cloud Run:

### Required Variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `ORACLE_USER` - Oracle database username
- `ORACLE_PASSWORD` - Oracle database password
- `ORACLE_CONNECTION_STRING` - Oracle connection string

### Optional Variables:
- `VITE_GEMINI_API_KEY` - Google Gemini API key
- `VITE_API_KEY` - OpenAI API key
- `VITE_OPENROUTER_API_KEY` - OpenRouter API key

## Deployment Methods

### Method 1: Using Cloud Build (Recommended)

1. **Push your code to a Git repository** (GitHub, GitLab, etc.)

2. **Connect Cloud Build to your repository**:
   - Go to Cloud Build > Triggers
   - Create a new trigger
   - Connect your repository
   - Use the `cloudbuild.yaml` file

3. **Set up environment variables**:
   ```bash
   gcloud run services update oracle-ai-migrate \
     --set-env-vars VITE_SUPABASE_URL=your_url \
     --set-env-vars VITE_SUPABASE_ANON_KEY=your_key \
     --set-env-vars ORACLE_USER=your_user \
     --set-env-vars ORACLE_PASSWORD=your_password \
     --set-env-vars ORACLE_CONNECTION_STRING=your_connection_string
   ```

### Method 2: Manual Deployment

1. **Build and push the Docker image**:
   ```bash
   # Build the image
   docker build -t gcr.io/YOUR_PROJECT_ID/oracle-ai-migrate .
   
   # Push to Container Registry
   docker push gcr.io/YOUR_PROJECT_ID/oracle-ai-migrate
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy oracle-ai-migrate \
     --image gcr.io/YOUR_PROJECT_ID/oracle-ai-migrate \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --memory 2Gi \
     --cpu 2 \
     --timeout 300 \
     --concurrency 80 \
     --max-instances 10
   ```

3. **Set environment variables**:
   ```bash
   gcloud run services update oracle-ai-migrate \
     --set-env-vars VITE_SUPABASE_URL=your_url \
     --set-env-vars VITE_SUPABASE_ANON_KEY=your_key \
     --set-env-vars ORACLE_USER=your_user \
     --set-env-vars ORACLE_PASSWORD=your_password \
     --set-env-vars ORACLE_CONNECTION_STRING=your_connection_string
   ```

## Oracle Database Connectivity

### Important Notes:
1. **Oracle Instant Client**: The Dockerfile includes Oracle Instant Client dependencies
2. **Network Access**: Ensure your Oracle database is accessible from Google Cloud
3. **Connection Pooling**: The app uses connection pooling for better performance
4. **Security**: Use Cloud SQL Proxy or VPN for secure database connections

### Recommended Oracle Setup:
1. **Use Cloud SQL for Oracle** (if available in your region)
2. **Or use Oracle Cloud Infrastructure** with proper networking
3. **Or use a VPN connection** to your on-premises Oracle database

## Monitoring and Logging

1. **View logs**:
   ```bash
   gcloud logs tail --service=oracle-ai-migrate
   ```

2. **Monitor performance** in Google Cloud Console:
   - Cloud Run > oracle-ai-migrate > Metrics
   - Cloud Run > oracle-ai-migrate > Logs

## Scaling Configuration

The deployment is configured with:
- **Memory**: 2GB (sufficient for Oracle operations)
- **CPU**: 2 vCPUs
- **Max Instances**: 10 (adjust based on your needs)
- **Concurrency**: 80 requests per instance
- **Timeout**: 300 seconds (for long-running Oracle operations)

## Troubleshooting

### Common Issues:

1. **Oracle Connection Errors**:
   - Check network connectivity
   - Verify connection string format
   - Ensure Oracle Instant Client is properly installed

2. **Memory Issues**:
   - Increase memory allocation if needed
   - Monitor memory usage in Cloud Console

3. **Timeout Issues**:
   - Increase timeout for long-running operations
   - Optimize Oracle queries

4. **Build Failures**:
   - Check Docker build logs
   - Verify all dependencies are included

## Security Considerations

1. **Environment Variables**: Never commit secrets to version control
2. **Database Access**: Use least-privilege database accounts
3. **Network Security**: Use VPC connectors if needed
4. **API Keys**: Rotate API keys regularly

## Cost Optimization

1. **Min Instances**: Set to 0 for cost savings (cold starts)
2. **Max Instances**: Limit based on expected load
3. **Memory/CPU**: Right-size based on actual usage
4. **Region**: Choose closest to your users

## Support

For issues specific to:
- **Cloud Run**: Check Google Cloud documentation
- **Oracle**: Check Oracle documentation
- **App-specific**: Check the application logs 