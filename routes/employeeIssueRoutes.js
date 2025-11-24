import express from 'express'
import { addOrUpdateEmployeeIssue, getEmployeeIssueByIssueId,   getIssueWithEmployeeImage,
  unresolveAndDeleteEmployeeIssue, deleteIssueCompletely } from '../controllers/employeeIssueController.js'

const router = express.Router()

// POST /api/employee_issues     body: { issue_id, emp_id, image_url }
router.post('/', addOrUpdateEmployeeIssue)

// GET /api/employee_issues/:issueId   -> get record (including image_url) by issue id
router.get('/:issueId', getEmployeeIssueByIssueId)

router.get('/details/:issueId', getIssueWithEmployeeImage)

router.delete('/:issueId', unresolveAndDeleteEmployeeIssue)

router.delete('/full/:issueId', deleteIssueCompletely)

export default router


