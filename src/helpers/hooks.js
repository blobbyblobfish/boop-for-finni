import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { db } from '../firebase-config.js'
import { getDocs, addDoc, collection } from 'firebase/firestore'

const patientsCollectionRef = collection(db, "patients")

const addPatient = async (newPatient) => {
    const docRef = await addDoc(collection(db, 'patients'), newPatient)
    return docRef.id
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addPatient,
    onMutate: (newPatientInfo) => { //client side optimistic update
      queryClient.setQueryData(['Patients'], (prevPatients) => [
        ...prevPatients, { ...newPatientInfo },
      ]);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['Patients'] }), //refetch Patients after mutation
  });
}

const fetchPatients = async () => {
    const patientData = await getDocs(patientsCollectionRef)
    return patientData.docs.map((doc) => ({...doc.data(), id: doc.id}))
}

export function useGetPatients() {
  return useQuery({
    queryKey: ['Patients'],
    queryFn: fetchPatients,
    refetchOnWindowFocus: false,
  });
}

const updatePatients = async () => {
    // const patientData = await getDocs(patientsCollectionRef)
    // return patientData.docs.map((doc) => ({...doc.data(), id: doc.id}))
}

export function useUpdatePatients() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePatients,
    //client side optimistic update
    onMutate: (newPatients) => {
      queryClient.setQueryData(['Patients'], (prevPatients) =>
        prevPatients?.map((Patient) => {
          const newPatient = newPatients.find((u) => u.id === Patient.id);
          return newPatient ? newPatient : Patient;
        }),
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['Patients'] }), //refetch Patients after mutation, disabled for demo
  });
}

const deletePatients = async () => {
    // const patientData = await getDocs(patientsCollectionRef)
    // return patientData.docs.map((doc) => ({...doc.data(), id: doc.id}))
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePatients,
    //client side optimistic update
    onMutate: (PatientId) => {
      queryClient.setQueryData(['Patients'], (prevPatients) =>
        prevPatients?.filter((Patient) => Patient.id !== PatientId),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['Patients'] }), //refetch Patients after mutation, disabled for demo
  });
}
