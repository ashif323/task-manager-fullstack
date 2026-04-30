# 🚀 Task Manager Full Stack Application

A full-stack Task Management Web Application that allows users to create projects, assign tasks, track progress, and monitor productivity through a dashboard.

---

## 📌 Features

* 🔐 User Authentication (JWT-based)
* 📁 Project Management (Create, Delete, Manage Members)
* ✅ Task Management (Create, Update, Delete Tasks)
* 🔄 Task Status Tracking:

  * To Do
  * In Progress
  * Done
  * Overdue
* 📊 Dashboard Analytics (Real-time stats)
* 👥 Role-based Access (Admin/User)
* 🔍 Filter Tasks by Project & Status
* 📅 Due Date Tracking with Overdue Highlight

---

## 🛠️ Tech Stack

### Frontend

* React (Hooks: useState, useEffect)
* Axios
* CSS / Tailwind (if used)

### Backend

* Node.js
* Express.js
* MongoDB with Mongoose

### Database

* MongoDB Atlas

---

## 📂 Project Structure

```
project-root/
│
├── frontend/        # React Frontend
│   ├── src/
│   ├── public/
│
├── backend/         # Node + Express Backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│
├── .gitignore
├── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/YOUR_USERNAME/task-manager-fullstack.git
cd task-manager-fullstack
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run backend:

```
npm start
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🌐 API Endpoints (Backend)

### Auth

* POST `/api/auth/register`
* POST `/api/auth/login`

### Projects

* GET `/api/projects`
* POST `/api/projects`
* DELETE `/api/projects/:id`
* POST `/api/projects/:id/members`

### Tasks

* GET `/api/tasks`
* POST `/api/tasks`
* PATCH `/api/tasks/:id/status`
* DELETE `/api/tasks/:id`

### Dashboard

* GET `/api/tasks/stats/dashboard`

---

## 📊 Dashboard Logic

* **To Do:** Tasks not started
* **In Progress:** Tasks currently being worked on
* **Done:** Completed tasks
* **Overdue:** Tasks past due date and not completed

---

## 🔒 Authentication

* Uses JWT (JSON Web Tokens)
* Protected routes via middleware
* Role-based authorization (Admin/User)

---

## 🚀 Deployment

### Frontend:

Deployed on Vercel

### Backend:

Deployed on Render

### Database:

MongoDB Atlas

---

## 🧠 Learning Highlights

* Built REST APIs with Express
* Implemented MongoDB aggregation & filtering
* Managed state using React Hooks
* Implemented role-based authentication
* Handled real-world issues like CORS, API integration, and deployment

---

## 👨‍💻 Author

**Mohammad Ashif Iqbal**

* Data Science Student | Full Stack Developer
* Skilled in MERN Stack, SQL, Machine Learning

---

## ⭐ Contributing

Contributions are welcome! Feel free to fork and submit a PR.

---

## 📄 License

This project is open-source and available under the MIT License.
