# 🚀 ERP BACKEND - COMPLETE API DOCUMENTATION

## 📦 COLLECTIONS (5 TOTAL)

1. **users** - Admin + Employee (role-based)
2. **tasks** - Task management
3. **payroll** - Salary management
4. **inventory** - Stock management
5. **inventory_logs** - Item issue/return tracking

---

## 🔐 AUTHENTICATION ENDPOINTS

### 1. Register User
```
POST /auth/register
Body: { name, email, password }
```

### 2. Login
```
POST /auth/login
Body: { email, password }
Response: { token, user }
```

### 3. Get Profile
```
GET /auth/profile
Headers: Authorization: Bearer <token>
```

---

## 👥 USER MANAGEMENT (Admin Only)

### 1. Create User
```
POST /users
Headers: Authorization: Bearer <token>
Body: { name, email, password, role, salary }
Roles: ADMIN | HR | MANAGER | EMPLOYEE | INVENTORY
Access: ADMIN only
```

### 2. Get All Users
```
GET /users
Headers: Authorization: Bearer <token>
Access: All authenticated users
```

### 3. Get User by ID
```
GET /users/:id
Headers: Authorization: Bearer <token>
```

### 4. Update User
```
PUT /users/:id
Headers: Authorization: Bearer <token>
Body: { name, role, salary, status }
Access: ADMIN only
```

### 5. Delete User
```
DELETE /users/:id
Headers: Authorization: Bearer <token>
Access: ADMIN only
```

---

## 📋 TASK MANAGEMENT

### 1. Create Task
```
POST /tasks
Headers: Authorization: Bearer <token>
Body: { title, description, assignedTo, deadline }
Access: ADMIN, MANAGER
```

### 2. Get All Tasks
```
GET /tasks
Headers: Authorization: Bearer <token>
Access: All authenticated users
```

### 3. Get My Tasks
```
GET /tasks/my-tasks
Headers: Authorization: Bearer <token>
Access: All authenticated users
```

### 4. Update Task Status
```
PUT /tasks/:id
Headers: Authorization: Bearer <token>
Body: { status: "PENDING" | "DONE" | "LATE" }
Access: All authenticated users
Note: Auto-marks LATE if completed after deadline
```

### 5. Delete Task
```
DELETE /tasks/:id
Headers: Authorization: Bearer <token>
Access: ADMIN, MANAGER
```

---

## 💰 PAYROLL MANAGEMENT

### 1. Generate Payroll
```
POST /payroll
Headers: Authorization: Bearer <token>
Body: { userId, month, bonus }
Access: ADMIN, HR
Note: Auto-calculates deduction based on late tasks (500 per late task)
```

### 2. Get All Payrolls
```
GET /payroll
Headers: Authorization: Bearer <token>
Access: ADMIN, HR
```

### 3. Get My Payroll
```
GET /payroll/my-payroll
Headers: Authorization: Bearer <token>
Access: All authenticated users
```

### 4. Get Payroll by ID
```
GET /payroll/:id
Headers: Authorization: Bearer <token>
```

---

## 📦 INVENTORY MANAGEMENT

### 1. Add Item
```
POST /inventory
Headers: Authorization: Bearer <token>
Body: { itemName, quantity }
Access: ADMIN, INVENTORY
```

### 2. Get All Items
```
GET /inventory
Headers: Authorization: Bearer <token>
Access: All authenticated users
```

### 3. Update Item
```
PUT /inventory/:id
Headers: Authorization: Bearer <token>
Body: { quantity }
Access: ADMIN, INVENTORY
```

### 4. Issue Item
```
POST /inventory/issue
Headers: Authorization: Bearer <token>
Body: { itemId, userId, quantity }
Access: ADMIN, INVENTORY
Note: Creates log + reduces stock
```

### 5. Return Item
```
POST /inventory/return
Headers: Authorization: Bearer <token>
Body: { itemId, userId, quantity }
Access: ADMIN, INVENTORY
Note: Creates log + increases stock
```

### 6. Get All Logs
```
GET /inventory/logs
Headers: Authorization: Bearer <token>
Access: All authenticated users
```

### 7. Get My Logs
```
GET /inventory/my-logs
Headers: Authorization: Bearer <token>
Access: All authenticated users
```

---

## 🔥 COMPLETE FLOW

### 1️⃣ Admin Setup
```
1. Admin registers/logs in
2. Admin creates users with roles (EMPLOYEE, MANAGER, HR, INVENTORY)
3. Admin sets salary for each user
```

### 2️⃣ Task Assignment
```
1. ADMIN/MANAGER creates task
2. Assigns to EMPLOYEE with deadline
3. EMPLOYEE completes task
4. If late → status = LATE (affects salary)
```

### 3️⃣ Payroll Generation
```
1. HR/ADMIN generates payroll for month
2. System checks late tasks
3. Deduction = lateTasks × 500
4. finalSalary = salary + bonus - deduction
5. Employee views payroll slip
```

### 4️⃣ Inventory Management
```
1. ADMIN/INVENTORY adds items
2. Issues item to employee (creates log)
3. Employee returns item (creates log)
4. All logs are permanent (no delete)
```

---

## 🎯 ROLE-BASED ACCESS

| Role | Permissions |
|------|------------|
| **ADMIN** | Full access - create users, assign roles, manage everything |
| **HR** | Generate payroll, view all payrolls |
| **MANAGER** | Create tasks, assign tasks, view all tasks |
| **EMPLOYEE** | View own tasks, complete tasks, view own payroll |
| **INVENTORY** | Add items, issue/return items, manage stock |

---

## 🛡️ BUSINESS RULES

1. ✅ One user = everything (role decides power)
2. ✅ Late task = salary deduction (500 per task)
3. ✅ Inventory logs cannot be deleted
4. ✅ Task auto-marked LATE if completed after deadline
5. ✅ Only ACTIVE users can access system
6. ✅ Payroll unique per user per month

---

## 🚀 SETUP & RUN

```bash
# Install dependencies
npm install

# Setup .env file
PORT=4001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173

# Run server
npm start
```

---

## 📊 DATABASE SCHEMA

### users
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ADMIN | HR | MANAGER | EMPLOYEE | INVENTORY,
  salary: Number,
  status: ACTIVE | INACTIVE,
  lastLogin: Date
}
```

### tasks
```javascript
{
  title: String,
  description: String,
  assignedTo: ObjectId (User),
  assignedBy: ObjectId (User),
  deadline: Date,
  status: PENDING | DONE | LATE,
  completedAt: Date
}
```

### payroll
```javascript
{
  userId: ObjectId (User),
  month: String,
  salary: Number,
  bonus: Number,
  deduction: Number,
  finalSalary: Number
}
```

### inventory
```javascript
{
  itemName: String (unique),
  quantity: Number
}
```

### inventory_logs
```javascript
{
  itemId: ObjectId (Inventory),
  userId: ObjectId (User),
  action: ISSUE | RETURN,
  quantity: Number
}
```

---

## ✅ FEATURES IMPLEMENTED

- ✅ JWT Authentication
- ✅ Role-based Access Control (RBAC)
- ✅ Password Hashing (bcrypt)
- ✅ Auto salary deduction for late tasks
- ✅ Inventory tracking with logs
- ✅ Payroll generation system
- ✅ Task deadline management
- ✅ User status management

---

## 🎯 TESTING FLOW

1. Register as admin
2. Create employees with different roles
3. Create tasks and assign to employees
4. Mark tasks as done (some late)
5. Generate payroll (see deductions)
6. Add inventory items
7. Issue items to employees
8. View logs

**BHAI YE PRODUCTION-READY HAI! 🔥**
