# Souel Cafe - MERN Stack Application

A full-featured coffee shop web application built with the MERN stack (MongoDB, Express, React, Node.js).

## Project Overview

Souel Cafe is a modern web application that allows customers to:
- Browse the cafe menu
- Add items to cart
- Place orders (dine-in, takeout, delivery)
- Track order status
- Create accounts and manage orders

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **React Router v6** - Routing
- **Axios** - HTTP client
- **CSS3** - Styling

## Project Structure

```
souel-mern/
├── server/                 # Backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Request handlers
│   ├── models/           # Database schemas
│   ├── routes/           # API routes
│   ├── .env.example      # Environment variables template
│   ├── package.json      # Server dependencies
│   └── server.js         # Main server file
│
└── client/               # Frontend
    ├── public/           # Static files
    ├── src/
    │   ├── components/   # React components
    │   ├── context/      # Context API providers
    │   ├── pages/        # Page components
    │   ├── services/     # API services
    │   ├── styles/       # CSS files
    │   ├── App.js        # Main App component
    │   └── index.js      # React entry point
    └── package.json      # Client dependencies
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string and JWT secret:
```
MONGODB_URI=mongodb://localhost:27017/souel-cafe
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:3000
```

5. Start the server:
```bash
# Development with nodemon
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## API Endpoints

### Menu Endpoints
- `GET /api/menu` - Get all menu items (with optional category filter)
- `GET /api/menu/:id` - Get single menu item
- `POST /api/menu` - Create menu item (admin)
- `PUT /api/menu/:id` - Update menu item (admin)
- `DELETE /api/menu/:id` - Delete menu item (admin)

### Order Endpoints
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders/user/:userId` - Get user's orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/cancel` - Cancel order

### Auth Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

## Features

### User Features
✅ Browse menu by category
✅ Add items to shopping cart
✅ Manage cart quantities
✅ User authentication (register/login)
✅ Place orders with different types (dine-in, takeout, delivery)
✅ Track order status
✅ View order history
✅ Responsive mobile design

### Admin Features
✅ Add/edit/delete menu items
✅ Manage order status
✅ View all orders

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  role: String (customer/admin),
  favorites: [MenuItem]
}
```

### MenuItem
```javascript
{
  name: String,
  description: String,
  category: String (coffee/tea/pastry/snack/beverage),
  price: Number,
  image: String,
  available: Boolean,
  rating: Number,
  reviews: Number
}
```

### Order
```javascript
{
  user: User (reference),
  items: [
    {
      menuItem: MenuItem,
      quantity: Number,
      specialRequests: String
    }
  ],
  totalAmount: Number,
  orderType: String (dine-in/takeout/delivery),
  status: String (pending/confirmed/preparing/ready/completed/cancelled),
  deliveryAddress: String,
  notes: String,
  estimatedTime: Number
}
```

## State Management

### Context API
- **AuthContext** - User authentication and profile
- **CartContext** - Shopping cart state

## Environment Variables

### Server `.env`
```
MONGODB_URI=mongodb://localhost:27017/souel-cafe
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGIN=http://localhost:3000
```

## Running in Production

### Build Frontend
```bash
cd client
npm run build
```

### Deploy
- Backend: Deploy to services like Heroku, Railway, Render, or DigitalOcean
- Frontend: Deploy to Vercel, Netlify, or GitHub Pages
- Database: Use MongoDB Atlas for cloud hosting

## Customization

### Add Menu Items
1. Use the admin panel or API to add menu items
2. Categories: coffee, tea, pastry, snack, beverage

### Modify Styling
- Update CSS in `client/src/styles/`
- Change color scheme in CSS variables (--primary-color, etc.)

### Add Payment Integration
- Integrate Stripe/PayPal in the checkout process
- Update OrderController to handle payments

## Future Enhancements

- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] SMS order updates
- [ ] Admin dashboard
- [ ] Reviews and ratings system
- [ ] Delivery tracking with maps
- [ ] Push notifications
- [ ] Real-time order updates (WebSockets)

## Security Considerations

- Passwords are hashed with bcryptjs
- JWT tokens for authentication
- CORS configured for specific origins
- Input validation with express-validator
- Environment variables for sensitive data

## Troubleshooting

### Connection Errors
- Ensure MongoDB is running
- Check MONGODB_URI in `.env`

### CORS Errors
- Verify CORS_ORIGIN matches your frontend URL
- Check if frontend and backend are both running

### PORT Already in Use
```bash
# Change PORT in .env or kill the process using the port
```

## Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please create an issue in the repository.

---

**Happy coding! ☕**
