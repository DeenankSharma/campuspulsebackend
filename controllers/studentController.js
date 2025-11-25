import supabase from '../database/supabase_connections.js'

// export const getAllStudents = async (req, res) => {
//   try {
//     const { data, error } = await supabase
//       .from('student_details')
//       .select('*')

//     if (error) throw error

//     res.status(200).json({
//       success: true,
//       data: data
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message
//     })
//   }
// }

export const getStudentById = async (req, res) => {
  try {
    console.log(req.params.id);
    const { data, error } = await supabase
      .from('student_details')
      .select('*')
      .eq('enr', req.params.id)
      .single()

    if (error) throw error
    console.log(data);
    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Student not found"
      })
    }

    res.status(200).json({
      success: true,
      data: data
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}