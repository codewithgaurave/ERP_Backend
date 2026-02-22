# 🚀 SETUP INSTRUCTIONS - ERP BACKEND

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Setup .env File
```env
PORT=4001
MONGO_URI=mongodb://localhost:27017/erp_system
JWT_SECRET=your_super_secret_key_here_change_this
FRONTEND_URL=http://localhost:5173
```

## Step 3: Create First Admin (IMPORTANT!)
```bash
npm run seed:admin
```

**Output:**
```
✅ Database connected
🎉 Admin created successfully!
📧 Email: admin@erp.com
🔑 Password: admin123
⚠️ Please change password after first login!
```

## Step 4: Start Server
```bash
npm start
```

---

## 🔐 First Login

**Login as Admin:**
```
POST http://localhost:4001/auth/login
Body: {
  "email": "admin@erp.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Super Admin",
    "email": "admin@erp.com",
    "role": "ADMIN"
  }
}
```

---

## 👥 Admin Can Now:

### 1. Create HR
```
POST /users
Headers: Authorization: Bearer <admin_token>
Body: {
  "name": "HR Manager",
  "email": "hr@erp.com",
  "password": "hr123",
  "role": "HR",
  "salary": 60000
}
```

### 2. Create Manager
```
POST /users
Headers: Authorization: Bearer <admin_token>
Body: {
  "name": "Project Manager",
  "email": "manager@erp.com",
  "password": "manager123",
  "role": "MANAGER",
  "salary": 70000
}
```

### 3. Create Employee
```
POST /users
Headers: Authorization: Bearer <admin_token>
Body: {
  "name": "John Doe",
  "email": "john@erp.com",
  "password": "john123",
  "role": "EMPLOYEE",
  "salary": 40000
}
```

### 4. Create Inventory Manager
```
POST /users
Headers: Authorization: Bearer <admin_token>
Body: {
  "name": "Inventory Manager",
  "email": "inventory@erp.com",
  "password": "inv123",
  "role": "INVENTORY",
  "salary": 50000
}
```

---

## 📋 Complete Workflow

### Admin Flow:
1. ✅ Login as admin
2. ✅ Create HR, Manager, Employees, Inventory users
3. ✅ View all users (with createdBy info)
4. ✅ Update user roles/salary
5. ✅ Toggle user status (active/inactive)
6. ✅ Create tasks
7. ✅ Add inventory items
8. ✅ Generate payroll

### Manager Flow:
1. ✅ Login as manager
2. ✅ Create tasks
3. ✅ Assign tasks to employees
4. ✅ View all tasks
5. ✅ Delete tasks

### HR Flow:
1. ✅ Login as HR
2. ✅ Generate payroll for employees
3. ✅ View all payrolls
4. ✅ Check late task deductions

### Employee Flow:
1. ✅ Login as employee
2. ✅ View assigned tasks
3. ✅ Complete tasks
4. ✅ View own payroll slips
5. ✅ View inventory logs

### Inventory Manager Flow:
1. ✅ Login as inventory manager
2. ✅ Add items to inventory
3. ✅ Issue items to employees
4. ✅ Accept returned items
5. ✅ View all logs

---

## 🎯 Testing Complete System

### 1. Setup Admin
```bash
npm run seed:admin
```

### 2. Login & Get Token
```bash
POST /auth/login
Body: { "email": "admin@erp.com", "password": "admin123" }
```

### 3. Create Team
```bash
# Create Manager
POST /users (with admin token)

# Create Employees
POST /users (with admin token)

# Create HR
POST /users (with admin token)
```

### 4. Assign Tasks
```bash
# Manager creates task
POST /tasks (with manager token)
Body: {
  "title": "Complete Project Report",
  "assignedTo": "employee_id",
  "deadline": "2024-01-20"
}
```

### 5. Complete Tasks
```bash
# Employee completes task
PUT /tasks/:id (with employee token)
Body: { "status": "DONE" }
```

### 6. Generate Payroll
```bash
# HR generates payroll
POST /payroll (with HR token)
Body: {
  "userId": "employee_id",
  "month": "2024-01",
  "bonus": 5000
}
```

### 7. Manage Inventory
```bash
# Add item
POST /inventory (with inventory token)
Body: { "itemName": "Laptop", "quantity": 10 }

# Issue to employee
POST /inventory/issue (with inventory token)
Body: { "itemId": "item_id", "userId": "employee_id", "quantity": 1 }
```

---

## ✅ READY TO USE!

**All users created by Admin will have `createdBy` field showing who created them.**

**Real client project ready! 🔥**
