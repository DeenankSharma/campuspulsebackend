import express from "express"
import dotenv from "dotenv"
import studentRoutes from './routes/studentRoutes.js'
import issueRoutes from './routes/issueRoutes.js'
import employeeRoutes from './routes/employeeRoutes.js'
import employeeIssueRoutes from './routes/employeeIssueRoutes.js'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = process.env.PORT

app.use(cors())

app.use(express.json())

app.use('/api', studentRoutes)
app.use('/api/issues', issueRoutes)
app.use('/api/employee', employeeRoutes)
app.use('/api/employee_issues', employeeIssueRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})