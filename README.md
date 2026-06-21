<div align="center">

<img src="https://capsule-render.vercel.app/api?type=venom&color=0:6C63FF,50:48C774,100:00D4FF&height=220&section=header&text=Task%20Manager%20API&fontSize=52&fontColor=ffffff&fontAlignY=40&desc=⚡%20Express.js%20%2B%20MongoDB%20%2B%20RBAC&descAlignY=62&descSize=20&animation=fadeIn" width="100%"/>

<br/>

<!-- Fixed typing SVG — correct format from official docs -->
<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&duration=3000&pause=800&color=6C63FF&center=true&vCenter=true&width=650&lines=🔐+JWT+Auth+%2B+Role+Guards;👑+Super+Admin+→+Admin+→+Employee;🏗️+Scalable+Middleware+Factory+Pattern;🛡️+Production-Ready+Security;📦+Node.js+%2B+Express.js+%2B+MongoDB" alt="Typing SVG" />
</a>

<br/>

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=RomirBhardwaj.admin&color=6C63FF)
[![Stars](https://img.shields.io/github/stars/RomirBhardwaj/admin?style=flat&color=6C63FF&logo=github)](https://github.com/RomirBhardwaj/admin/stargazers)
[![Forks](https://img.shields.io/github/forks/RomirBhardwaj/admin?style=flat&color=48C774&logo=github)](https://github.com/RomirBhardwaj/admin/fork)
[![Issues](https://img.shields.io/github/issues/RomirBhardwaj/admin?style=flat&color=FF6B6B)](https://github.com/RomirBhardwaj/admin/issues)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com/RomirBhardwaj)

</div>

---

## 🧭 Table of Contents
[Overview](#-overview) • [Tech Stack](#-tech-stack) • [Role System](#-role-hierarchy) • [Architecture](#-architecture) • [API Routes](#-api-routes) • [Quick Start](#-quick-start) • [Examples](#-quick-examples) • [Roadmap](#-roadmap)

---

## 🌟 Overview

A pure backend REST API with a **three-tier Role-Based Access Control (RBAC)** system. Designed to be scalable from day one — adding new roles requires zero changes to existing routes.

```yaml
# project config — at a glance
name    : Admin Employee Task Manager
type    : REST API (Backend only)
stack   : Node.js + Express.js + MongoDB
auth    : JWT (7 day expiry)
roles   : [super-admin, admin, employee]
pattern : Single User Model + Middleware Factory
status  : ✅ Production Ready
```

---

## 🛠️ Tech Stack

<div align="center">

[![Skills](https://skillicons.dev/icons?i=nodejs,express,mongodb,javascript,git,vscode&theme=dark)](https://skillicons.dev)

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

---

## 🏗️ Architecture

```
📦 admin-employee
├── 📂 middleware/auth/
│   ├── 🔐 auth.js          ← Verifies JWT, attaches req.user
│   └── 🛡️  checkRole.js   ← Higher-order role guard factory
├── 📂 models/
│   ├── 👤 userModel.js     ← Single User model + role enum
│   └── ✅ taskModel.js     ← Task model + User refs + timestamps
├── 📂 routes/
│   └── 🛣️  userRoutes.js   ← All routes in one clean file
├── 🌱 seed.js              ← Super admin bootstrap (run once)
└── 🚀 server.js            ← Entry point
```

---

## 🔄 Request Lifecycle

```
📨 Incoming Request
        │
        ▼
  ┌───────────┐    ❌ Invalid Token
  │  auth.js  │──────────────────────► 401 Unauthorized
  └─────┬─────┘
        │ ✅ req.user attached
        ▼
  ┌──────────────────┐   ❌ Role not in allowed[]
  │ checkRole([...]) │──────────────────────────► 403 Forbidden
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

## 🗺️ Route × Role Matrix

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

```
    Admin Creates
         │
         ▼
  ┌─────────────┐
  │   PENDING   │ ← default on creation
  └──────┬──────┘
         │ employee updates
         ▼
  ┌──────────────┐
  │ IN-PROGRESS  │
  └──────┬───────┘
         │ employee updates
         ▼
  ┌────────────┐
  │ COMPLETED  │
  └────────────┘

  ⚠️  All updates BLOCKED if current date > dueDate
```

---

## 🚀 Quick Start

**1. Clone & Install**
```bash
git clone https://github.com/RomirBhardwaj/admin.git
cd admin && npm install
```

**2. Environment Setup**
```env
connection_string=your_mongodb_uri
SECRET_KEY=your_jwt_secret
```

**3. Seed Super Admin** *(run once only)*
```bash
node seed.js
```

**4. Start Server**
```bash
npm run dev     # development (nodemon)
npm start       # production
```
> 🌐 Runs at **http://localhost:3000**

---

## 💡 Quick Examples

<details>
<summary>🔐 Login</summary>

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "pass123"}'
```
</details>

<details>
<summary>✅ Create Task (Admin)</summary>

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
</details>

<details>
<summary>🔄 Update Status (Employee)</summary>

```bash
curl -X PUT http://localhost:3000/emp/updatetask/<taskId> \
  -H "Authorization: <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "in-progress"}'
```
</details>

---

## 🏆 GitHub Trophies

<div align="center">

[![trophy](https://github-profile-trophy.vercel.app/?username=RomirBhardwaj&theme=tokyonight&no-frame=true&row=1&column=6)](https://github.com/ryo-ma/github-profile-trophy)

</div>

---

## 📊 GitHub Stats

<div align="center">

<img src="https://github-readme-stats.vercel.app/api?username=RomirBhardwaj&show_icons=true&theme=tokyonight&hide_border=true&bg_color=0D1117&title_color=6C63FF&icon_color=48C774&text_color=ffffff" height="165"/>
<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=RomirBhardwaj&layout=compact&theme=tokyonight&hide_border=true&bg_color=0D1117&title_color=6C63FF&text_color=ffffff" height="165"/>

</div>

<div align="center">

<img src="https://github-readme-streak-stats.herokuapp.com/?user=RomirBhardwaj&theme=tokyonight&hide_border=true&background=0D1117&stroke=6C63FF&ring=6C63FF&fire=48C774&currStreakLabel=ffffff&sideLabels=ffffff&dates=888888" width="55%"/>

</div>

---

## 📈 Contribution Graph

<img src="https://github-readme-activity-graph.vercel.app/graph?username=RomirBhardwaj&theme=react-dark&bg_color=0D1117&color=6C63FF&line=48C774&point=00D4FF&area=true&hide_border=true" width="100%"/>

---

## 💬 Dev Quote of the Day

<div align="center">

[![Readme Quotes](https://quotes-github-readme.vercel.app/api?type=horizontal&theme=tokyonight)](https://github.com/piyushsuthar/github-readme-quotes)

</div>

---

## 🗺️ Roadmap

- [x] 🔐 JWT Authentication
- [x] 👑 Three-tier RBAC system
- [x] 🏗️ Middleware factory `checkRole()`
- [x] ✅ Full task CRUD with role guards
- [x] 🔒 bcrypt password hashing
- [x] 📚 MongoDB refs + populate()
- [ ] 📧 Invite-based admin registration via email
- [ ] 📄 Pagination & filtering on routes
- [ ] 🛡️ Input validation with Zod
- [ ] 🔁 Refresh token support
- [ ] 🧪 Unit & integration tests (Jest)
- [ ] 🚀 Deploy to Railway/Render

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00D4FF,50:48C774,100:6C63FF&height=130&section=footer&animation=fadeIn" width="100%"/>

**Built with ❤️ by [Romir Bhardwaj](https://github.com/RomirBhardwaj)**

*Drop a ⭐ if this helped you — it genuinely means a lot!*

</div>