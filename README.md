<div align="center">

<img src="https://capsule-render.vercel.app/api?type=venom&color=0:6C63FF,50:48C774,100:00D4FF&height=220&section=header&text=Task%20Manager%20API&fontSize=52&fontColor=ffffff&fontAlignY=40&desc=⚡%20Express.js%20%2B%20MongoDB%20%2B%20RBAC&descAlignY=62&descSize=20&animation=fadeIn&stroke=ffffff&strokeWidth=1" width="100%"/>

<br/>

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&duration=3000&pause=800&color=6C63FF&center=true&vCenter=true&multiline=false&width=650&lines=🔐+JWT+Authentication+%2B+Role+Guards;👑+Super+Admin+→+Admin+→+Employee;🏗️+Scalable+Middleware+Factory+Pattern;🛡️+Production-Ready+Security+Architecture;📦+Built+with+Node.js+%2B+Express+%2B+MongoDB" alt="Typing SVG" />
</a>

<br/>

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=RomirBhardwaj.admin&color=6C63FF)
[![GitHub stars](https://img.shields.io/github/stars/RomirBhardwaj/admin?style=flat&color=6C63FF&logo=github)](https://github.com/RomirBhardwaj/admin/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/RomirBhardwaj/admin?style=flat&color=48C774&logo=github)](https://github.com/RomirBhardwaj/admin/fork)
[![GitHub issues](https://img.shields.io/github/issues/RomirBhardwaj/admin?style=flat&color=FF6B6B&logo=github)](https://github.com/RomirBhardwaj/admin/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## 🧭 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Role Hierarchy](#-role-hierarchy)
- [Architecture](#-architecture)
- [Request Lifecycle](#-request-lifecycle)
- [API Routes](#-api-routes)
- [Quick Start](#-quick-start)
- [Code Examples](#-quick-examples)
- [Roadmap](#-roadmap)

---

## 🌟 Overview

A pure backend REST API with a **three-tier Role-Based Access Control (RBAC)** system. Designed to be scalable from day one — adding new roles requires zero changes to existing routes.

```
No if/else role chains.   No duplicate models.   No spaghetti middleware.
One model. One route file. One middleware factory. That's it.
```

---

## 🛠️ Tech Stack

<div align="center">

[![My Skills](https://skillicons.dev/icons?i=nodejs,express,mongodb,js&theme=dark)](https://skillicons.dev)

</div>

<div align="center">

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | v5.x | HTTP server & routing |
| `mongoose` | v9.x | MongoDB ODM |
| `jsonwebtoken` | v9.x | JWT auth tokens |
| `bcrypt` | v6.x | Password hashing |
| `dotenv` | v17.x | Environment config |
| `nodemon` | v3.x | Dev auto-restart |

</div>

---

## 🔐 Role Hierarchy

<div align="center">

```
          ┌─────────────────────────────────┐
          │         👑 SUPER ADMIN          │
          │   Created via seed script once   │
          │   Creates & manages all admins   │
          └────────────────┬────────────────┘
                           │ creates
          ┌────────────────▼────────────────┐
          │           🧑‍💼 ADMIN              │
          │    Full task CRUD (own tasks)    │
          │    Views all employees           │
          └────────────────┬────────────────┘
                           │ assigns tasks to
          ┌────────────────▼────────────────┐
          │          👷 EMPLOYEE            │
          │   Views own assigned tasks      │
          │   Updates status (before due)   │
          └─────────────────────────────────┘
```

</div>

---

## 🏗️ Architecture

```
📦 admin-employee
├── 📂 middleware/
│   └── 📂 auth/
│       ├── 🔐 auth.js          # Verifies JWT → attaches req.user
│       └── 🛡️  checkRole.js   # Higher-order role guard factory
├── 📂 models/
│   ├── 👤 userModel.js         # Single User model, role enum
│   └── ✅ taskModel.js         # Task model + User refs + timestamps
├── 📂 routes/
│   └── 🛣️  userRoutes.js       # All routes — one clean file
├── 🌱 seed.js                  # Super admin bootstrap (run once)
└── 🚀 server.js                # Entry point
```

---

## 🔄 Request Lifecycle

```
   📨 Request
       │
       ▼
 ┌───────────┐   ❌ No/Invalid Token
 │  auth.js  │──────────────────────────► 401 Unauthorized
 │ JWT Guard │
 └─────┬─────┘
       │ ✅ req.user attached
       ▼
 ┌──────────────────┐   ❌ Role not in allowed[]
 │ checkRole([ ])   │──────────────────────────► 403 Forbidden
 │ Factory Guard    │
 └────────┬─────────┘
          │ ✅ Role matched
          ▼
    Route Handler
          │
          ▼
    MongoDB Query
          │
          ▼
   📤 JSON Response
```

---

## 🗺️ Route × Role Access Matrix

<div align="center">

| Route | 👑 Super Admin | 🧑‍💼 Admin | 👷 Employee |
|-------|:--------------:|:---------:|:-----------:|
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

</div>

---

## 🔁 Task Status Lifecycle

<div align="center">

```
         Admin Creates
              │
              ▼
       ┌─────────────┐
       │   PENDING   │ ◄── default on creation
       └──────┬──────┘
              │ Employee updates
              ▼
      ┌───────────────┐
      │  IN-PROGRESS  │
      └──────┬────────┘
             │ Employee updates
             ▼
       ┌───────────┐
       │ COMPLETED │
       └───────────┘
             │
             ⚠️  BLOCKED if current date > dueDate
```

</div>

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/RomirBhardwaj/admin.git
cd admin
npm install
```

### 2. Environment Setup
```bash
# Create .env file
touch .env
```
```env
connection_string=your_mongodb_uri
SECRET_KEY=your_jwt_secret
```

### 3. Seed Super Admin *(run once only)*
```bash
node seed.js
```

### 4. Start Server
```bash
npm run dev     # 🔥 development
npm start       # 🚀 production
```
> Server starts at **http://localhost:3000**

---

## 💡 Quick Examples

### Login
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "pass123"}'
```

### Create Task *(Admin)*
```bash
curl -X POST http://localhost:3000/admin/createtask \
  -H "Authorization: <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "task": "Fix login bug",
    "description": "500 error on wrong password",
    "assignedTo": "<employee_id>",
    "dueDate": "2026-08-18"
  }'
```

### Update Status *(Employee)*
```bash
curl -X PUT http://localhost:3000/emp/updatetask/<taskId> \
  -H "Authorization: <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "in-progress"}'
```

---

## 🗺️ Roadmap

- [x] 🔐 JWT Authentication
- [x] 👑 Three-tier RBAC system
- [x] 🏗️ Middleware factory pattern
- [x] ✅ Task CRUD with role guards
- [x] 🔒 Password hashing with bcrypt
- [ ] 📧 Invite-based admin registration
- [ ] 📄 Pagination & filtering on routes
- [ ] 🛡️ Input validation with Zod
- [ ] 🔁 Refresh token support
- [ ] 🧪 Unit & integration tests (Jest)
- [ ] 🚀 Deployment (Railway/Render)

---

<img src="https://github-readme-activity-graph.vercel.app/graph?username=RomirBhardwaj&theme=react-dark&bg_color=0D1117&color=6C63FF&line=48C774&point=00D4FF&area=true&hide_border=true" width="100%"/>

---

<div align="center">

<img src="https://github-readme-stats.vercel.app/api?username=RomirBhardwaj&show_icons=true&theme=tokyonight&hide_border=true&bg_color=0D1117&title_color=6C63FF&icon_color=48C774&text_color=ffffff" height="165"/>
<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=RomirBhardwaj&layout=compact&theme=tokyonight&hide_border=true&bg_color=0D1117&title_color=6C63FF&text_color=ffffff" height="165"/>

</div>

<div align="center">

<img src="https://github-readme-streak-stats.herokuapp.com/?user=RomirBhardwaj&theme=tokyonight&hide_border=true&background=0D1117&stroke=6C63FF&ring=6C63FF&fire=48C774&currStreakLabel=ffffff&sideLabels=ffffff&dates=888888" width="60%"/>

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00D4FF,50:48C774,100:6C63FF&height=130&section=footer&animation=fadeIn&fontColor=ffffff" width="100%"/>

**Built with ❤️ by [Romir Bhardwaj](https://github.com/RomirBhardwaj)**

*If this helped you, drop a ⭐ — it means a lot!*

</div>