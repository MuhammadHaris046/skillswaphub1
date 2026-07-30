# MongoDB Atlas Setup Guide

Since MongoDB is not installed locally, we'll use MongoDB Atlas (free cloud database).

## Quick Setup Steps

### 1. Create Account
- Go to: https://www.mongodb.com/cloud/atlas
- Click "Try Free" and sign up (it's completely free)

### 2. Create Cluster
1. Click "Build a Database"
2. Choose "Free" tier (M0 cluster - 512MB storage)
3. Select a region closest to you
4. Name cluster: "skillswap-cluster"
5. Click "Create" (takes 2-3 minutes to provision)

### 3. Create Database User
1. Go to "Database Access" → "Add New Database User"
2. Username: `skillswap`
3. Password: (create a strong password, save it!)
4. Privileges: "Read and write to any database"
5. Click "Create User"

### 4. Network Access
1. Go to "Network Access" → "Add IP Address"
2. Choose "Allow Access from Anywhere" (0.0.0.0/0)
3. Click "Confirm"

### 5. Get Connection String
1. Go to "Database" → Click "Connect" on your cluster
2. Choose "Connect your application"
3. Select "Node.js" and version 4.0 or later
4. Copy the connection string

Your connection string will look like:
```
mongodb+srv://skillswap:YOUR_PASSWORD@skillswap-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Update .env File

Replace the MONGO_URI in `/home/abdullah/code/student/backend/.env` with your connection string:

```
MONGO_URI=mongodb+srv://skillswap:YOUR_PASSWORD@skillswap-cluster.xxxxx.mongodb.net/skillswap?retryWrites=true&w=majority
JWT_SECRET=skillswap-secret-key-2024
PORT=5000
```

## Start the Application

Once you've updated the .env file:

```bash
cd /home/abdullah/code/student/backend
yarn start
```

The application will be available at: http://localhost:5000

## Seed Database (Optional)

To add sample data (Ahmed, Saif, Saeed with their skills):

```bash
cd /home/abdullah/code/student/backend
yarn seed
```

## Test Accounts

After seeding, you can login with:
- Ahmed: ahmed@example.com / 123456789
- Saif: saif@example.com / 123456789
- Saeed: saeed@example.com / 123456789
