import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { dbConnect } from './config/db.js'
import authRoutes from './routes/auth.route.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 4001

// Connect to Database
dbConnect()

// Middlewares
app.use(express.json())
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}))
app.use(cookieParser())

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: "ERP System Backend API is running..." })
})

// Mount Routes
app.use('/auth', authRoutes)

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
