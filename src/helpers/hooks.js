import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

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

export function useGetPatients() {
  return useQuery({
    queryKey: ['Patients'],
    queryFn: async () => {
      //send api request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
    //   return Promise.resolve();
    },
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
