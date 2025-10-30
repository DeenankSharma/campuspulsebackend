import express from 'express'
import { getStudentById } from '../controllers/studentController.js'

const router = express.Router()

// router.get('/students', getAllStudents)
router.get('/stufac/:id', getStudentById)

export default router