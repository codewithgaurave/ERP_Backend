import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { dbConnect } from './config/db.js'
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import taskRoutes from './routes/task.route.js'
import payrollRoutes from './routes/payroll.route.js'
import inventoryRoutes from './routes/inventory.route.js'
import dashboardRoutes from './routes/dashboard.route.js'
import { startTaskScheduler } from './utils/taskScheduler.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 4001

dbConnect()
startTaskScheduler()

app.use(express.json())
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173" || "https://erp-frontend-snowy-nine.vercel.app/",
  credentials: true
}))
app.use(cookieParser())

app.get('/', (req, res) => {
  res.json({ message: "ERP System Backend API is running..." })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/payroll', payrollRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
