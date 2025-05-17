import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { db } from '../firebase.js'
import { doc } from 'firebase/firestore'
import { getDocs, addDoc, deleteDoc, writeBatch, collection } from 'firebase/firestore'

const patientsCollectionRef = collection(db, "patients")

// CREATE
const addPatient = async (newPatient) => {
    const docRef = await addDoc(collection(db, 'patients'), newPatient)
    return docRef.id
}

export function useCreatePatient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addPatient,
    onMutate: (newPatientInfo) => { //client side optimistic update
      queryClient.setQueryData(['Patients'], (prevPatients) => [
        ...prevPatients, { ...newPatientInfo },
      ])
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['Patients'] }), //refetch Patients after mutation
    onError: () => { return "Error" }
  })
}

// READ
const fetchPatients = async () => {
    const patientData = await getDocs(patientsCollectionRef)
    return patientData.docs.map((doc) => ({...doc.data(), id: doc.id}))
}

export function useGetPatients() {
  return useQuery({
    queryKey: ['Patients'],
    queryFn: fetchPatients,
    refetchOnWindowFocus: false,
  })
}


// UPDATE
const updatePatients = async (patientsToUpdate) => {
    const batch = writeBatch(db)
    
    patientsToUpdate?.forEach((patient) => {
        const docRef = doc(db, 'patients', patient.id)
        batch.update(docRef, patient)
    })

    await batch.commit()
}

export function useUpdatePatients() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updatePatients,
    onMutate: (newPatients) => { 
      queryClient.setQueryData(['Patients'], (prevPatients) =>
        prevPatients?.map((Patient) => {
          const newPatient = newPatients.find((u) => u.id === Patient.id)
          return newPatient ? newPatient : Patient
        }),
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['Patients'] }),
    onError: () => { return "Error" }
  })
}

// DELETE
const deletePatient = async (patient) => {
    const docRef = doc(db, 'patients', patient.id)
    await deleteDoc(docRef)
}

export function useDeletePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePatient,
    onMutate: (PatientId) => {
      queryClient.setQueryData(['Patients'], (prevPatients) =>
        prevPatients?.filter((Patient) => Patient.id !== PatientId),
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['Patients'] }), 
    onError: () => { return "Error" }
  })
}
