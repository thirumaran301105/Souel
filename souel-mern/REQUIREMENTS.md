# Souel Cafe MERN Stack - System Requirements

## Minimum Requirements

### Hardware
- **Processor**: Dual-core processor
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 2GB free space
- **Internet**: Stable connection required

### Software Requirements

#### Operating System
- Windows 10/11
- macOS 10.12+
- Linux (Ubuntu 18.04+)

#### Required Software
- **Node.js**: v14.0.0 or higher
  - Download: https://nodejs.org/
  - Verify: `node --version` and `npm --version`

- **MongoDB**: v4.0 or higher
  - Option 1: Local installation
    - Download: https://www.mongodb.com/try/download/community
    - Verify: `mongod --version`
  
  - Option 2: MongoDB Atlas (Cloud)
    - Register: https://www.mongodb.com/cloud/atlas
    - Free tier available

- **npm**: v6.0.0 or higher
  - Comes with Node.js
  - Verify: `npm --version`

#### Code Editor (Optional but Recommended)
- **VS Code**: https://code.visualstudio.com/
- **WebStorm**: https://www.jetbrains.com/webstorm/
- **Sublime Text**: https://www.sublimetext.com/

#### Browser (for Frontend)
- Chrome, Firefox, Safari, or Edge (latest version)
- Browser Extensions (Optional):
  - React Developer Tools
  - MongoDB Compass (Desktop app)

## Installation Steps

### 1. Verify Node.js Installation

```bash
node --version
# Should output v14.0.0 or higher

npm --version
# Should output v6.0.0 or higher
```

### 2. Install MongoDB (If Using Local)

**Windows:**
```
1. Download .msi installer
2. Run the installer
3. Follow the setup wizard
4. MongoDB will start as a service
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### 3. Clone/Download Project

```bash
# Navigate to your desired location
cd Documents
# or cd Desktop

# Extract the souel-mern folder
# The structure should be:
# souel-mern/
#   ├── server/
#   ├── client/
#   ├── README.md
#   └── package.json
```

### 4. Install Dependencies

```bash
cd souel-mern

# Install root dependencies (optional, for dev convenience)
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Verification Checklist

```bash
# Verify Node.js
node -v
# Expected: v14.0.0 or higher

# Verify npm
npm -v
# Expected: v6.0.0 or higher

# Verify MongoDB (if local)
mongod --version
# Expected: v4.0 or higher

# Test MongoDB connection
mongo --eval "db.version()"
# Or use MongoDB Compass GUI
```

## Environment Configuration

### Server Configuration

Create `.env` file in `server/` folder:

```
# Database
MONGODB_URI=mongodb://localhost:27017/souel-cafe
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/souel-cafe

# Server
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Client Configuration

The client uses the proxy setting in `package.json`:
```json
"proxy": "http://localhost:5000"
```

## Port Requirements

Ensure these ports are available:
- **3000** - React frontend (default)
- **5000** - Express backend (default)
- **27017** - MongoDB (if local)

### Check Port Availability

**Windows PowerShell:**
```powershell
netstat -ano | findstr :3000
# If port is in use, kill it with:
taskkill /PID [PID_NUMBER] /F
```

**macOS/Linux:**
```bash
lsof -i :3000
# If port is in use, kill it with:
kill -9 [PID]
```

## Troubleshooting Installation

### Issue: "npm: command not found"
**Solution**: Node.js is not installed. Download from nodejs.org

### Issue: "Cannot connect to MongoDB"
**Solution**: 
- Ensure MongoDB service is running
- Check MONGODB_URI in `.env`
- Verify MongoDB credentials for Atlas

### Issue: "Port 3000/5000 already in use"
**Solution**: Change port in environment or kill the process

### Issue: "Permission denied" on Linux/Mac
**Solution**: Use `sudo` or configure npm properly
```bash
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

### Issue: CORS Error
**Solution**: Verify CORS_ORIGIN in server `.env` matches frontend URL

## Performance Optimization

### For Development
- Keep development database lean
- Use `npm run dev` for auto-reload
- Use React DevTools for debugging

### For Production
- Use `npm run build` for frontend optimization
- Deploy to CDN for static assets
- Use MongoDB Atlas for managed database
- Enable gzip compression on server

## Security Checklist

Before deploying:
- [ ] Change JWT_SECRET to a secure value
- [ ] Use environment variables for sensitive data
- [ ] Never commit .env to version control
- [ ] Use HTTPS in production
- [ ] Validate all user inputs
- [ ] Use MongoDB authentication
- [ ] Enable CORS for specific domains only
- [ ] Implement rate limiting
- [ ] Use secure password hashing (already configured)

## Memory Usage

Typical memory requirements while running:
- MongoDB: 100MB - 500MB
- Node.js Backend: 50MB - 200MB
- React Frontend: 50MB - 150MB
- Total: ~200MB - 850MB

## Network Requirements

- Download speed: 1 Mbps minimum
- Initial npm install: ~500MB download
- MongoDB: Depends on data size

## File System Requirements

- Disk space for node_modules: ~500MB
- Database size: Depends on data
- Log files: ~50MB

## Recommended Tools

### Command Line
- **Windows**: PowerShell or Git Bash
- **macOS/Linux**: Terminal or iTerm2

### Database Management
- **MongoDB Compass**: Visual MongoDB client
- **Postman**: API testing tool
- **DBeaver**: Database management tool

### Development Tools
- **VS Code Extensions**:
  - ES7+ React/Redux/React-Native snippets
  - MongoDB for VS Code
  - Thunder Client (API testing)
  - Prettier (Code formatter)

## Final Checklist

Before starting development:

```bash
# 1. Node.js installed
node --version

# 2. npm installed
npm --version

# 3. MongoDB running
# Check MongoDB Compass or run: mongod

# 4. Navigate to project
cd souel-mern

# 5. Install all dependencies
npm install && cd server && npm install && cd ../client && npm install

# 6. Create .env file in server folder
# With proper MongoDB URI and other configurations

# 7. Start backend
cd server && npm run dev

# 8. In new terminal, start frontend
cd client && npm start

# 9. Visit http://localhost:3000
```

You're ready to develop! 🚀☕
