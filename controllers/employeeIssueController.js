import supabase from '../database/supabase_connections.js'

// ...existing code...
export const addOrUpdateEmployeeIssue = async (req, res) => {
  try {
    console.log('Request Body:', req.body) // Debug log
    const { issue_id, image_url, emp_id } = req.body

    if (!issue_id || !image_url) {
      return res.status(400).json({ success: false, error: 'issue_id and image_url are required' })
    }

    const issueId = Number(issue_id)
    const empId = emp_id ? Number(emp_id) : null

    if (Number.isNaN(issueId)) {
      return res.status(400).json({ success: false, error: 'issue_id must be a number' })
    }

    // 1) ensure issue exists in issues table
    const { data: issue, error: issueErr } = await supabase
      .from('issues')
      .select('id')
      .eq('id', issueId)
      .maybeSingle()

    if (issueErr) throw issueErr
    if (!issue) return res.status(404).json({ success: false, error: 'Issue not found' })
    console.log('Issue found:', issue) // Debug log
    // 2) mark issue as resolved
    const { data: issueUpdated, error: issueUpdateErr } = await supabase
      .from('issues')
      .update({ isresolved: true })
      .eq('id', issueId)
      .select()
      .single()
    if (issueUpdateErr) throw issueUpdateErr

    // 3) check if an employee_issues record already exists for this issue_id
    const { data: existing, error: existingErr } = await supabase
      .from('employee_issues')
      .select('*')
      .eq('issue_id', issueId)
      .maybeSingle()

    if (existingErr) throw existingErr

    if (existing) {
      // update existing record (set image_url, optionally emp_id)
      const updatePayload =  { image_url }
      const { data: updated, error: updateErr } = await supabase
        .from('employee_issues')
        .update(updatePayload)
        .eq('issue_id', issueId)
        .select('image_url')
        .single()

      if (updateErr) throw updateErr

      return res.status(200).json({ success: true, data: updated, issue: issueUpdated })
    } else {
      // insert new record (with or without emp_id)
      const insertPayload =  { issue_id: issueId, image_url }
      const { data: inserted, error: insertErr } = await supabase
        .from('employee_issues')
        .insert([insertPayload])
        .select()
        .single()

      if (insertErr) throw insertErr

      return res.status(201).json({ success: true, data: inserted, issue: issueUpdated })
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
// ...existing code...

export const getEmployeeIssueByIssueId = async (req, res) => {
  try {
    const issueId = Number(req.params.issueId)
    if (!issueId) return res.status(400).json({ success: false, error: 'valid issueId required' })

    const { data, error } = await supabase
      .from('employee_issues')
      .select('*')
      .eq('issue_id', issueId)
      .maybeSingle()

    if (error) throw error
    if (!data) return res.status(404).json({ success: false, error: 'Record not found' })

    return res.status(200).json({ success: true, data })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}

// Get only image_url for an issue from employee_issues
export const getIssueWithEmployeeImage = async (req, res) => {
  try {
    const issueId = Number(req.params.issueId)
    if (!issueId) return res.status(400).json({ success: false, error: 'Valid issueId required' })

    // Get only image_url from employee_issues
    const { data: empIssue, error: empIssueErr } = await supabase
      .from('employee_issues')
      .select('image_url')
      .eq('issue_id', issueId)
      .maybeSingle()
    if (empIssueErr) throw empIssueErr
    console.log('Employee Issue Image Data:', empIssue) // Debug log
    return res.status(200).json({
      success: true,
      authority_image_url: empIssue ? empIssue.image_url : null
    })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}

// Mark issue as unresolved and delete from employee_issues
export const unresolveAndDeleteEmployeeIssue = async (req, res) => {
  try {
    const issueId = Number(req.params.issueId)
    if (!issueId) return res.status(400).json({ success: false, error: 'Valid issueId required' })

    // 1. Mark isresolved as false in issues
    const { data: updatedIssue, error: updateErr } = await supabase
      .from('issues')
      .update({ isresolved: false })
      .eq('id', issueId)
      .select()
      .single()
    if (updateErr) throw updateErr
    if (!updatedIssue) return res.status(404).json({ success: false, error: 'Issue not found' })

    // 2. Delete from employee_issues
    const { error: deleteErr } = await supabase
      .from('employee_issues')
      .delete()
      .eq('issue_id', issueId)
    if (deleteErr) throw deleteErr

    return res.status(200).json({ success: true, message: 'Issue marked as unresolved and employee issue deleted' })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}

export const deleteIssueCompletely = async (req, res) => {
  try {
    const issueId = Number(req.params.issueId)
    if (!issueId) return res.status(400).json({ success: false, error: 'Valid issueId required' })

    // Delete from employee_issues first (if exists)
    const { error: empIssueErr } = await supabase
      .from('employee_issues')
      .delete()
      .eq('issue_id', issueId)
    if (empIssueErr) throw empIssueErr

    // Delete from issues
    const { error: issueErr } = await supabase
      .from('issues')
      .delete()
      .eq('id', issueId)
    if (issueErr) throw issueErr

    return res.status(200).json({ success: true, message: 'Issue deleted from both tables' })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}