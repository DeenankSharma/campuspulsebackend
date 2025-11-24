import express from 'express'
import { createIssue, getAllIssues, getIssuesByEnr ,resolveIssue} from '../controllers/issueController.js'

const router = express.Router()

// POST /api/issues      -> create new issue
router.post('/', createIssue)

// GET /api/issues       -> fetch all issues
router.get('/', getAllIssues)

// GET /api/issues/enr/:enr  -> fetch issues by enrollment id
router.get('/enr/:enr', getIssuesByEnr)

router.post('/:id/resolve', resolveIssue)

export default router