# Deployment Guide

## Frontend Deployment (Vercel)

The frontend is configured to deploy to Vercel. Follow these steps:

### 1. Deploy Backend First

You need to deploy your backend to a hosting service. Recommended options:

#### Option A: Render (Free)
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `cd server && npm install`
5. Set start command: `cd server && npm start`
6. Add environment variables:
   - `NODE_ENV=production`
   - `JWT_SECRET=your-secret-key`
   - `MONGODB_URI=your-mongodb-connection-string`

#### Option B: Railway (Free)
1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Deploy from GitHub
4. Set the root directory to `server`
5. Add environment variables as above

#### Option C: Heroku (Paid)
1. Create a Heroku account
2. Install Heroku CLI
3. Run: `heroku create your-app-name`
4. Set buildpacks and environment variables

### 2. Update API Configuration

Once your backend is deployed, update the API URL:

1. Edit `client/src/config/api.ts`
2. Replace `https://your-backend-url.com` with your actual backend URL
3. Example: `https://your-app-name.onrender.com`

### 3. Deploy Frontend to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will automatically detect the React app
5. Deploy

### 4. Environment Variables (Optional)

You can also set environment variables in Vercel:

1. Go to your Vercel project settings
2. Add environment variable: `REACT_APP_API_URL`
3. Set value to your backend URL

## Troubleshooting

### Registration Failed Error
- Make sure your backend is deployed and accessible
- Check that the API URL is correct in `client/src/config/api.ts`
- Verify CORS is properly configured on your backend

### Manifest Error
- This is usually a build issue
- Check that all dependencies are properly installed
- Ensure the build command is correct

### API 405 Error
- This means the API endpoint doesn't exist on the deployed backend
- Check that your backend routes are properly configured
- Verify the backend is running and accessible

## Local Development

For local development, the app uses:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000` (via proxy)

## Production URLs

After deployment:
- Frontend: `https://your-app-name.vercel.app`
- Backend: `https://your-backend-url.com`
