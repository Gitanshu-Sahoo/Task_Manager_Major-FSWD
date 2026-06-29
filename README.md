# Task_Manager_Major-FSWD
Made by Gitanshu Sahoo, UID: WD-FSWD-A4/May-10208

Task Manager using Sticky Notes UI:

1. Project Description

Task Manager with Sticky Notes UI is a full-stack web application that helps users organize and manage their daily tasks using an interactive sticky notes interface. The application allows users to register, log in securely, and manage their personal tasks with features such as adding, editing, deleting, and marking tasks as completed. Users can also assign priorities, set due dates, search tasks, filter tasks, and sort them based on different criteria. A dashboard displays task statistics, including total, completed, pending, and overdue tasks. The application uses JWT authentication to ensure that every user can access only their own tasks.

2. Tech Stack

Frontend: React.js, Vite, Axios, CSS3
Backend: Node.js, Express.js
Database: MongoDB Atlas with Mongoose
Authentication: JSON Web Token (JWT), bcrypt.js
Deployment: Vercel (Frontend), Render (Backend)
Version Control: Git and GitHub

3. Setup Instructions

1. Clone the repository using Git.
2. Install dependencies in both the Frontend and Backend folders using "npm install".
3. Create a ".env" file in the Backend folder and configure the required environment variables such as "MONGO_URI", "JWT_SECRET", and "PORT".
4. Start the backend server using "npm start" or "npm run dev".
5. Open another terminal, navigate to the Frontend folder, and run "npm install" followed by "npm run dev".
6. Open the displayed localhost URL in a browser to access the application.

4. API Documentation

- POST /api/auth/register – Register a new user.
- POST /api/auth/login – Authenticate a user and return a JWT token.
- GET /api/tasks – Retrieve all tasks of the logged-in user.
- POST /api/tasks – Create a new task.
- PUT /api/tasks/:id – Update an existing task.
- DELETE /api/tasks/:id – Delete a task.
- DELETE /api/tasks/completed – Remove all completed tasks.
