<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6C63FF,100:48C774&height=200&section=header&text=Task%20Manager%20API&fontSize=48&fontColor=ffffff&fontAlignY=38&desc=Role-Based%20Task%20Management%20System&descAlignY=58&descSize=18&animation=fadeIn" width="100%"/>

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=500&size=22&pause=1000&color=6C63FF&center=true&vCenter=true&width=600&lines=Express.js+%2B+MongoDB+Backend;Role-Based+Access+Control+(RBAC);JWT+Authentication+%F0%9F%94%90;Scalable+Middleware+Architecture" alt="Typing SVG" />
</a>

<br/>

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-FF6C37?style=for-the-badge&logo=npm&logoColor=white)

[![GitHub stars](https://img.shields.io/github/stars/RomirBhardwaj/admin?style=social)](https://github.com/RomirBhardwaj/admin)
[![GitHub forks](https://img.shields.io/github/forks/RomirBhardwaj/admin?style=social)](https://github.com/RomirBhardwaj/admin/fork)

</div>

---

## ⚡ Overview

A pure backend REST API built with **Express.js** and **MongoDB** featuring a three-tier Role-Based Access Control (RBAC) system. Each role has strictly scoped access via a scalable middleware factory pattern — no duplicate logic, no spaghetti conditionals.

---

## 🏗️ Architecture

```
romirbhardwaj-admin/
├── 📂 middleware/
│   └── 📂 auth/
│       ├── 🔐 auth.js         # Verifies JWT → attaches req.user
│       └── 🛡️  checkRole.js   # Higher-order role guard factory
├── 📂 models/
│   ├── 👤 userModel.js        # Single model, role enum
│   └── ✅ taskModel.js        # Task with User refs + timestamps
├── 📂 routes/
│   └── 🛣️  userRoutes.js      # All routes, single file
├── 🌱 seed.js                 # Super admin bootstrap (run once)
└── 🚀 server.js               # Entry point
```

---

## 🔐 Role Hierarchy

```
👑 SUPER ADMIN
├── Created via seed script (once only)
├── Creates and manages admins
└── Views all users

🧑‍💼 ADMIN
├── Created by Super Admin only
├── Full task CRUD (own tasks only)
└── Views all employees

👷 EMPLOYEE
├── Open self-registration
├── Views own assigned tasks only
└── Updates task status (blocked after due date)
```

---

## 🔄 Request Lifecycle

```
Incoming Request
      │
      ▼
┌─────────────┐     ❌ invalid token
│   auth.js   │──────────────────────► 401 Unauthorized
│ verify JWT  │
└──────┬──────┘
       │ ✅ attaches req.user
       ▼
┌──────────────────┐   ❌ role not allowed
│  checkRole([ ])  │────────────────────► 403 Forbidden
│  factory guard   │
└────────┬─────────┘
         │ ✅ role matches
         ▼
    Route Handler
         │
         ▼
    MongoDB Query
         │
         ▼
    JSON Response
```

---

## 🗺️ Role × Route Access Matrix

| Route | Super Admin | Admin | Employee |
|-------|:-----------:|:-----:|:--------:|
| `POST /login` | ✅ | ✅ | ✅ |
| `POST /emp/signup` | ✅ | ✅ | ✅ |
| `POST /admin/createadmin` | ✅ | ❌ | ❌ |
| `GET /details` | ✅ | ✅ | ✅ |
| `PUT /update` | ❌ | ✅ | ✅ |
| `GET /admins` | ✅ | ✅ | ❌ |
| `GET /employees` | ✅ | ✅ | ❌ |
| `POST /admin/createtask` | ❌ | ✅ | ❌ |
| `PUT /admin/updatetask/:id` | ❌ | ✅ | ❌ |
| `DELETE /admin/deletetask/:id` | ❌ | ✅ | ❌ |
| `GET /admin/tasks` | ❌ | ✅ | ❌ |
| `GET /emp/tasks` | ❌ | ❌ | ✅ |
| `PUT /emp/updatetask/:id` | ❌ | ❌ | ✅ |

---

## 🔁 Task Status Lifecycle

```
  ┌─────────┐       ┌─────────────┐       ┌───────────┐
  │ PENDING │──────►│ IN-PROGRESS │──────►│ COMPLETED │
  └─────────┘       └─────────────┘       └───────────┘
  (on create)        (by employee)         (by employee)
                                                │
                              🚫 blocked if due date passed
```

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/RomirBhardwaj/admin.git
cd admin && npm install
```

### 2. Environment Setup
```env
connection_string=your_mongodb_uri
SECRET_KEY=your_jwt_secret
```

### 3. Seed Super Admin
```bash
node seed.js    # run once only
```

### 4. Start Server
```bash
npm run dev     # development (nodemon)
npm start       # production
```
> Server runs on `http://localhost:3000`

---

## 📡 API Reference

### Auth & Users
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `POST` | `/login` | Public | Login — returns JWT |
| `POST` | `/emp/signup` | Public | Employee registration |
| `POST` | `/admin/createadmin` | Super Admin | Create an admin |
| `GET` | `/details` | All | View own profile |
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
| `GET` | `/emp/tasks` | Employee | View my tasks |
| `PUT` | `/emp/updatetask/:id` | Employee | Update task status |

---

## 🔑 Authentication

Send JWT token in every protected request:
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
> Token expires in **7 days**

---

## 💡 Quick Examples

### Login
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"pass123"}'
```

### Create Task
```bash
curl -X POST http://localhost:3000/admin/createtask \
  -H "Authorization: <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"task":"Fix bug","assignedTo":"<empId>","dueDate":"2026-08-18"}'
```

### Update Status
```bash
curl -X PUT http://localhost:3000/emp/updatetask/<taskId> \
  -H "Authorization: <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"status":"in-progress"}'
```

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `express` | HTTP server & routing |
| `mongoose` | MongoDB ODM |
| `jsonwebtoken` | JWT auth |
| `bcrypt` | Password hashing |
| `dotenv` | Environment config |
| `nodemon` | Dev auto-restart |

---

## 🗺️ Roadmap

- [ ] 📧 Invite-based admin registration via email
- [ ] 📄 Pagination & filtering on task routes
- [ ] 🛡️ Input validation with Joi/Zod
- [ ] 🔁 Refresh token support
- [ ] 📊 Admin dashboard stats endpoint
- [ ] 🧪 Unit & integration tests with Jest

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:48C774,100:6C63FF&height=120&section=footer&animation=fadeIn" width="100%"/>

**Built with 🔥 by [Romir Bhardwaj](https://github.com/RomirBhardwaj)**

</div>

