export const validateRequired = (value) => !!value?.length;

function validateDobNotInFuture (dob) {
  if (dob) {
    const [year, month, day] = dob?.split('-').map(Number)
    const dobObject = new Date(year, month - 1, day)
    const today = new Date()

    return dobObject <= today
  }

  return
}

export function validatePatient(Patient) {

  return {
    firstName: !validateRequired(Patient?.firstName) ? 'First Name is Required' : null,
    lastName: !validateRequired(Patient?.lastName) ? 'Last Name is Required' : null,
    dob: !validateDobNotInFuture(Patient?.dob) ? 'Date of Birth cannot be in future' : null,
    dob: !validateRequired(Patient?.dob) ? 'Date of Birth is Required' : null,
    status: !validateRequired(Patient?.status) ? 'Status is Required' : null,
  };
}