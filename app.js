const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
// CORS Configuration (Optional)
const corsOptions = {
  origin: "*", // This allows requests from any origin, you can restrict this as needed.
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Prisma Client
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
app.locals.prisma = prisma; // attach Prisma to app

// Routes
const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/triRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const balanceRoutes = require('./routes/balanceRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/balances', balanceRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Trip Splitter API is running ✅');
});


app.get('/api-list', (req, res) => {
  res.json({
    message: "Welcome to the Trippzo API",
    base_url: "https://trippzo.onrender.com",
    available_routes: {
      auth: {
        register: "/api/auth/register",
        login: "/api/auth/login",
        verifyEmail: "/api/auth/verify",
        resendVerification: "/api/auth/resend",
        logout: "/api/auth/logout",
        getUser: "/api/auth/user"
      },
      trip: {
        createTrip: "/api/trips/create",
        getUserTrips: "/api/trips/user",
        getTripById: "/api/trips/:tripId",
        inviteMembers: "/api/trips/:tripId/invite",
        joinTrip: "/api/trips/join/:tripId",
        deleteTrip: "/api/trips/:tripId/delete"
      },
      expenses: {
        addExpense: "/api/expenses/add",
        getTripExpenses: "/api/expenses/:tripId",
        splitExpense: "/api/expenses/split/:expenseId"
      },
      balances: {
        getTripBalances: "/api/balances/:tripId",
        settleUp: "/api/balances/settle"
      }
    }
  });
});


// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
