export const validateRequired = (value) => !!value?.length;

function validateDob (dob) {
  if (dob) {
    const [year, month, day] = dob?.split('-').map(Number)
    const dobObject = new Date(year, month - 1, day)
    const today = new Date()

    if (dobObject > today) {return "DOB cannot be in future"}
    else { 
      return null 
    }
  } else {
    return "DOB is required"
  }
}

export function validatePatient(Patient) {
  return {
    firstName: !validateRequired(Patient?.firstName) ? 'First Name is Required' : null,
    lastName: !validateRequired(Patient?.lastName) ? 'Last Name is Required' : null,
    dob: validateDob(Patient?.dob), // checks if dob in future or null
    status: !validateRequired(Patient?.status) ? 'Status is Required' : null,
  };
}