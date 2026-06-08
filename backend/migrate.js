/**
 * MIGRATION: Import localStorage data into MongoDB
 *
 * HOW TO USE:
 * 1. Open your browser with the old frontend running
 * 2. Open DevTools Console and run:
 *
 *    copy(JSON.stringify({
 *      users:    JSON.parse(localStorage.getItem('users') || '[]'),
 *      bookings: JSON.parse(localStorage.getItem('bookings') || '[]'),
 *      enquiries:JSON.parse(localStorage.getItem('enquiries') || '[]'),
 *      reviews:  JSON.parse(localStorage.getItem('reviews') || '[]'),
 *      gallery:  JSON.parse(localStorage.getItem('gallery') || '[]'),
 *    }))
 *
 * 3. Save the copied text into a file: migrate-data.json (in this same folder)
 * 4. Run: node migrate.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const User     = require('./models/User');
const Booking  = require('./models/Booking');
const Enquiry  = require('./models/Enquiry');
const Review   = require('./models/Review');
const Gallery  = require('./models/Gallery');

const dataPath = path.join(__dirname, 'migrate-data.json');

async function migrate() {
  if (!fs.existsSync(dataPath)) {
    console.log('❌ migrate-data.json not found.');
    console.log('📋 Export your localStorage data by running this in your browser console:');
    console.log(`
copy(JSON.stringify({
  users:     JSON.parse(localStorage.getItem('users')     || '[]'),
  bookings:  JSON.parse(localStorage.getItem('bookings')  || '[]'),
  enquiries: JSON.parse(localStorage.getItem('enquiries') || '[]'),
  reviews:   JSON.parse(localStorage.getItem('reviews')   || '[]'),
  gallery:   JSON.parse(localStorage.getItem('gallery')   || '[]'),
}))
    `);
    console.log('Then paste into a file named migrate-data.json in the backend folder.');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // --- USERS ---
  let importedUsers = 0;
  const userIdMap = {}; // old localId -> new ObjectId
  for (const u of (data.users || [])) {
    if (u.email === 'admin@tripnova.com') {
      const existing = await User.findOne({ email: u.email });
      if (existing) userIdMap[u.id] = existing._id;
      continue;
    }
    const exists = await User.findOne({ email: u.email });
    if (exists) { userIdMap[u.id] = exists._id; continue; }
    // Hash the plain password from localStorage
    const hashed = await bcrypt.hash(u.password || 'password123', 10);
    const newUser = await User.create({
      name: u.name, email: u.email, password: hashed,
      phone: u.phone || '', role: u.role || 'user',
      createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
    });
    userIdMap[u.id] = newUser._id;
    importedUsers++;
  }
  console.log(`👤 Users imported: ${importedUsers}`);

  // --- BOOKINGS ---
  let importedBookings = 0;
  for (const b of (data.bookings || [])) {
    const userId = userIdMap[b.userId];
    if (!userId) continue;
    const exists = await Booking.findOne({ userId, itemId: b.itemId, type: b.type, status: b.status });
    if (exists) continue;
    await Booking.create({
      userId, itemId: b.itemId || b.id,
      type: b.type, title: b.title, image: b.image || '',
      price: b.price, destination: b.destination || '',
      duration: b.duration || '', status: b.status || 'confirmed',
      cancelledAt: b.cancelledAt ? new Date(b.cancelledAt) : undefined,
      completedAt: b.completedAt ? new Date(b.completedAt) : undefined,
      createdAt: b.bookedAt ? new Date(b.bookedAt) : new Date(),
    });
    importedBookings++;
  }
  console.log(`📅 Bookings imported: ${importedBookings}`);

  // --- ENQUIRIES ---
  let importedEnquiries = 0;
  for (const e of (data.enquiries || [])) {
    const exists = await Enquiry.findOne({ email: e.email, message: e.message });
    if (exists) continue;
    const userId = userIdMap[e.userId] || undefined;
    // Map old status values
    let status = e.status || 'New';
    if (status === 'pending') status = 'New';
    if (status === 'resolved') status = 'Replied';
    await Enquiry.create({
      userId, name: e.name, email: e.email,
      phone: e.phone || '', destination: e.destination || '',
      message: e.message, status,
      itemId: e.itemId || '', itemTitle: e.itemTitle || '',
      itemType: e.itemType || '', itemPrice: e.itemPrice,
      enquiryType: e.enquiryType || '', travelDate: e.travelDate || '',
      groupSize: e.groupSize || '1',
      adminReply: e.adminReply || '',
      repliedAt: e.repliedAt ? new Date(e.repliedAt) : undefined,
      createdAt: e.date ? new Date(e.date) : new Date(),
    });
    importedEnquiries++;
  }
  console.log(`📩 Enquiries imported: ${importedEnquiries}`);

  // --- REVIEWS ---
  let importedReviews = 0;
  for (const r of (data.reviews || [])) {
    if (!r.comment) continue;
    const exists = await Review.findOne({ userName: r.userName, comment: r.comment });
    if (exists) continue;
    const userId = userIdMap[r.userId];
    if (!userId) continue;
    await Review.create({
      userId, userName: r.userName, avatar: r.avatar || '',
      destinationId: r.destinationId || 'unknown',
      destinationName: r.destinationName || '', rating: r.rating,
      comment: r.comment,
      createdAt: r.date ? new Date(r.date) : new Date(),
    });
    importedReviews++;
  }
  console.log(`⭐ Reviews imported: ${importedReviews}`);

  // --- GALLERY ---
  let importedGallery = 0;
  for (const g of (data.gallery || [])) {
    const exists = await Gallery.findOne({ title: g.title });
    if (exists) continue;
    const userId = userIdMap[g.userId];
    if (!userId) continue;
    await Gallery.create({
      userId, title: g.title, description: g.description || '',
      image: g.image, location: g.location || '',
      createdAt: g.date ? new Date(g.date) : new Date(),
    });
    importedGallery++;
  }
  console.log(`🖼️ Gallery items imported: ${importedGallery}`);

  console.log('\n✅ Migration complete!');
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
