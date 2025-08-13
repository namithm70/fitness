# Quick Setup Guide - Fix MongoDB Connection

## 🚨 Current Issue
Your server is running in in-memory mode, which means:
- User login data is NOT being saved
- All data is lost when the server restarts
- You cannot persist user accounts or workout data

## 🔧 Quick Fix Steps

### Step 1: Set up MongoDB Atlas (5 minutes)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (choose M0 Free)
4. Wait for cluster to be ready (2-3 minutes)

### Step 2: Configure Database Access
1. In Atlas dashboard, go to "Database Access"
2. Click "Add New Database User"
3. Username: `fitness-app-user`
4. Password: Create a strong password (save it!)
5. Privileges: "Read and write to any database"
6. Click "Add User"

### Step 3: Configure Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 4: Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your password
5. Replace `<dbname>` with `fitness-app`

### Step 5: Generate JWT Secret
Run this command in your server directory:
```bash
npm run generate-secret
```
Copy the generated secret.

### Step 6: Update Render Environment Variables
In your Render dashboard:
1. Go to your service
2. Click "Environment"
3. Add these variables:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://fitness-app-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/fitness-app?retryWrites=true&w=majority
JWT_SECRET=YOUR_GENERATED_SECRET
CLIENT_URL=https://your-frontend-domain.vercel.app
```

### Step 7: Redeploy
1. Go to your Render service
2. Click "Manual Deploy" → "Deploy latest commit"

## ✅ Verification
After deployment, check your logs. You should see:
```
✅ Successfully connected to MongoDB
📊 Database: MongoDB
```

Instead of:
```
⚠️ Falling back to in-memory storage
📊 Database: In-Memory
```

## 🆘 Need Help?
- Check the full [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions
- Verify your MongoDB Atlas cluster is running
- Make sure your connection string is correct
- Check that your IP is whitelisted in Network Access

## 🔒 Security Notes
- Never commit secrets to Git
- Use strong passwords for database users
- Regularly rotate your JWT secret
- Monitor your application logs
