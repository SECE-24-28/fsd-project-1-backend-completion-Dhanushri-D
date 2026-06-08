require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Destination = require('./models/Destination');
const Package = require('./models/Package');
const Hotel = require('./models/Hotel');
const Review = require('./models/Review');
const Gallery = require('./models/Gallery');

const destinations = [
  {
    title: 'Goa Beaches', category: 'Beaches', location: 'Goa, India',
    description: "Experience the vibrant beaches, Portuguese heritage, and electrifying nightlife of India's favorite coastal paradise. From the serene shores of Palolem to the lively Baga Beach, Goa offers an unmatched blend of relaxation and adventure.",
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    rating: 4.7, price: 12000, bestSeason: 'November-February', duration: '5 Days / 4 Nights',
    highlights: ['Baga Beach', 'Dudhsagar Falls', 'Old Goa Churches', 'Spice Plantations'],
    pickupPoints: ['Chennai Central – 6:00 AM', 'Tambaram Bus Stand – 6:30 AM', 'Koyambedu – 7:00 AM'],
    coveringPlaces: ['Baga Beach', 'Fort Aguada', 'Dudhsagar Falls', 'Old Goa Churches', 'Palolem Beach'],
    droppingPoints: ['Koyambedu – 8:00 PM', 'Tambaram Bus Stand – 8:30 PM', 'Chennai Central – 9:00 PM'],
    tripHotels: ['Hotel Baga Retreat (3★) – Night 1 & 2', 'Sea Shell Inn South Goa (3★) – Night 3 & 4']
  },
  {
    title: 'Manali Adventure', category: 'Adventure', location: 'Manali, Himachal Pradesh',
    description: 'Nestled in the Himalayas, Manali is a paradise for adventure seekers. Enjoy skiing, paragliding, river rafting, and trekking amidst breathtaking snow-capped peaks and lush valleys.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    rating: 4.8, price: 15000, bestSeason: 'October-June', duration: '6 Days / 5 Nights',
    highlights: ['Rohtang Pass', 'Solang Valley', 'Hadimba Temple', 'Beas River Rafting'],
    pickupPoints: ['Delhi ISBT Kashmere Gate – 7:00 PM', 'Majnu Ka Tilla – 7:30 PM', 'Chandigarh Bus Stand – 10:00 PM'],
    coveringPlaces: ['Solang Valley', 'Rohtang Pass', 'Kullu River Rafting', 'Hadimba Temple', 'Vashisht Hot Springs'],
    droppingPoints: ['Chandigarh Bus Stand – 6:00 AM', 'Delhi ISBT Kashmere Gate – 9:00 AM'],
    tripHotels: ['Snow View Hotel Manali (3★) – Night 1 to 4', 'Valley Inn Kullu (2★) – Night 5']
  },
  {
    title: 'Munnar Tea Gardens', category: 'Hill & Mountains', location: 'Munnar, Kerala',
    description: 'Discover the emerald green tea plantations, misty mountains, and exotic wildlife of Munnar. This hill station in Kerala is a perfect retreat for nature lovers seeking tranquility.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    rating: 4.6, price: 11000, bestSeason: 'September-March', duration: '4 Days / 3 Nights',
    highlights: ['Tea Museum', 'Eravikulam National Park', 'Mattupetty Dam', 'Top Station'],
    pickupPoints: ['Kochi Airport – 7:00 AM', 'Ernakulam Junction – 7:45 AM', 'Aluva Bus Stand – 8:15 AM'],
    coveringPlaces: ['Tea Museum', 'Eravikulam National Park', 'Mattupetty Dam', 'Echo Point', 'Top Station'],
    droppingPoints: ['Aluva Bus Stand – 5:00 PM', 'Ernakulam Junction – 5:30 PM', 'Kochi Airport – 6:15 PM'],
    tripHotels: ['Misty Mountain Resort Munnar (3★) – All 3 Nights']
  },
  {
    title: 'Ooty Nilgiris', category: 'Hill & Mountains', location: 'Ooty, Tamil Nadu',
    description: 'The Queen of Hill Stations, Ooty enchants visitors with its colonial charm, botanical gardens, and the iconic Nilgiri Mountain Railway. A perfect escape from the summer heat.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
    rating: 4.5, price: 9000, bestSeason: 'April-June', duration: '3 Days / 2 Nights',
    highlights: ['Ooty Lake', 'Botanical Gardens', 'Doddabetta Peak', 'Nilgiri Train'],
    pickupPoints: ['Chennai CMBT – 8:00 PM', 'Coimbatore Railway Station – 5:00 AM'],
    coveringPlaces: ['Ooty Lake', 'Botanical Gardens', 'Doddabetta Peak', 'Nilgiri Mountain Railway', 'Rose Garden'],
    droppingPoints: ['Coimbatore Railway Station – 6:00 PM', 'Chennai CMBT – 11:00 PM'],
    tripHotels: ['Nilgiri Breeze Hotel Ooty (3★) – Night 1 & 2']
  },
  {
    title: 'Kerala Backwaters', category: 'Honeymoon', location: 'Alleppey, Kerala',
    description: 'Glide through the serene backwaters of Kerala on a traditional houseboat. Experience the lush paddy fields, coconut groves, and the unique lifestyle of the waterway communities.',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&q=80',
    rating: 4.9, price: 18000, bestSeason: 'October-March', duration: '4 Days / 3 Nights',
    highlights: ['Houseboat Stay', 'Vembanad Lake', 'Kumarakom Bird Sanctuary', 'Kuttanad Paddy Fields'],
    pickupPoints: ['Kochi Airport – 8:00 AM', 'Ernakulam Junction – 9:00 AM'],
    coveringPlaces: ['Vembanad Lake', 'Kumarakom Bird Sanctuary', 'Alleppey Houseboat Cruise', 'Kuttanad Paddy Fields', 'Marari Beach'],
    droppingPoints: ['Ernakulam Junction – 4:00 PM', 'Kochi Airport – 5:00 PM'],
    tripHotels: ['Lake Song Houseboat (Luxury) – Night 2 & 3', 'Kumarakom Lake Resort (4★) – Night 1']
  },
  {
    title: 'Kodaikanal Princess', category: 'Hill & Mountains', location: 'Kodaikanal, Tamil Nadu',
    description: "Known as the Princess of Hill Stations, Kodaikanal offers stunning views, a star-shaped lake, and dense forests. Perfect for romantic getaways and nature walks.",
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    rating: 4.5, price: 10000, bestSeason: 'April-June', duration: '3 Days / 2 Nights',
    highlights: ['Kodai Lake', "Coaker's Walk", 'Bryant Park', 'Silver Cascade Falls'],
    pickupPoints: ['Chennai CMBT – 9:00 PM', 'Madurai Bus Stand – 3:00 AM'],
    coveringPlaces: ['Kodai Lake', "Coaker's Walk", 'Bryant Park', 'Silver Cascade Falls', 'Pillar Rocks'],
    droppingPoints: ['Madurai Bus Stand – 7:00 PM', 'Chennai CMBT – 1:00 AM'],
    tripHotels: ['Carlton Hotel Kodaikanal (4★) – Night 1 & 2']
  },
  {
    title: 'Bali Paradise', category: 'International Destinations', location: 'Bali, Indonesia',
    description: 'The Island of Gods, Bali captivates with its terraced rice paddies, ancient temples, pristine beaches, and vibrant arts scene. A spiritual and sensory journey like no other.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    rating: 4.9, price: 65000, bestSeason: 'April-October', duration: '8 Days / 7 Nights',
    highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach', 'Mount Batur'],
    pickupPoints: ['Chennai Airport – Flight Departure', 'Mumbai Airport – Connecting Flight'],
    coveringPlaces: ['Tegalalang Rice Terraces', 'Ubud Monkey Forest', 'Tanah Lot Temple', 'Mount Batur', 'Nusa Penida', 'Seminyak Beach'],
    droppingPoints: ['Mumbai Airport – Transit', 'Chennai Airport – Arrival'],
    tripHotels: ['Seminyak Suite Bali (4★) – Night 1, 2, 6, 7', 'Ubud Harmony Resort (3★) – Night 3, 4, 5']
  },
  {
    title: 'Maldives Luxury', category: 'Honeymoon', location: 'Maldives',
    description: 'The ultimate luxury destination with crystal-clear turquoise waters, overwater bungalows, and vibrant coral reefs. Maldives is the epitome of paradise on earth.',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    rating: 5.0, price: 120000, bestSeason: 'November-April', duration: '5 Days / 4 Nights',
    highlights: ['Overwater Villas', 'Snorkeling & Diving', 'Dolphin Watching', 'Sunset Cruises'],
    pickupPoints: ['Chennai Airport – International Departure', 'Bangalore Airport – Connecting'],
    coveringPlaces: ['Male Atoll', 'Overwater Villa Stay', 'Snorkeling at House Reef', 'Sandbank Picnic', 'Dolphin Watching Cruise'],
    droppingPoints: ['Bangalore Airport – Transit', 'Chennai Airport – Arrival'],
    tripHotels: ['Anantara Veli Overwater Resort (5★) – All 4 Nights']
  },
  {
    title: 'Switzerland Alps', category: 'International Destinations', location: 'Switzerland, Europe',
    description: 'Experience the majestic Swiss Alps, pristine lakes, charming villages, and world-class ski resorts. Switzerland offers a perfect blend of natural beauty and luxury.',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
    rating: 4.9, price: 180000, bestSeason: 'December-March', duration: '7 Days / 6 Nights',
    highlights: ['Jungfraujoch', 'Lake Geneva', 'Interlaken', 'Zermatt & Matterhorn'],
    pickupPoints: ['Mumbai Airport – International Departure', 'Delhi Airport – Connecting'],
    coveringPlaces: ['Zurich City Tour', 'Jungfraujoch Top of Europe', 'Interlaken', 'Lake Geneva', 'Zermatt & Matterhorn'],
    droppingPoints: ['Delhi Airport – Transit', 'Mumbai Airport – Arrival'],
    tripHotels: ['Hotel Belvedere Interlaken (4★) – Night 1, 2', 'Zermatt Peak Lodge (4★) – Night 3, 4, 5', 'Geneva Grand Hotel (3★) – Night 6']
  },
  {
    title: 'Rajasthan Heritage', category: 'Heritage', location: 'Rajasthan, India',
    description: "Step into the royal world of Rajasthan with its magnificent forts, opulent palaces, vibrant culture, and the golden Thar Desert. A journey through India's regal past.",
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
    rating: 4.7, price: 14000, bestSeason: 'October-March', duration: '7 Days / 6 Nights',
    highlights: ['Amber Fort', 'Hawa Mahal', 'Jaisalmer Desert', 'Lake Pichola'],
    pickupPoints: ['Delhi ISBT – 6:00 AM', 'Delhi Airport – 8:00 AM'],
    coveringPlaces: ['Jaipur – Amber Fort & Hawa Mahal', 'Jodhpur – Mehrangarh Fort', 'Jaisalmer Desert Safari', 'Udaipur – Lake Pichola', 'Pushkar Temple'],
    droppingPoints: ['Delhi Airport – 7:00 PM', 'Delhi ISBT – 8:30 PM'],
    tripHotels: ['Jai Mahal Palace Jaipur (5★) – Night 1', 'Raas Jodhpur (4★) – Night 2, 3', 'Suryagarh Jaisalmer (4★) – Night 4', 'Taj Lake Palace Udaipur (5★) – Night 5, 6']
  },
  {
    title: 'Jim Corbett Wildlife', category: 'Wildlife', location: 'Uttarakhand, India',
    description: "India's oldest national park, Jim Corbett is home to the majestic Bengal tiger, elephants, and diverse wildlife. An unforgettable safari experience in the Himalayan foothills.",
    image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80',
    rating: 4.6, price: 16000, bestSeason: 'November-June', duration: '4 Days / 3 Nights',
    highlights: ['Tiger Safari', 'Elephant Rides', 'Bird Watching', 'Corbett Museum'],
    pickupPoints: ['Delhi ISBT Kashmere Gate – 6:00 AM', 'Haridwar Bus Stand – 9:30 AM'],
    coveringPlaces: ['Bijrani Safari Zone', 'Dhikala Forest Lodge', 'Corbett Museum', 'Garjia Temple', 'Kosi River Bird Watching'],
    droppingPoints: ['Haridwar Bus Stand – 4:00 PM', 'Delhi ISBT Kashmere Gate – 7:30 PM'],
    tripHotels: ["Corbett Hideaway Resort (3★) – Night 1, 2", "Jim's Jungle Retreat (4★) – Night 3"]
  },
  {
    title: 'Varanasi Pilgrimage', category: 'Pilgrimage', location: 'Varanasi, Uttar Pradesh',
    description: "One of the world's oldest living cities, Varanasi is the spiritual heart of India. Experience the mesmerizing Ganga Aarti, ancient ghats, and the profound spiritual energy.",
    image: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&q=80',
    rating: 4.8, price: 8000, bestSeason: 'October-March', duration: '3 Days / 2 Nights',
    highlights: ['Dashashwamedh Ghat', 'Kashi Vishwanath Temple', 'Boat Ride on Ganges', 'Sarnath'],
    pickupPoints: ['Delhi ISBT – 8:00 PM (Night Bus)', 'Allahabad Bus Stand – 3:00 AM'],
    coveringPlaces: ['Dashashwamedh Ghat – Ganga Aarti', 'Kashi Vishwanath Temple', 'Morning Boat Ride on Ganges', 'Sarnath Buddhist Site', 'Manikarnika Ghat'],
    droppingPoints: ['Allahabad Bus Stand – 6:00 PM', 'Delhi ISBT – 12:00 AM'],
    tripHotels: ['BrijRama Palace Varanasi (5★) – Night 1 & 2']
  }
];

