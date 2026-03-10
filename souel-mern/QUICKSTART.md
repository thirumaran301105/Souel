# Quick Start Guide for Souel Cafe MERN Stack

## Prerequisites
- Node.js installed
- MongoDB installed locally or MongoDB Atlas account
- Code editor (VS Code recommended)

## Step 1: Set Up MongoDB

### Option A: Local MongoDB
1. Download and install MongoDB
2. Start MongoDB service

### Option B: MongoDB Atlas (Cloud)
1. Visit https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string

## Step 2: Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB connection string
# Update: MONGODB_URI, JWT_SECRET, CORS_ORIGIN

# Start development server
npm run dev
```

Server should run on http://localhost:5000

Test it: http://localhost:5000/api/health

## Step 3: Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# Start React app
npm start
```

App should open at http://localhost:3000

## Step 4: Add Sample Data

You can add menu items via the API:

```bash
# Using curl or Postman, POST to http://localhost:5000/api/menu

{
  "name": "Espresso",
  "description": "Strong and bold single shot",
  "category": "coffee",
  "price": 2.50,
  "image": "☕",
  "available": true
}
```

Or use MongoDB Compass to directly insert documents.

## Testing the App

1. **Register an account**: Go to http://localhost:3000/register
2. **Browse menu**: Visit /menu to see available items
3. **Add to cart**: Click "Add to Cart" on items
4. **Checkout**: Go to /cart and place order
5. **Track orders**: View orders in /orders page

## Common Commands

### Backend
```bash
npm run dev      # Start with nodemon
npm start        # Start production
```

### Frontend
```bash
npm start        # Start development server
npm build        # Build for production
npm test         # Run tests
```

## Troubleshooting

### Port Already in Use
```bash
# Change port in server/.env
PORT=5001

# Or kill process using port 5000
# Windows: netstat -ano | findstr :5000
#         taskkill /PID [PID] /F
```

### MongoDB Connection Error
- Check MONGODB_URI in .env
- Ensure MongoDB is running
- Verify connection string format

### CORS Error
- Make sure both backend (5000) and frontend (3000) are running
- Check CORS_ORIGIN in server/.env

## Helpful Resources

- MongoDB Compass - Visual tool for MongoDB
- Postman - API testing tool
- React Developer Tools - Chrome extension
- NoSQL Booster - MongoDB IDE

## Next Steps

1. Customize the menu items
2. Add your cafe's information
3. Set up payment integration
4. Deploy to production
5. Add more features

---

Happy developing! ☕
