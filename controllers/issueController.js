import supabase from '../database/supabase_connections.js'

export const createIssue = async (req, res) => {
  try {
    console.log(req.body);
    const { title, desc, image_url, lat, long, critical, enr, domain } = req.body

    if (!title || !enr) {
      return res.status(400).json({ success: false, error: 'title and enr are required' })
    }

    const payload = {
      title,
      desc: desc ?? null,
      image_url: image_url ?? null,
      lat: lat ?? null,
      long: long ?? null,
      critical: critical ?? null,
      enr,
      domain: domain ?? null
    }

    const { data, error } = await supabase
      .from('issues')
      .insert([payload])
      .select()
      .single()

    if (error) throw error

    return res.status(201).json({ success: true, data })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}

export const getAllIssues = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .order('id', { ascending: false })

    if (error) throw error

    return res.status(200).json({ success: true, data })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}

export const getIssuesByEnr = async (req, res) => {
  try {
    const enr = req.params.enr
    if (!enr) {
      return res.status(400).json({ success: false, error: 'enrollment id required' })
    }

    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .eq('enr', enr)
      .order('id', { ascending: false })

    if (error) throw error

    return res.status(200).json({ success: true, data })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}

  export const resolveIssue = async (req, res) => {
    try {
      const issueId = Number(req.params.id) || Number(req.body.id)
      const empId = req.body.emp_id ?? req.body.empId

      if (!issueId || !empId) {
        return res.status(400).json({ success: false, error: 'issue id and emp_id are required' })
      }

      // verify employee exists
      const { data: employee, error: empErr } = await supabase
        .from('employee_details')
        .select('emp_id')
        .eq('emp_id', empId)
        .maybeSingle()

      if (empErr) throw empErr
      if (!employee) {
        return res.status(404).json({ success: false, error: 'Employee not found' })
      }

      // verify issue exists
      const { data: issue, error: issueErr } = await supabase
        .from('issues')
        .select('id, isresolved')
        .eq('id', issueId)
        .maybeSingle()

      if (issueErr) throw issueErr
      if (!issue) {
        return res.status(404).json({ success: false, error: 'Issue not found' })
      }
      if (issue.isresolved) {
        return res.status(400).json({ success: false, error: 'Issue already resolved' })
      }

      // mark issue resolved
      const { data: updated, error: updateErr } = await supabase
        .from('issues')
        .update({ isresolved: true })
        .eq('id', issueId)
        .select()
        .single()

      if (updateErr) throw updateErr

      return res.status(200).json({ success: true, data: updated })
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message })
    }
  }
