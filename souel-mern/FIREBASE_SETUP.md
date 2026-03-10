# Firebase Migration Guide

## Step 1: Set Up Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Name it "Souel Cafe" (or your preference)
4. Enable Google Analytics (optional)
5. Create the project

## Step 2: Get Firebase Credentials

### For Backend (Server)

1. In Firebase Console, go to Project Settings (⚙️ icon)
2. Click "Service Accounts" tab
3. Click "Generate New Private Key"
4. Save the JSON file safely
5. Copy these values to server/.env:
   - `projectId` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

### For Frontend (Client)

1. In Firebase Console, go to Project Settings (⚙️ icon)
2. In "General" tab, scroll to "Your apps"
3. Click "Add app" and select Web
4. Copy the Firebase config object
5. Create `client/.env.local` and add:

```
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
```

## Step 3: Enable Firebase Services

1. In Firebase Console, go to "Build" section
2. **Enable Authentication**:
   - Click "Authentication"
   - Go to "Sign-in method"
   - Enable "Email/Password"

3. **Create Firestore Database**:
   - Click "Firestore Database"
   - Click "Create Database"
   - Choose region (closest to you)
   - Start in "Test mode" (change later for production)
   - Click "Enable"

## Step 4: Update Server Dependencies

```bash
cd server
npm install
```

## Step 5: Update Client Dependencies

```bash
cd ../client
npm install
```

## Step 6: Create Firestore Collections

The app will automatically create collections when needed, but you can pre-create them:

1. Go to Firestore Database
2. Create these collections (as needed):
   - `users` - for user profiles
   - `menuItems` - for menu items
   - `orders` - for customer orders

## Step 7: Add Security Rules

Go to Firestore → Rules and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Anyone can read menu items
    match /menuItems/{document=**} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }

    // Users can read/write their own orders
    match /orders/{orderId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow read: if request.auth.token.admin == true;
    }
  }
}
```

## Step 8: Test the App

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm start
```

Test registration and login:
1. Go to http://localhost:3000
2. Click "Register"
3. Create a new account
4. Check Firebase Console → Authentication to see the new user
5. Check Firestore to see user document created

## Migration Notes

### Key Changes:
- **Database**: MongoDB → Firestore
- **Auth**: JWT tokens → Firebase Authentication
- **Password Hashing**: Handled by Firebase (bcryptjs removed)
- **Backend**: Express API remains the same

### API Compatibility:
- All endpoints work the same
- Token format changed to Firebase ID tokens
- User documents stored in Firestore instead of MongoDB

### Collections in Firestore:

#### Users Collection
```
users/
  ├── uid (document ID)
  │   ├── name: string
  │   ├── email: string
  │   ├── phone: string
  │   ├── address: string
  │   ├── role: "customer" | "admin"
  │   ├── createdAt: timestamp
  │   ├── updatedAt: timestamp
  │   └── favorites: array
```

#### Menu Items Collection
```
menuItems/
  ├── documentId
  │   ├── name: string
  │   ├── description: string
  │   ├── category: string
  │   ├── price: number
  │   ├── image: string
  │   ├── available: boolean
  │   ├── rating: number
  │   ├── reviews: number
  │   ├── createdAt: timestamp
  │   └── updatedAt: timestamp
```

#### Orders Collection
```
orders/
  ├── documentId
  │   ├── userId: string
  │   ├── items: array
  │   │   ├── menuItemId: string
  │   │   ├── quantity: number
  │   │   ├── price: number
  │   │   └── specialRequests: string
  │   ├── totalAmount: number
  │   ├── orderType: string
  │   ├── status: string
  │   ├── deliveryAddress: string
  │   ├── notes: string
  │   ├── estimatedTime: number
  │   ├── createdAt: timestamp
  │   └── updatedAt: timestamp
```

## Production Setup

When moving to production:

1. Update Firestore Security Rules
2. Create Firebase project for production
3. Get new credentials
4. Update environment variables
5. Deploy backend and frontend
6. Test thoroughly

## Troubleshooting

### Firebase Connection Error
- Verify credentials in .env files
- Check Firestore is enabled in Firebase Console
- Ensure service account has permissions

### Authentication Error
- Check Firebase Auth is enabled
- Verify email/password provider is turned on
- Clear browser cache and cookies

### Data Not Saving
- Check Firestore Security Rules
- Verify user is authenticated
- Check browser console for errors

## Resources

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

Your app is now powered by Firebase! 🔥☕
