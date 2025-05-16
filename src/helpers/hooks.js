import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { db } from '../firebase-config.js'
import { getDocs, collection } from 'firebase/firestore'

const patientsCollectionRef = collection(db, "patients")


export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (Patient) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newPatientInfo) => {
      queryClient.setQueryData(['Patients'], (prevPatients) => [
        ...prevPatients,
        {
          ...newPatientInfo,
          id: (Math.random() + 1).toString(36).substring(7),
        },
      ]);
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['Patients'] }), //refetch Patients after mutation, disabled for demo
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

export function useUpdatePatients() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (Patients) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newPatients) => {
      queryClient.setQueryData(['Patients'], (prevPatients) =>
        prevPatients?.map((Patient) => {
          const newPatient = newPatients.find((u) => u.id === Patient.id);
          return newPatient ? newPatient : Patient;
        }),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['Patients'] }), //refetch Patients after mutation, disabled for demo
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (PatientId) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (PatientId) => {
      queryClient.setQueryData(['Patients'], (prevPatients) =>
        prevPatients?.filter((Patient) => Patient.id !== PatientId),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['Patients'] }), //refetch Patients after mutation, disabled for demo
  });
}
