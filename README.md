# 🚀 Expense Tracker - Next.js Full-Stack Application

A modern, full-stack expense tracking application built with **Next.js 14**, featuring real-time data synchronization, team collaboration, and a beautiful dark-themed UI.

## 📋 Features

✨ **Full-Stack Next.js Architecture**
- Server-side rendering with App Router
- API routes for backend logic
- MongoDB integration
- Firebase Authentication

💼 **Core Functionality**
- Track income and expenses by category
- Team-based expense management
- Real-time data visualization with Chart.js
- Financial overview with doughnut charts
- Transaction history and management

🎨 **Modern UI/UX**
- Dark theme with glass morphism effects
- Responsive design
- Smooth animations with Framer Motion
- Styled with styled-components

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Styled Components** - CSS-in-JS
- **Framer Motion** - Animations
- **Chart.js** - Data visualization
- **Firebase** - Authentication

### Backend
- **Next.js API Routes** - RESTful API
- **MongoDB** - Database
- **Mongoose** - ODM

## 📁 Project Structure

```
expense-tracker-next/
├── app/
│   ├── layout.js                    # Root layout
│   ├── page.js                      # Home page (redirect)
│   ├── registry.js                  # Styled-components registry
│   ├── globals.css                  # Global styles
│   │
│   ├── dashboard/page.js            # Dashboard page
│   ├── income/page.js               # Income tracking
│   ├── expense/page.js              # Expense tracking
│   ├── teams/page.js                # Team management
│   ├── login/page.js                # Authentication
│   │
│   └── api/                         # API Routes
│       ├── income/route.js          # Income endpoints
│       ├── expense/route.js         # Expense endpoints
│       ├── teams/route.js           # Team endpoints
│       └── auth/
│           ├── login/route.js       # Login endpoint
│           └── register/route.js    # Register endpoint
│
├── components/                      # React components
│   ├── AllTeamsDropdown.js
│   ├── BarChart.js
│   ├── DoughnutChart.js
│   ├── InfoCard.js
│   ├── Sidebar.js
│   ├── Transactions.js
│   ├── TransactionListCard.js
│   ├── SignUpModal.js
│   └── ... (14 more components)
│
├── lib/
│   ├── db.js                        # MongoDB connection
│   └── models/                      # Mongoose models
│       ├── Income.js
│       ├── Expense.js
│       ├── Team.js
│       └── User.js
│
├── styles/
│   └── darkTheme.js                 # Design tokens
│
├── firebase.js                      # Firebase config
├── .env.local                       # Environment variables
├── next.config.js                   # Next.js config
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or later
- **MongoDB** running locally or connection string
- **Firebase** project (for authentication)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**

   Create `.env.local` file in the root directory:
   ```env
   # MongoDB
   MONGO_URI=mongodb://127.0.0.1:27017/expenseTracker

   # JWT
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRE=7d

   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

3. **Start MongoDB:**
   ```bash
   # Make sure MongoDB is running
   mongod
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔌 API Routes

### Income
- `GET /api/income` - Fetch all income records
- `POST /api/income` - Add new income

### Expense
- `GET /api/expense` - Fetch all expenses
- `POST /api/expense` - Add new expense

### Teams
- `GET /api/teams` - Fetch all teams
- `POST /api/teams` - Create new team

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## 🎨 Design System

The application uses a centralized dark theme with the following color palette:

```javascript
{
  background: {
    primary: '#071422',
    panel: '#0f2430',
    glass: 'rgba(255, 255, 255, 0.04)'
  },
  accent: {
    cyan: '#1bd3ff',
    teal: '#2dd4bf',
    purple: '#7c5cff'
  },
  text: {
    primary: '#e6f0f6',
    secondary: '#9aa8b4'
  }
}
```

## 🔐 Authentication

The application uses **Firebase Authentication** with support for:
- Email/Password authentication
- Google Sign-In
- Account linking

## 💾 Database Schema

### Income Model
```javascript
{
  title: String,
  amount: Number,
  category: String,
  description: String,
  date: Date,
  teamName: String,
  receiptImage: String
}
```

### Expense Model
```javascript
{
  title: String,
  amount: Number,
  category: String,
  description: String,
  date: Date,
  teamName: String,
  receiptImage: String
}
```

### Team Model
```javascript
{
  name: String,
  description: String,
  members: [ObjectId]
}
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:
- `MONGO_URI`
- `JWT_SECRET`
- All Firebase `NEXT_PUBLIC_*` variables

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env.local`
- Verify network connectivity

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules
rm -f package-lock.json
npm cache clean --force
npm install
```

### Firebase Auth Issues
- Verify all Firebase environment variables
- Check Firebase console for enabled auth methods
- Ensure domain is authorized in Firebase

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ using Next.js 14
