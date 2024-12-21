# Adaptive Physics Learning System

An adaptive learning system for physics education that adjusts to student performance and learning patterns.

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/covellaj/adaptive-physics-learning.git
cd adaptive-physics-learning
```

2. Install required Python packages:
```bash
pip install flask flask-cors sqlalchemy bcrypt PyJWT
```

3. Initialize the database:
```bash
python3 -c "from src.backend.database.init_db import init_db; init_db()"
```

## Running the Application

1. Start the backend server:
```bash
# From the project root directory
python3 src/backend/app.py
```
The backend will run on http://localhost:5500

2. Start the frontend server:
```bash
# From the project root directory
cd src/frontend/src
python3 -m http.server 8000
```
The frontend will be available at http://localhost:8000

## Features

- User registration and authentication
- JWT-based session management
- Adaptive learning algorithms (coming soon)
- Progress tracking
- Interactive UI

## Project Structure

```
adaptive-physics-learning/
├── data/
│   └── dev.db              # SQLite database
├── src/
│   ├── backend/
│   │   ├── app.py         # Main Flask application
│   │   ├── database/      # Database configuration
│   │   ├── models/        # SQLAlchemy models
│   │   ├── routes/        # API endpoints
│   │   └── services/      # Business logic
│   └── frontend/
│       └── src/
│           ├── index.html  # Main HTML file
│           ├── styles.css  # Styles
│           └── script.js   # Frontend logic
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/register`
  - Register a new user
  - Body: `{ "name": "string", "email": "string", "password": "string" }`

- `POST /api/auth/login`
  - Login existing user
  - Body: `{ "email": "string", "password": "string" }`

- `GET /api/auth/verify`
  - Verify JWT token
  - Header: `Authorization: Bearer <token>`

## Development

The application uses:
- Flask for the backend API
- SQLAlchemy for database operations
- JWT for authentication
- Simple HTML/CSS/JS for the frontend
