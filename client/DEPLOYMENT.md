# Deployment Guide

## MongoDB Atlas Setup (Required for Production)

Your application is currently running in in-memory mode because MongoDB connection is failing. To fix this and persist user data, you need to set up MongoDB Atlas:

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (M0 Free tier is sufficient for development)

### 2. Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a username and password (save these!)
4. Set privileges to "Read and write to any database"

### 3. Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For Render deployment, add `0.0.0.0/0` (allows all IPs)
4. Or add your specific Render IP if you have it

### 4. Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `fitness-app` (or your preferred database name)

### 5. Configure Render Environment Variables

In your Render dashboard, go to your service and add these environment variables:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/fitness-app?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-key-here
CLIENT_URL=https://your-frontend-domain.vercel.app
```

**Important Notes:**
- Replace `yourusername`, `yourpassword`, and the cluster URL with your actual MongoDB Atlas credentials
- Generate a strong JWT_SECRET (you can use a password generator or run `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- Update CLIENT_URL to match your frontend domain

### 6. Redeploy
After setting the environment variables, redeploy your application on Render.

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | Yes | `development` |
| `MONGODB_URI` | MongoDB connection string | Yes (for production) | `mongodb://localhost:27017/fitness-app` |
| `JWT_SECRET` | Secret key for JWT tokens | Yes (for production) | Default (not secure) |
| `CLIENT_URL` | Frontend application URL | No | `http://localhost:3000` |
| `PORT` | Server port | No | `5000` |

## Troubleshooting

### MongoDB Connection Issues
- Ensure your MongoDB Atlas cluster is running
- Check that your IP is whitelisted in Network Access
- Verify your connection string is correct
- Make sure your database user has the right permissions

### Rate Limiting Issues
- The application now properly handles proxy headers for Render
- If you still see rate limiting errors, check your Render service logs

### JWT Issues
- Ensure JWT_SECRET is set in production
- The secret should be at least 32 characters long
- Never commit the actual secret to version control

## Local Development

For local development, you can:
1. Use MongoDB Atlas (recommended)
2. Install MongoDB locally
3. Use the in-memory fallback (data will be lost on restart)

## Security Best Practices

1. **Never commit secrets to version control**
2. **Use strong, unique passwords for database users**
3. **Regularly rotate JWT secrets**
4. **Monitor your application logs for suspicious activity**
5. **Keep your dependencies updated**
