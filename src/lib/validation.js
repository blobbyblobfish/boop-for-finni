export const validateRequired = (value) => !!value?.length;

export function validatePatient(Patient) {
  return {
    firstName: !validateRequired(Patient.firstName) ? 'First Name is Required' : null,
    lastName: !validateRequired(Patient.lastName) ? 'Last Name is Required' : null,
    dob: !validateRequired(Patient.dob) ? 'Date of Birth is Required' : null,
    status: !validateRequired(Patient.status) ? 'Status is Required' : null,
  };
}