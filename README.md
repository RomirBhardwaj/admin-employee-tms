<div align="center">

<img src="https://capsule-render.vercel.app/api?type=venom&color=0:6C63FF,50:48C774,100:00D4FF&height=220&section=header&text=Task%20Manager%20API&fontSize=52&fontColor=ffffff&fontAlignY=40&desc=⚡%20Express.js%20%2B%20MongoDB%20%2B%20RBAC&descAlignY=62&descSize=20&animation=fadeIn" width="100%"/>

<br/>

<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&duration=3000&pause=800&color=1BBDFF&center=true&vCenter=true&width=650&lines=%F0%9F%94%90+JWT+Auth+%2B+Role+Based+Access+Control;%F0%9F%91%91+Super+Admin+%E2%86%92+Admin+%E2%86%92+Employee+Hierarchy;Quick+fo%F0%9F%93%A6+Node.js+%2B+Express.js+%2B+MongoDB" alt="Typing SVG" /></a>

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
[Overview](#-overview) • [Tech Stack](#-tech-stack) • [Role System](#-role-hierarchy) • [Architecture](#-architecture) • [API Routes](#-api-routes) • [Quick Start](#-quick-start) 

---

## 🌟 Overview

A pure backend REST API with a **three-tier Role-Based Access Control (RBAC)** system and **parent-child user hierarchy**. Every user is connected to their parent — admins belong to a super-admin, employees belong to an admin. This ensures admins can only manage their own employees and assign tasks within their team.

```yaml
# project config — at a glance
name      : Admin Employee Task Manager
type      : REST API (Backend only)
stack     : Node.js + Express.js + MongoDB
auth      : JWT (7 day expiry)
roles     : [super-admin, admin, employee]
hierarchy : parentId field links users to their parent
pattern   : Single User Model + Middlewares + Route Splitting
status    : Improving day by day 📈
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
         ┌──────────────────────────────────────┐
     │         👑 SUPER ADMIN               │
     │   parentId: null                     │
     │   Created via seed script (once)     │
     │   Creates & manages all admins       │
     └──────────┬───────────────┬───────────┘
                │               │
     ┌──────────▼───┐     ┌─────▼────────┐
     │  🧑💼 ADMIN A  │     │  🧑💼 ADMIN B  │
     │ parentId:    │     │ parentId:    │
     │ super-admin  │     │ super-admin  │
     │ Creates &    │     │ Creates &    │
     │ assigns tasks│     │ assigns tasks│
     └──┬───────┬───┘     └──┬───────────┘
        │       │             │
   ┌────▼──┐ ┌──▼────┐  ┌────▼──┐
   │ 👷 E1 │ │ 👷 E2 │  │ 👷 E3 │
   │parent:│ │parent:│  │parent:│
   │AdminA │ │AdminA │  │AdminB │
   └───────┘ └───────┘  └───────┘
```

> Each admin can **only** assign tasks to their own employees. Cross-team assignment is blocked.

---

## 🏗️ Architecture

```
📦 admin-employee
├── 📂 middleware/
│   ├── 📂 auth/
│   │   ├── 🔐 auth.js           ← Verifies JWT, attaches req.user + parentId
│   │   └── 🛡️  checkRole.js    ← Higher-order role guard factory
│   └── 📂 error/
│       ├── ⚠️  errorHandler.js  ← Centralized error handling middleware
│       └── 💥 apiError.js       ← Custom error class
├── 📂 models/
│   ├── 👤 userModel.js          ← Single User model + role + parentId
│   └── ✅ taskModel.js          ← Task model + User refs + timestamps
├── 📂 routes/
│   ├── 🌐 commonRoutes.js       ← /login, /details, /update
│   ├── 👑 adminRoutes.js        ← All /admin/* routes
│   └── 👷 empRoutes.js          ← All /emp/* routes
├── 🌱 seed.js                   ← Super admin bootstrap (run once)
└── 🚀 server.js                 ← Entry point + route mounting
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
        │ ✅ req.user attached (with parentId)
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
| `GET /details` | ✅ | ✅ | ✅ |
| `PUT /update` | ❌ | ✅ | ✅ |
| `POST /admin/createadmin` | ✅ | ❌ | ❌ |
| `POST /admin/createtask` | ❌ | ✅ | ❌ |
| `PUT /admin/updatetask/:id` | ❌ | ✅ | ❌ |
| `DELETE /admin/deletetask/:id` | ❌ | ✅ | ❌ |
| `GET /admin/tasks` | ❌ | ✅ | ❌ |
| `GET /admin/admins` | ✅ | ✅ | ❌ |
| `GET /admin/employees` | ✅ | ✅ | ❌ |
| `POST /emp/signup` | ✅ | ✅ | ✅ |
| `GET /emp/tasks` | ❌ | ❌ | ✅ |
| `PUT /emp/updatetask/:id` | ❌ | ❌ | ✅ |

</div>

---

## 🔁 Task Status Lifecycle

```
    Admin Creates (assigns to own employee only)
              │
              ▼
       ┌─────────────┐
       │   PENDING   │ ← default on creation
       └──────┬──────┘
              │ employee updates
              ▼
      ┌───────────────┐
      │  IN-PROGRESS  │
      └──────┬────────┘
             │ employee updates
             ▼
       ┌───────────┐
       │ COMPLETED │
       └───────────┘

  ⚠️  Blocked if current date > dueDate
  ⚠️  Admin can only assign to their own employees
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
<!-- 
## 💡 Quick Examples

<details>
<summary>🔐 Login (all roles)</summary>

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "pass123"}'
```
</details>

<details>
<summary>👑 Create Admin (super-admin only)</summary>

```bash
curl -X POST http://localhost:3000/admin/createadmin \
  -H "Authorization: <super_admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin One",
    "email": "admin@example.com",
    "password": "pass123",
    "parentId": "<super_admin_id>"
  }'