const packages = [
  {
    title: 'Goa Beach Bliss', destination: 'Goa', duration: '5 Days / 4 Nights', price: 18999,
    description: 'A perfect beach holiday with water sports, nightlife, and heritage tours.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    rating: 4.7, includes: ['Hotel', 'Breakfast', 'Airport Transfer', 'Sightseeing'],
    itinerary: [
      { day: 1, title: 'Arrival & North Goa Beaches', activities: 'Arrive at Goa airport, check-in to hotel. Visit Baga, Calangute, and Anjuna beaches. Evening at leisure.' },
      { day: 2, title: 'Water Sports & Nightlife', activities: "Morning water sports at Baga Beach. Afternoon visit to Fort Aguada. Evening explore Tito's Lane nightlife." },
      { day: 3, title: 'South Goa Exploration', activities: 'Visit Palolem Beach, Colva Beach. Explore Cabo de Rama Fort. Sunset at Benaulim Beach.' },
      { day: 4, title: 'Heritage & Culture', activities: 'Visit Old Goa churches - Basilica of Bom Jesus, Se Cathedral. Spice plantation tour. Cultural show.' },
      { day: 5, title: 'Departure', activities: 'Morning at leisure. Shopping at Mapusa Market. Transfer to airport.' }
    ]
  },
  {
    title: 'Manali Snow Adventure', destination: 'Manali', duration: '6 Days / 5 Nights', price: 22999,
    description: 'Thrilling adventure package with skiing, trekking, and snow activities.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    rating: 4.8, includes: ['Hotel', 'All Meals', 'Adventure Activities', 'Transport'],
    itinerary: [
      { day: 1, title: 'Arrival in Manali', activities: 'Arrive at Bhuntar airport, drive to Manali. Check-in and rest. Evening walk on Mall Road.' },
      { day: 2, title: 'Solang Valley', activities: 'Full day at Solang Valley. Skiing, snow tubing, and zorbing. Paragliding option available.' },
      { day: 3, title: 'Rohtang Pass', activities: 'Early morning drive to Rohtang Pass (subject to permit). Snow activities, photography. Return by evening.' },
      { day: 4, title: 'Kullu & River Rafting', activities: 'Drive to Kullu. White water rafting on Beas River. Visit Kullu Shawl factories.' },
      { day: 5, title: 'Local Sightseeing', activities: 'Visit Hadimba Temple, Manu Temple, Tibetan Monastery. Vashisht hot springs.' },
      { day: 6, title: 'Departure', activities: 'Morning at leisure. Transfer to Bhuntar airport.' }
    ]
  },
  {
    title: 'Kerala Backwater Retreat', destination: 'Kerala', duration: '7 Days / 6 Nights', price: 28999,
    description: "Luxury houseboat experience through Kerala's enchanting backwaters.",
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&q=80',
    rating: 4.9, includes: ['Houseboat', 'All Meals', 'Ayurvedic Spa', 'Transfers'],
    itinerary: [
      { day: 1, title: 'Arrive Kochi', activities: 'Arrive at Kochi airport. Visit Fort Kochi, Chinese Fishing Nets, Mattancherry Palace.' },
      { day: 2, title: 'Munnar Hills', activities: 'Drive to Munnar. Visit tea gardens, Tea Museum, Eravikulam National Park.' },
      { day: 3, title: 'Munnar Exploration', activities: 'Mattupetty Dam, Echo Point, Top Station. Sunset at Rajamala.' },
      { day: 4, title: 'Thekkady Wildlife', activities: 'Drive to Thekkady. Periyar Wildlife Sanctuary boat ride. Spice garden tour.' },
      { day: 5, title: 'Alleppey Houseboat', activities: 'Drive to Alleppey. Board luxury houseboat. Cruise through backwaters. Overnight on houseboat.' },
      { day: 6, title: 'Backwater Cruise', activities: 'Morning cruise. Disembark at Alleppey. Drive to Kovalam Beach.' },
      { day: 7, title: 'Departure', activities: 'Morning at Kovalam Beach. Transfer to Trivandrum airport.' }
    ]
  },
  {
    title: 'Bali Dream Escape', destination: 'Bali', duration: '8 Days / 7 Nights', price: 75999,
    description: 'Explore the magical island of Bali with temples, rice terraces, and beaches.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    rating: 4.9, includes: ['Resort', 'Breakfast', 'Tours', 'Airport Transfer'],
    itinerary: [
      { day: 1, title: 'Arrive Bali', activities: 'Arrive at Ngurah Rai Airport. Transfer to Seminyak resort. Evening at Seminyak Beach.' },
      { day: 2, title: 'Ubud Cultural Tour', activities: 'Visit Tegalalang Rice Terraces, Ubud Monkey Forest, Ubud Palace, Ubud Art Market.' },
      { day: 3, title: 'Temple Trail', activities: 'Tanah Lot Temple at sunset, Uluwatu Temple, Kecak Fire Dance performance.' },
      { day: 4, title: 'Mount Batur Sunrise', activities: 'Early morning trek to Mount Batur for sunrise. Afternoon at Kintamani.' },
      { day: 5, title: 'Water Sports', activities: 'Nusa Dua water sports - parasailing, jet ski, banana boat. Afternoon spa.' },
      { day: 6, title: 'Nusa Penida', activities: "Day trip to Nusa Penida. Visit Kelingking Beach, Angel's Billabong, Broken Beach." },
      { day: 7, title: 'Shopping & Leisure', activities: 'Shopping at Seminyak Square. Sunset at Ku De Ta. Farewell dinner.' },
      { day: 8, title: 'Departure', activities: 'Transfer to airport. Depart Bali.' }
    ]
  },
  {
    title: 'Maldives Luxury Escape', destination: 'Maldives', duration: '5 Days / 4 Nights', price: 135000,
    description: 'Ultimate luxury overwater villa experience in the pristine Maldives.',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    rating: 5.0, includes: ['Overwater Villa', 'All Inclusive', 'Seaplane Transfer', 'Diving'],
    itinerary: [
      { day: 1, title: 'Arrive Maldives', activities: 'Arrive at Male airport. Seaplane transfer to resort. Check-in to overwater villa. Sunset dinner.' },
      { day: 2, title: 'Snorkeling & Diving', activities: 'Morning snorkeling at house reef. Afternoon scuba diving. Evening dolphin watching cruise.' },
      { day: 3, title: 'Island Hopping', activities: 'Visit local Maldivian island. Sandbank picnic. Underwater restaurant dinner.' },
      { day: 4, title: 'Water Sports & Spa', activities: 'Kayaking, paddleboarding, windsurfing. Afternoon luxury spa treatment.' },
      { day: 5, title: 'Departure', activities: 'Morning at leisure. Seaplane transfer to Male. Depart.' }
    ]
  },
  {
    title: 'Rajasthan Royal Tour', destination: 'Rajasthan', duration: '9 Days / 8 Nights', price: 32999,
    description: 'A royal journey through the forts, palaces, and deserts of Rajasthan.',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
    rating: 4.7, includes: ['Heritage Hotel', 'Breakfast & Dinner', 'AC Transport', 'Guide'],
    itinerary: [
      { day: 1, title: 'Arrive Jaipur', activities: 'Arrive at Jaipur airport. Check-in to heritage hotel. Evening at Chokhi Dhani.' },
      { day: 2, title: 'Jaipur Sightseeing', activities: 'Amber Fort, Hawa Mahal, City Palace, Jantar Mantar. Evening at Johri Bazaar.' },
      { day: 3, title: 'Jaipur to Jodhpur', activities: 'Drive to Jodhpur. Visit Mehrangarh Fort, Jaswant Thada, Clock Tower Market.' },
      { day: 4, title: 'Jodhpur to Jaisalmer', activities: 'Drive to Jaisalmer. Visit Jaisalmer Fort, Patwon Ki Haveli.' },
      { day: 5, title: 'Desert Safari', activities: 'Sam Sand Dunes camel safari. Sunset in desert. Cultural program and bonfire.' },
      { day: 6, title: 'Jaisalmer to Udaipur', activities: 'Drive to Udaipur via Ranakpur Jain Temples.' },
      { day: 7, title: 'Udaipur City of Lakes', activities: 'City Palace, Lake Pichola boat ride, Jagdish Temple, Saheliyon Ki Bari.' },
      { day: 8, title: 'Pushkar', activities: 'Drive to Pushkar. Visit Brahma Temple, Pushkar Lake. Shopping.' },
      { day: 9, title: 'Departure', activities: 'Drive to Jaipur airport. Depart.' }
    ]
  }
];

