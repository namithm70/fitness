# MongoDB Setup Guide for Fitness App

This guide will help you set up MongoDB for persistent storage of user profiles, nutrition data, and food information.

## 🎯 What You'll Get

- **Persistent User Profiles**: User data persists across sessions and server restarts
- **Nutrition Tracking**: Store nutrition goals, meal logs, and food data
- **Food Database**: Comprehensive food database with nutritional information
- **Real-time Data**: All data stored in MongoDB instead of in-memory

## 📋 Prerequisites

- A Render account (for backend deployment)
- A Vercel account (for frontend deployment)
- Basic understanding of environment variables

## 🗄️ Step 1: Create MongoDB Database

### Option A: MongoDB Atlas (Recommended - Free Tier)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Click "Try Free" and create an account

2. **Create a Cluster**
   - Choose "FREE" tier (M0)
   - Select your preferred cloud provider (AWS, Google Cloud, or Azure)
   - Choose a region close to your users
   - Click "Create"

3. **Set Up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and strong password
   - Select "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for Render deployment)
   - Click "Confirm"

5. **Get Your Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

### Option B: Local MongoDB (Development Only)

1. Install MongoDB locally
2. Start MongoDB service
3. Create database: `use fitness-app`

## 🔧 Step 2: Configure Environment Variables

### In Render Dashboard

1. Go to your Render dashboard
2. Navigate to your backend service (`fitness-fkct`)
3. Go to "Environment" tab
4. Add these environment variables:

```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/fitness-app?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-key-here
CLIENT_URL=https://fitness-ebon-nine.vercel.app
ALLOWED_ORIGINS=https://fitness-ebon-nine.vercel.app
NODE_ENV=production
```

### Generate JWT Secret

Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🚀 Step 3: Deploy and Test

### 1. Deploy Backend
- Render will automatically redeploy when you add environment variables
- Check the deployment logs for any errors

### 2. Seed the Database (Optional)
If you want to populate the database with sample food data:

```bash
# In your local development environment
cd server
npm run seed-database
```

Or manually run:
```bash
node scripts/seed-database.js
```

### 3. Test the Setup

1. **Test User Registration**
   - Go to your app: https://fitness-ebon-nine.vercel.app
   - Register a new account
   - Check if user data persists after logout/login

2. **Test Profile Updates**
   - Update your profile information
   - Logout and login again
   - Verify changes are still there

3. **Test Nutrition Features**
   - Go to Nutrition page
   - Set nutrition goals
   - Log meals
   - Verify data persists

## 🔍 Step 4: Verify Database Connection

### Check Backend Logs
In Render dashboard, check your backend logs for:
```
✅ Connected to MongoDB
📊 Database: MongoDB
```

### Test Health Endpoint
Visit: `https://fitness-fkct.onrender.com/api/health`

You should see:
```json
{
  "status": "OK",
  "database": {
    "status": "healthy",
    "type": "mongodb"
  }
}
```

## 🛠️ Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check MONGODB_URI format
   - Verify username/password
   - Ensure IP whitelist includes Render's IPs

2. **Authentication Error**
   - Verify database user has correct permissions
   - Check username/password in connection string

3. **Data Not Persisting**
   - Check if MONGODB_URI is set correctly
   - Verify backend logs show "Connected to MongoDB"
   - Ensure you're not still using in-memory storage

### Debug Commands

```bash
# Check if MongoDB is connected
curl https://fitness-fkct.onrender.com/api/health

# Test database seeding locally
cd server
MONGODB_URI=your_connection_string npm run seed-database
```

## 📊 What Data Will Be Stored

### User Data
- Profile information (name, email, fitness level, goals)
- Authentication tokens
- Social login connections

### Nutrition Data
- Daily nutrition goals
- Meal logs and food entries
- Progress tracking

### Food Database
- Nutritional information for common foods
- Serving sizes and macronutrients
- Vitamin and mineral content

## 🔒 Security Considerations

1. **Environment Variables**: Never commit MONGODB_URI to version control
2. **Database User**: Use a dedicated database user with minimal permissions
3. **Network Access**: Restrict IP access when possible
4. **JWT Secret**: Use a strong, unique JWT secret

## 📈 Next Steps

After successful setup:

1. **Monitor Usage**: Check MongoDB Atlas dashboard for usage metrics
2. **Backup Strategy**: Set up automated backups in MongoDB Atlas
3. **Performance**: Monitor query performance and add indexes if needed
4. **Scaling**: Consider upgrading to paid tier as your app grows

## 🆘 Need Help?

If you encounter issues:

1. Check the backend logs in Render dashboard
2. Verify all environment variables are set correctly
3. Test the health endpoint
4. Ensure MongoDB Atlas cluster is running

---

**🎉 Congratulations!** Your fitness app now has persistent data storage with MongoDB.