```
</details>

<details>
<summary>👷 Employee Signup (requires admin parentId)</summary>

```bash
curl -X POST http://localhost:3000/emp/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "pass123",
    "parentId": "<admin_id>"
  }'
```
</details>

<details>
<summary>✅ Create Task (admin — own employees only)</summary>

```bash
curl -X POST http://localhost:3000/admin/createtask \
  -H "Authorization: <admin_token>" \
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
<summary>🔄 Update Status (employee)</summary>

```bash
curl -X PUT http://localhost:3000/emp/updatetask/<taskId> \
  -H "Authorization: <employee_token>" \
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

## 💬 Dev Quote

<div align="center">

[![Readme Quotes](https://quotes-github-readme.vercel.app/api?type=horizontal&theme=tokyonight)](https://github.com/piyushsuthar/github-readme-quotes)

</div>

---

## 🗺️ Roadmap

- [x] 🔐 JWT Authentication
- [x] 👑 Three-tier RBAC system
- [x] 🏗️ Middleware factory `checkRole()`
- [x] 🔗 Parent-child user hierarchy via `parentId`
- [x] ✅ Admin can only assign tasks to own employees
- [x] 🗂️ Route splitting — adminRoutes, empRoutes, commonRoutes
- [x] 🔒 bcrypt password hashing
- [x] 📚 MongoDB refs + populate()
- [ ] 📧 Invite-based admin registration via email
- [ ] 📄 Pagination & filtering on routes
- [ ] 🛡️ Input validation with Zod
- [ ] 🔁 Refresh token support
- [ ] 🧪 Unit & integration tests (Jest)
- [ ] 🚀 Deploy to Railway/Render -->

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00D4FF,50:48C774,100:6C63FF&height=130&section=footer&animation=fadeIn" width="100%"/>

**Built with ❤️ by [Romir Bhardwaj](https://github.com/RomirBhardwaj)**

*Drop a ⭐ if this helped you — it genuinely means a lot!*

</div>
