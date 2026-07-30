# SkillSwap Hub

A MEAN-stack web platform where university students exchange skills with each other. Students can offer skills they can teach, browse skills offered by others, and send/accept/reject learning session requests.

## Tech Stack

- **Frontend:** HTML5, CSS3, Bootstrap 5, Vanilla JavaScript
- **Backend:** Node.js + Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT-based authentication

## Project Structure

```
/student
├── backend/
│   ├── models/          # Mongoose models (User, Skill, Request)
│   ├── routes/          # Express routes (auth, skills, requests)
│   ├── controllers/     # Business logic controllers
│   ├── middleware/      # Authentication and error handling
│   ├── server.js        # Main server file
│   ├── package.json     # Backend dependencies
│   └── .env             # Environment variables
├── frontend/
│   ├── pages/           # HTML pages (8 pages)
│   ├── css/             # Custom CSS styles
│   └── js/              # JavaScript modules (api, auth, skills, requests, dashboard)
└── README.md
```

## Features

- User registration and authentication
- Offer skills with categories and descriptions
- Browse and search skills by category or keyword
- Send learning session requests to skill owners
- Accept or reject received requests
- Personal dashboard to manage skills and requests
- Real-time AJAX skill availability checking
- Responsive design with Bootstrap 5

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (installed and running)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:
   ```
   MONGO_URI=mongodb://localhost:27017/skillswap
   JWT_SECRET=your-secret-key-change-this-in-production
   PORT=5000
   ```

5. Start the server:
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

### Frontend Setup

The frontend is served statically by the Express server. No additional setup is required - just start the backend server and access the application at `http://localhost:5000`.

### Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Skills
- `GET /api/skills` - Get all skills (with optional search/category filters)
- `GET /api/skills/:id` - Get single skill details
- `GET /api/skills/check?title=...` - Check if skill title is available (protected)
- `GET /api/skills/mine` - Get skills owned by logged-in user (protected)
- `POST /api/skills` - Create a new skill (protected)
- `DELETE /api/skills/:id` - Delete a skill (protected)

### Requests
- `POST /api/requests` - Send a learning session request (protected)
- `GET /api/requests/sent` - Get requests sent by logged-in user (protected)
- `GET /api/requests/received` - Get requests received by logged-in user (protected)
- `PATCH /api/requests/:id` - Update request status (accept/reject) (protected)

## Pages

1. **Home** (`index.html`) - Landing page with hero section and how it works
2. **Browse Skills** (`browse-skills.html`) - Search and filter skills
3. **Offer a Skill** (`offer-skill.html`) - Form to offer a new skill with AJAX title check
4. **Request Session** (`request-session.html`) - Send learning session request
5. **My Dashboard** (`dashboard.html`) - Manage skills and requests
6. **About Developers** (`about.html`) - Project information and team
7. **Login** (`login.html`) - User login
8. **Register** (`register.html`) - User registration

## Development Notes

- All server communication uses AJAX/fetch - no full-page form posts
- JWT tokens are stored in localStorage and sent with every protected request
- The backend serves the frontend as static files from `/frontend` directory
- CORS is enabled for development (can be restricted in production)
- Client-side validation is performed before API calls
- Status badges: pending (yellow), accepted (green), rejected (red)

## License

ISC
