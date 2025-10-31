import express from 'express'
import { employeeSignup, getEmployeeById } from '../controllers/employeeController.js'

const router = express.Router()

router.post('/signup', employeeSignup)
router.get('/:empId', getEmployeeById)

export default router