const hotels = [
  {
    name: 'The Leela Goa', location: 'Cavelossim, Goa', price: 12000, rating: 4.9,
    amenities: ['Pool', 'Spa', 'Beach Access', 'Restaurant', 'Bar', 'Gym', 'WiFi'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    description: 'A luxury beachfront resort offering world-class amenities and stunning views of the Arabian Sea.', type: 'Resort'
  },
  {
    name: 'Wildflower Hall Manali', location: 'Manali, Himachal Pradesh', price: 18000, rating: 4.8,
    amenities: ['Mountain View', 'Spa', 'Heated Pool', 'Restaurant', 'Trekking', 'WiFi'],
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    description: 'A heritage mountain retreat nestled in the Himalayas offering breathtaking views and luxury amenities.', type: 'Heritage Hotel'
  },
  {
    name: 'Spice Village Thekkady', location: 'Thekkady, Kerala', price: 8500, rating: 4.7,
    amenities: ['Ayurvedic Spa', 'Restaurant', 'Garden', 'Wildlife Tours', 'WiFi', 'Yoga'],
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    description: 'An eco-friendly resort in the heart of a spice plantation, offering authentic Kerala experiences.', type: 'Eco Resort'
  },
  {
    name: 'Alila Diwa Goa', location: 'Majorda, Goa', price: 9500, rating: 4.6,
    amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'WiFi', 'Beach Shuttle'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    description: 'A contemporary luxury resort inspired by Goan architecture, surrounded by paddy fields.', type: 'Luxury Hotel'
  },
  {
    name: 'Taj Lake Palace Udaipur', location: 'Udaipur, Rajasthan', price: 35000, rating: 5.0,
    amenities: ['Lake View', 'Pool', 'Spa', 'Fine Dining', 'Boat Transfer', 'WiFi', 'Butler'],
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    description: 'A floating palace on Lake Pichola, offering an unparalleled royal experience in Rajasthan.', type: 'Palace Hotel'
  },
  {
    name: 'Anantara Veli Maldives', location: 'South Male Atoll, Maldives', price: 85000, rating: 5.0,
    amenities: ['Overwater Villa', 'Private Pool', 'Diving', 'Spa', 'Fine Dining', 'Seaplane'],
    image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80',
    description: 'An adults-only overwater paradise in the Maldives with stunning lagoon views.', type: 'Overwater Resort'
  },
  {
    name: 'Kempinski Ambience Delhi', location: 'New Delhi', price: 15000, rating: 4.7,
    amenities: ['Pool', 'Spa', 'Multiple Restaurants', 'Bar', 'Gym', 'WiFi', 'Business Center'],
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    description: 'A grand luxury hotel in the heart of Delhi offering European elegance with Indian hospitality.', type: 'Luxury Hotel'
  },
  {
    name: 'Alaya Resort Ubud Bali', location: 'Ubud, Bali', price: 22000, rating: 4.8,
    amenities: ['Infinity Pool', 'Spa', 'Yoga', 'Restaurant', 'Rice Field View', 'WiFi'],
    image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&q=80',
    description: 'A boutique luxury resort in Ubud surrounded by lush rice terraces and tropical gardens.', type: 'Boutique Resort'
  }
];

const reviewsData = [
  { userName: 'Priya Sharma', avatar: 'PS', destinationName: 'Goa Beaches', rating: 5, comment: 'Absolutely magical experience! The beaches were pristine and the nightlife was incredible. TripNova made everything seamless.', createdAt: new Date('2024-01-15') },
  { userName: 'Rahul Verma', avatar: 'RV', destinationName: 'Bali Paradise', rating: 5, comment: 'Bali exceeded all expectations. The temples, rice terraces, and people were absolutely wonderful. Will definitely return!', createdAt: new Date('2024-02-20') },
  { userName: 'Ananya Patel', avatar: 'AP', destinationName: 'Kerala Backwaters', rating: 5, comment: 'The houseboat experience was surreal. Waking up to the sound of water and birds was pure bliss. Highly recommend!', createdAt: new Date('2024-03-10') },
  { userName: 'Vikram Singh', avatar: 'VS', destinationName: 'Manali Adventure', rating: 4, comment: "Great adventure trip! Rohtang Pass was breathtaking. The skiing at Solang Valley was a first-time experience I'll never forget.", createdAt: new Date('2024-01-28') },
  { userName: 'Meera Nair', avatar: 'MN', destinationName: 'Maldives Luxury', rating: 5, comment: 'The Maldives is truly paradise on earth. The overwater villa was stunning and the marine life was incredible.', createdAt: new Date('2024-02-14') },
  { userName: 'Arjun Kapoor', avatar: 'AK', destinationName: 'Switzerland Alps', rating: 5, comment: 'Switzerland is a dream destination. Jungfraujoch was absolutely spectacular. The snow, the views, everything was perfect.', createdAt: new Date('2024-03-05') }
];

const galleryItems = [
  { title: 'Sunset at Baga Beach', description: "Golden hour at Goa's most famous beach", image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80', location: 'Goa' },
  { title: 'Himalayan Peaks', description: 'Snow-capped peaks of Manali', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80', location: 'Manali' },
  { title: 'Kerala Houseboat', description: 'Serene backwaters of Alleppey', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&q=80', location: 'Kerala' },
  { title: 'Bali Rice Terraces', description: 'Tegalalang rice terraces at dawn', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', location: 'Bali' },
  { title: 'Maldives Crystal Waters', description: 'Turquoise lagoon of the Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80', location: 'Maldives' },
  { title: 'Swiss Alps Winter', description: 'Magical winter landscape in Switzerland', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80', location: 'Switzerland' },
  { title: 'Rajasthan Fort', description: 'Majestic Amber Fort at golden hour', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80', location: 'Rajasthan' },
  { title: 'Munnar Tea Gardens', description: 'Endless green tea plantations', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', location: 'Munnar' }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Destination.deleteMany({}),
    Package.deleteMany({}),
    Hotel.deleteMany({}),
    Review.deleteMany({}),
    Gallery.deleteMany({})
  ]);
  console.log('Cleared existing data');

  // Create admin user (password will be hashed via pre-save hook)
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@tripnova.com',
    password: 'admin123',
    phone: '+91 9876543210',
    role: 'admin'
  });
  console.log('Admin user created:', admin.email);

  // Seed destinations, packages, hotels
  const insertedDests = await Destination.insertMany(destinations);
  const insertedPkgs = await Package.insertMany(packages);
  const insertedHotels = await Hotel.insertMany(hotels);
  console.log(`Inserted ${insertedDests.length} destinations`);
  console.log(`Inserted ${insertedPkgs.length} packages`);
  console.log(`Inserted ${insertedHotels.length} hotels`);

  // Seed reviews — link to admin userId and match destinationId by title
  const reviews = reviewsData.map(r => {
    const dest = insertedDests.find(d => d.title === r.destinationName);
    return {
      userId: admin._id,
      userName: r.userName,
      avatar: r.avatar,
      destinationId: dest ? dest._id.toString() : 'unknown',
      destinationName: r.destinationName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt
    };
  });
  const insertedReviews = await Review.insertMany(reviews);
  console.log(`Inserted ${insertedReviews.length} reviews`);

  // Seed gallery — link to admin userId
  const gallery = galleryItems.map(g => ({ ...g, userId: admin._id }));
  const insertedGallery = await Gallery.insertMany(gallery);
  console.log(`Inserted ${insertedGallery.length} gallery items`);

  console.log('\n✅ Seeding complete!');
  console.log('Admin login → email: admin@tripnova.com | password: admin123');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
