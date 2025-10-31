import supabase from '../database/supabase_connections.js'

export const employeeSignup = async (req, res) => {
    try {
        const { emp_id, name, role, dept, domain, proof } = req.body

        // Validate required fields
        if (!emp_id || !name || !role || !dept || !domain || !proof) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            })
        }

        // Check if employee already exists
        const { data: existingEmployee } = await supabase
            .from('employee_details')
            .select('*')
            .eq('emp_id', emp_id)
            .single()

        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                error: 'Employee already exists'
            })
        }

        // Insert new employee
        const { data, error } = await supabase
            .from('employee_details')
            .insert([
                {
                    emp_id,
                    name,
                    role,
                    dept,
                    domain,
                    proof
                }
            ])
            .select()
            .single()

        if (error) throw error

        return res.status(201).json({
            success: true,
            data: data
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

export const getEmployeeById = async (req, res) => {
  try {
    const empId = req.params.empId
    if (!empId) return res.status(400).json({ success: false, error: 'empId required' })

    const { data, error } = await supabase
      .from('employee_details')
      .select('*')
      .eq('emp_id', empId)
      .maybeSingle()

    if (error) throw error

    if (!data) {
      return res.status(404).json({ success: false, error: 'Employee not found' })
    }

    // return shape that frontend expects: response.data['data']
    return res.status(200).json({ success: true, data })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}