export const validateRequired = (value) => !!value?.length;

export function validatePatient(Patient) {
  return {
    firstName: !validateRequired(Patient.firstName)
      ? 'First Name is Required'
      : '',
    lastName: !validateRequired(Patient.lastName) ? 'Last Name is Required' : '',
  };
}