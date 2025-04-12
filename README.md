# Sync - Student Portal Application

Developed by Md, Zaid khan, Himadri Shekhar, Noor Alam, Sibtain Raza (team 404: not found)

A comprehensive academic management system built with Next.js and MySQL.

## Features

- User authentication with JWT
- Student dashboard with academic information
- Responsive design for desktop and mobile devices
- MySQL database integration
- Clean and intuitive navigation system
- Personalized student information display
- Password management functionality

## Prerequisites

- Node.js 18.x or higher
- MySQL Server installed and running locally

## MySQL Database Setup (Detailed)

1. **Install MySQL Server**
   - Windows: Download and install MySQL Server from the [official website](https://dev.mysql.com/downloads/mysql/)
   - Mac: `brew install mysql`
   - Linux (Ubuntu): `sudo apt install mysql-server`

2. **Start MySQL Service**
   - Windows: MySQL service should start automatically after installation
   - Mac: `brew services start mysql`
   - Linux: `sudo systemctl start mysql`

3. **Access MySQL**
   ```bash
   # Login with your root password (if you set one during installation)
   mysql -u root -p
   ```

4. **Create Database**
   ```sql
   # In the MySQL prompt, create the database
   CREATE DATABASE sync_db;
   
   # Verify the database was created
   SHOW DATABASES;
   
   # Exit MySQL
   EXIT;
   ```

5. **Database Schema**
   The application will automatically create the following table structure when you run the setup:
   ```sql
   CREATE TABLE IF NOT EXISTS users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     enrollment VARCHAR(10) UNIQUE NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     course VARCHAR(255) NOT NULL,
     rollNo VARCHAR(20) NOT NULL,
     startYear INT NOT NULL,
     endYear INT NOT NULL,
     batch VARCHAR(10) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   )
   ```

## Application Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sync.git
   cd sync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the project root with the following content:
   ```
   # MySQL Database Configuration
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_mysql_password  # Replace with your actual MySQL password
   MYSQL_DATABASE=sync_db
   
   # JWT Secret for authentication
   JWT_SECRET=your-secret-key-for-development-only-change-in-production
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Initialize the database**
   With the development server running, open your browser and navigate to:
   ```
   http://localhost:3000/api/setup
   ```
   You should see a JSON response indicating that the database setup was successful.

## Running the Application

1. Once the database is set up, visit the login page:
   ```
   http://localhost:3000/login
   ```

2. Use any of the following credentials to log in:

   | User ID      | Password     | User Name         | Course                       |
   |--------------|--------------|-------------------|------------------------------|
   | AJU/231350   | Himadri@123  | Himadri Shekhar   | Polytechnic Computer Science |
   | AJU/220269   | Zaid@123     | Zaid Khan         | Polytechnic Computer Science |
   | AJU/221722   | Sibtain@123  | Sibtain Raza      | Polytechnic Computer Science |
   
   

4. After successful login, you'll be redirected to the dashboard where you can see your academic information.

## Project Structure

```
sync/
├── app/                  # Next.js app router
│   ├── api/              # API routes
│   │   ├── login/        # Authentication API
│   │   └── setup/        # Database setup API
│   ├── components/       # UI components
│   │   ├── Hero/         # Dashboard hero section
│   │   └── NavBar/       # Navigation bar component
│   ├── lib/              # Utility functions
│   │   └── mysql.js      # MySQL database connection
│   ├── login/            # Login page
│   └── page.js           # Main dashboard page
├── public/               # Static assets
└── .env.local            # Environment variables (create this file manually)
```

## API Routes

1. **Login API**
   - **Endpoint**: `/api/login`
   - **Method**: POST
   - **Body**: `{ "userId": "AJU/231350", "password": "Himadri@123" }`
   - **Response**: JWT token and user data

2. **Setup API**
   - **Endpoint**: `/api/setup`
   - **Method**: GET
   - **Response**: Status of database initialization and user creation

3. **Change Password API**
   - **Endpoint**: `/api/change-password`
   - **Method**: POST
   - **Body**: `{ "userId": "AJU/231350", "currentPassword": "Himadri@123", "newPassword": "NewPassword123" }`
   - **Response**: Success or error message

## Troubleshooting MySQL Connection

1. **Connection Refused**
   - Ensure MySQL server is running
   - Verify the host and port in your .env.local file
   - Check if your MySQL user has proper permissions

2. **Access Denied**
   - Verify your MySQL username and password
   - Ensure the user has privileges for the sync_db database

3. **Database Not Found**
   - Make sure you've created the sync_db database
   - Check if the database name in .env.local matches the created database

4. **Reset Database**
   - If you need to reset the database, you can run these commands:
     ```sql
     DROP DATABASE IF EXISTS sync_db;
     CREATE DATABASE sync_db;
     ```
   - Then run the setup API again

## Tech Stack

- **Frontend**: Next.js, React
- **Backend**: Next.js API Routes
- **Database**: MySQL
- **Authentication**: JWT, bcryptjs
- **Styling**: CSS Modules

## 🚀 Project Status
Currently in development with basic authentication and dashboard functionality implemented.

## License

MIT

## 🚀 Project Status
Currently in development

## ✨ Features Built So Far

### Dashboard
- Modern, responsive hero section
- Clean and intuitive user interface
- Mobile-friendly design
- Gradient-based color scheme
- Interactive navigation with dropdown menus

## 🛠️ Tech Stack
- **Frontend:** Next.js
- **Styling:** Pure CSS with CSS Modules
- **Responsive Design:** Mobile-first approach
- **Layout:** Flexbox and Grid

## 🎨 Design Features
- Custom color variables for consistent theming
- Responsive typography
- Smooth hover effects
- Modern gradient backgrounds
- Flexible button components

## 📱 Responsive Breakpoints
- Desktop: 1200px and above
- Tablet: 768px to 1199px
- Mobile: Below 768px
- Small devices: Below 480px

## 🔜 Upcoming Features
- User Management
- Academic Performance Tracking
- Assignment Management
- Attendance Monitoring
- Comprehensive Reporting

## 📄 License
This project is intended for demonstration purposes.

---
Made with ❤️ by Team Sync

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
