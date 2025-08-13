# FitLife - Comprehensive Fitness Platform

A modern, full-stack fitness application built with React, Node.js, and MongoDB. This platform helps users track workouts, manage nutrition, monitor progress, and connect with a fitness community.

## 🚀 Recent Bug Fixes & Improvements

### Critical Fixes Applied:
- ✅ **API Configuration Consistency** - Fixed duplicate axios configuration
- ✅ **User Authentication** - Improved token handling and user ID management
- ✅ **Error Boundaries** - Added comprehensive error handling
- ✅ **Input Validation** - Enhanced security with input sanitization
- ✅ **Socket.io Security** - Improved connection handling and cleanup
- ✅ **Accessibility** - Added ARIA labels, keyboard navigation, and screen reader support
- ✅ **Performance** - Implemented code splitting and lazy loading
- ✅ **Type Safety** - Fixed TypeScript inconsistencies

### Security Enhancements:
- 🔒 JWT secret validation and strength requirements
- 🔒 Input sanitization and validation
- 🔒 Rate limiting and CORS protection
- 🔒 Secure password requirements
- 🔒 Token cleanup and expiration handling

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API communication
- **React Query** for state management
- **Socket.io Client** for real-time features

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Socket.io** for real-time communication
- **Bcrypt** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd fitness
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Environment Setup

#### Client Environment (.env in client directory)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

#### Server Environment (.env in server directory)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/fitness-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Security
BCRYPT_ROUNDS=12
```

### 4. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

#### Option B: MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your .env file

### 5. Start the Application

#### Development Mode
```bash
# Terminal 1 - Start the server
cd server
npm run dev

# Terminal 2 - Start the client
cd client
npm start
```

#### Production Mode
```bash
# Build the client
cd client
npm run build

# Start the server
cd ../server
npm start
```

## 🏗️ Project Structure

```
fitness/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── types/         # TypeScript definitions
│   │   ├── config/        # Configuration files
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
├── server/                # Node.js backend
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── middleware/        # Express middleware
│   ├── utils/             # Utility functions
│   └── config/            # Configuration files
└── docs/                  # Documentation
```

## 🔧 Key Features

### User Management
- User registration and authentication
- Profile management
- Social login integration
- Password reset functionality

### Workout Tracking
- Create and manage workouts
- Exercise library
- Progress tracking
- Workout history

### Nutrition Management
- Food logging
- Calorie tracking
- Macro monitoring
- Meal planning

### Progress Monitoring
- Weight tracking
- Body measurements
- Progress photos
- Goal setting

### Community Features
- Social feed
- User connections
- Challenges and events
- Real-time messaging

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Security headers with Helmet
- XSS protection
- CSRF protection

## ♿ Accessibility Features

- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Skip to content links
- High contrast support
- Semantic HTML structure

## 🧪 Testing

```bash
# Run client tests
cd client
npm test

# Run server tests
cd server
npm test
```

## 📦 Deployment

### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Render (Backend)
1. Connect your GitHub repository to Render
2. Set environment variables
3. Configure build and start commands

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-strong-jwt-secret
CLIENT_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string
   - Check network connectivity

2. **JWT Secret Error**
   - Ensure JWT_SECRET is set in production
   - Use a strong, unique secret

3. **CORS Errors**
   - Verify ALLOWED_ORIGINS configuration
   - Check client URL settings

4. **Port Conflicts**
   - Change PORT in .env file
   - Check if ports are available

### Development Tips

- Use the in-memory storage for development without MongoDB
- Enable debug logging in development
- Use React Developer Tools for frontend debugging
- Use Postman or similar for API testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting section

## 🔄 Changelog

### v1.1.0 (Latest)
- Fixed API configuration inconsistencies
- Added comprehensive error boundaries
- Improved input validation and security
- Enhanced accessibility features
- Implemented code splitting for better performance
- Added loading states and better UX
- Fixed TypeScript type issues
- Improved Socket.io error handling

### v1.0.0
- Initial release
- Basic fitness tracking features
- User authentication
- Workout and nutrition management
