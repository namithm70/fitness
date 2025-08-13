# FitLife - Health & Fitness Gym Website

A comprehensive health and fitness website that serves as a digital platform for gym members and fitness enthusiasts to track their progress, access workout plans, and engage with fitness content.

## 🚀 Features

### Core Features
- **User Registration & Profile Management** - Complete user profiles with fitness preferences
- **Workout Library & Plans** - Browse and track exercise routines
- **Progress Tracking** - Monitor fitness journey with analytics
- **Nutrition & Meal Planning** - Track nutrition and plan meals
- **Community Features** - Connect with other fitness enthusiasts
- **Educational Content** - Fitness and nutrition articles
- **Gym Integration** - Find and review local gyms

### Technical Features
- **Modern UI/UX** - Beautiful, responsive design with Tailwind CSS
- **Real-time Updates** - Socket.io for live features
- **Authentication** - JWT-based auth with social login support
- **API Integration** - Ready for third-party fitness APIs
- **Mobile Responsive** - Optimized for all devices
- **Progressive Web App** - Offline capabilities

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **React Query** for state management
- **React Hook Form** for forms
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Socket.io** for real-time features
- **bcryptjs** for password hashing
- **Express Validator** for validation

### Third-Party Integrations (Planned)
- **Auth0/Firebase** for authentication
- **Stripe** for payments
- **YouTube API** for exercise videos
- **Unsplash API** for images
- **Google Maps API** for gym locator
- **Edamam/Spoonacular** for nutrition data
- **SendGrid** for emails
- **Cloudinary** for file storage

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fitness
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd server && npm install
   
   # Install frontend dependencies
   cd ../client && npm install
   ```

3. **Environment Configuration**
   
   Create `.env` file in the server directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/fitness-app
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:3000
   
   # Optional: Third-party API keys
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   STRIPE_SECRET_KEY=your-stripe-secret
   SENDGRID_API_KEY=your-sendgrid-key
   ```

4. **Start the development servers**
   ```bash
   # From the root directory
   npm run dev
   
   # Or start them separately:
   # Backend: npm run server
   # Frontend: npm run client
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🏗️ Project Structure

```
fitness/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── utils/            # Utility functions
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user
- `POST /api/auth/social-login` - Social media login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/search` - Search users

### Workouts
- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/:id` - Get workout by ID
- `POST /api/workouts` - Create workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout
- `POST /api/workouts/:id/rate` - Rate workout
- `GET /api/workouts/recommended` - Get recommended workouts

### Other Features
- `GET /api/nutrition` - Nutrition data (coming soon)
- `GET /api/progress` - Progress tracking (coming soon)
- `GET /api/community` - Community features (coming soon)
- `GET /api/gyms` - Gym integration (coming soon)

## 🎨 UI Components

The application includes a comprehensive set of reusable components:

- **Layout Components** - Navigation, sidebar, footer
- **Form Components** - Inputs, buttons, validation
- **Card Components** - Workout cards, user cards
- **Chart Components** - Progress charts, analytics
- **Modal Components** - Dialogs, confirmations
- **Loading Components** - Spinners, skeletons

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt for password security
- **Input Validation** - Server-side validation
- **Rate Limiting** - API rate limiting
- **CORS Protection** - Cross-origin resource sharing
- **Helmet Security** - Security headers

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd client
npm run build
```

### Backend Deployment (Heroku/Railway)
```bash
cd server
npm start
```

### Environment Variables for Production
Set the following environment variables in your production environment:
- `NODE_ENV=production`
- `MONGODB_URI` (production MongoDB connection)
- `JWT_SECRET` (strong secret key)
- `CLIENT_URL` (production frontend URL)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@fitlife.com or create an issue in the repository.

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ User authentication and profiles
- ✅ Basic workout management
- ✅ Dashboard and navigation
- ✅ Responsive design

### Phase 2 (Next)
- 🔄 Complete workout library
- 🔄 Progress tracking
- 🔄 Nutrition tracking
- 🔄 Community features

### Phase 3 (Future)
- 📋 Gym integration
- 📋 Mobile app
- 📋 AI-powered recommendations
- 📋 Advanced analytics
- 📋 Social features
- 📋 Premium subscriptions

---

**Built with ❤️ for fitness enthusiasts everywhere**
