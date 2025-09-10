# Chirpy - Social Media Web Server

A Twitter-like social media application built with Node.js, Express, TypeScript, and PostgreSQL. Users can register, authenticate, and post short messages called "chirps" with built-in content moderation.

## 🚀 Features

- **User Management**: User registration and authentication with secure password hashing
- **Authentication**: JWT-based authentication with Bearer token support
- **Chirp System**: Post and retrieve short messages (140 character limit)
- **Content Moderation**: Automatic profanity filtering for inappropriate content
- **Database Migrations**: Automated database schema management with Drizzle ORM
- **Admin Tools**: Server metrics and reset functionality
- **Static Frontend**: Basic HTML interface served at `/app`

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with automatic migrations
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt for password hashing
- **Environment**: dotenv for configuration management

## 📊 Database Schema

### Users Table
- `id`: UUID (Primary Key)
- `email`: Unique email address
- `hashed_password`: Securely hashed password
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Chirps Table
- `id`: UUID (Primary Key)
- `body`: Message content (max 141 characters)
- `userId`: Foreign key to users table
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Refresh Tokens Table
- `token`: Primary key string
- `userId`: Foreign key to users table
- `expires_at`: Token expiration timestamp
- `revoked_at`: Token revocation timestamp
- `created_at`: Timestamp
- `updated_at`: Timestamp

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd web-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DB_URL=postgresql://username:password@localhost:5432/chirpy_db
   JWT=your-super-secret-jwt-key-change-this-in-production
   PLATFORM=development
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb chirpy_db
   
   # Run migrations (handled automatically on server start)
   npm run migrate
   ```

5. **Build the project**
   ```bash
   npm run build
   ```

6. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-rebuild:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:8081`

## 🔧 Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server
- `npm run dev` - Build and start development server
- `npm run generate` - Generate new database migrations
- `npm run migrate` - Apply database migrations
- `npm test` - Run test suite


## 🚦 Content Moderation

The application includes built-in content moderation that:
- Enforces a 140-character limit on chirps
- Filters out profane words (configurable list)
- Replaces inappropriate content with "****"
- Validates chirp content before posting

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DB_URL` | PostgreSQL connection string | Yes | - |
| `JWT` | Secret key for JWT signing | Yes | - |
| `PLATFORM` | Platform identifier | No | - |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

ISC License

## 🔗 Links

- Repository: [GitHub](https://github.com/GautamUpadhyayShorthillsAI/web-server)
- Issues: [GitHub Issues](https://github.com/GautamUpadhyayShorthillsAI/web-server/issues)

---

**Note**: This is a development server. For production deployment, ensure you use secure environment variables, enable HTTPS, and implement proper rate limiting and monitoring.