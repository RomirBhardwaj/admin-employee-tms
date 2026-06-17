<div align="center">

# 🗂️ Admin Employee Task Manager

**A role-based task management REST API built with Express.js & MongoDB**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

</div>

---

## ⚡ Overview

Pure backend system with three-tier RBAC — Super Admin, Admin, and Employee. Each role has strictly scoped access to routes via a scalable middleware factory pattern.

---

## 🏗️ Architecture

```
├── middleware/
│   └── auth/
│       ├── auth.js         # Verifies JWT → attaches req.user
│       └── checkRole.js    # Higher-order role guard factory
├── models/
│   ├── userModel.js        # Single model, role enum
│   └── taskModel.js        # Task with User refs
├── routes/
│   └── userRoutes.js       # All routes, single file
├── seed.js                 # Super admin bootstrap (run once)
└── server.js               # Entry point
```

---

## 🔐 Role System

| Role | How Created | Powers |
|------|-------------|--------|
| `super-admin` | Seed script (once) | Create admins, view all users |
| `admin` | By super-admin only | Full task CRUD, view employees |
| `employee` | Open signup | View & update own task status |

---

## 🛣️ API Routes

### Auth & Users
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `POST` | `/login` | Public | Login — returns JWT |
| `POST` | `/emp/signup` | Public | Employee registration |
| `POST` | `/admin/createadmin` | Super Admin | Create an admin |
| `GET` | `/details` | All | Own profile |
| `PUT` | `/update` | Admin, Employee | Update own details |
| `GET` | `/admins` | Super Admin, Admin | List all admins |
| `GET` | `/employees` | Super Admin, Admin | List all employees |

### Tasks
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `POST` | `/admin/createtask` | Admin | Create & assign task |
| `PUT` | `/admin/updatetask/:id` | Admin | Update own task |
| `DELETE` | `/admin/deletetask/:id` | Admin | Delete task |
| `GET` | `/admin/tasks` | Admin | View tasks I assigned |
| `GET` | `/emp/tasks` | Employee | View my assigned tasks |
| `PUT` | `/emp/updatetask/:id` | Employee | Update task status |

> **Status flow:** `pending` → `in-progress` → `completed`
> Updates blocked after due date.

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/RomirBhardwaj/admin.git
cd admin
npm install
```

### 2. Environment Setup
```bash
# create .env file with:
connection_string=your_mongodb_uri
SECRET_KEY=your_jwt_secret
```

### 3. Seed Super Admin
```bash
node seed.js   # run once only
```

### 4. Start Server
```bash
npm run dev    # development
npm start      # production
```

---

## 🔑 Authentication

Send JWT token in every protected request header:
```
Authorization: <your_token_here>
```
Token expires in **7 days**.

---

## 📦 Stack

| Package | Purpose |
|---------|---------|
| `express` | HTTP server & routing |
| `mongoose` | MongoDB ODM |
| `jsonwebtoken` | JWT auth |
| `bcrypt` | Password hashing |
| `dotenv` | Environment config |
| `nodemon` | Dev auto-restart |

---

<div align="center">
  <sub>Built by <a href="https://github.com/RomirBhardwaj">Romir Bhardwaj</a></sub>
</div>