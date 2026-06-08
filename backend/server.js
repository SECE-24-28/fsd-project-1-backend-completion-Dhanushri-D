require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://trip-nova-frontend.vercel.app'], credentials: true }));
app.use(express.json());

app.use('/api/auth', require('./routers/authRouter'));
app.use('/api/destinations', require('./routers/destinationRouter'));
app.use('/api/packages', require('./routers/packageRouter'));
app.use('/api/hotels', require('./routers/hotelRouter'));
app.use('/api/bookings', require('./routers/bookingRouter'));
app.use('/api/reviews', require('./routers/reviewRouter'));
app.use('/api/enquiries', require('./routers/enquiryRouter'));
app.use('/api/gallery', require('./routers/galleryRouter'));
app.use('/api/users', require('./routers/userRouter'));
app.use('/api/trip-plans', require('./routers/tripPlanRouter'));
app.use('/api/budget-plans', require('./routers/budgetPlanRouter'));
app.use('/api/wishlist', require('./routers/wishlistRouter'));

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
