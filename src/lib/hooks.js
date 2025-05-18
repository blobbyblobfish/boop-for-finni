import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { db } from '../firebase.js'
import { doc } from 'firebase/firestore'
import { getDocs, addDoc, deleteDoc, writeBatch, collection } from 'firebase/firestore'
import { notifications } from '@mantine/notifications'

const patientsCollectionRef = collection(db, "patients")

// CREATE
const addPatient = async (newPatient) => {
  console.log(newPatient)
    try {
      const docRef = await addDoc(patientsCollectionRef, newPatient)
      return docRef.id
    } catch (error) {
      throw error
    }
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
    onError: () => { 
      notifications.show({
        title: "Oops", 
        message: "Error creating new row",
        color: "red"
      })
      return 
    }
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
const updatePatients = async (editedPatients) => {
    const batch = writeBatch(db)
    
    editedPatients?.forEach((patient) => {
      const docRef = doc(db, 'patients', patient.id)
      batch.update(docRef, patient)
    })

    try {
      await batch.commit()
    } catch (error) {
      throw error
    }
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
    onError: () => { 
      notifications.show({
        title: "Oops", 
        message: "Error updating cell(s)",
        color: "red"
      })
      return 
    }
  })
}

// DELETE
const deletePatient = async (patientId) => {
  try {
    const docRef = doc(db, 'patients', patientId)
    await deleteDoc(docRef)
  } catch (error) {
    throw error
  }
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
    onError: () => { 
      notifications.show({
        title: "Oops", 
        message: "Error deleting row",
        color: "red"
      })
      return 
    }
  })
}
