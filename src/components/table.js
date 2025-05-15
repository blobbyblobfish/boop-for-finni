import { useMemo, useState } from 'react';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { ActionIcon, Button, Flex, Text, Tooltip, Modal } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

const PatientsTable = (patients) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [editedPatients, setEditedPatients] = useState({});

  //call CREATE hook
  const { mutateAsync: createPatient, isLoading: isCreatingPatient } =
    useCreatePatient();
  //call READ hook
  const {
    data: fetchedPatients = [],
    isError: isLoadingPatientsError,
    isFetching: isFetchingPatients,
    isLoading: isLoadingPatients,
  } = useGetPatients();
  //call UPDATE hook
  const { mutateAsync: updatePatients, isLoading: isUpdatingPatient } =
    useUpdatePatients();
  //call DELETE hook
  const { mutateAsync: deletePatient, isLoading: isDeletingPatient } =
    useDeletePatient();

  //CREATE action
  const handleCreatePatient = async ({ values, exitCreatingMode }) => {
    const newValidationErrors = validatePatient(values);
    if (Object.values(newValidationErrors).some((error) => !!error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createPatient(values);
    exitCreatingMode();
  };

  //UPDATE action
  const handleSavePatients = async () => {
    if (Object.values(validationErrors).some((error) => !!error)) return;
    await updatePatients(Object.values(editedPatients));
    setEditedPatients({});
  };

  //DELETE action
//   const openDeleteConfirmModal = (row) =>
//     // modals.openConfirmModal({
//     //   title: 'Are you sure you want to delete this Patient?',
//     //   children: (
//     //     <Text>
//     //       Are you sure you want to delete {row.original.firstName}{' '}
//     //       {row.original.lastName}? This action cannot be undone.
//     //     </Text>
//     //   ),
//     //   labels: { confirm: 'Delete', cancel: 'Cancel' },
//     //   confirmProps: { color: 'red' },
//     //   onConfirm: () => deletePatient(row.original.id),
//     });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: 'email',
          required: true,
          error: validationErrors?.[cell.id],
          //store edited Patient in state to be saved later
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? 'Required'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedPatients({ ...editedPatients, [row.id]: row.original });
          },
        }),
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: 'email',
          required: true,
          error: validationErrors?.[cell.id],
          //store edited Patient in state to be saved later
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? 'Required'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedPatients({ ...editedPatients, [row.id]: row.original });
          },
        }),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: 'email',
          required: true,
          error: validationErrors?.[cell.id],
          //store edited Patient in state to be saved later
          onBlur: (event) => {
            const validationError = !validateEmail(event.currentTarget.value)
              ? 'Invalid Email'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedPatients({ ...editedPatients, [row.id]: row.original });
          },
        }),
      },
      {
        accessorKey: 'state',
        header: 'State',
        editVariant: 'select',
        mantineEditSelectProps: ({ row }) => ({
        //   data: usStates,
          //store edited Patient in state to be saved later
          onChange: (value) =>
            setEditedPatients({
              ...editedPatients,
              [row.id]: { ...row.original, state: value },
            }),
        }),
      },
    ],
    [editedPatients, validationErrors],
  );

  const table = useMantineReactTable({
    columns,
    data: fetchedPatients,
    createDisplayMode: 'row', // ('modal', and 'custom' are also available)
    editDisplayMode: 'cell', // ('modal', 'row', 'cell', and 'custom' are also available)
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: 'last',
    getRowId: (row) => row.id,
    mantineToolbarAlertBannerProps: isLoadingPatientsError
      ? {
          color: 'red',
          children: 'Error loading data',
        }
      : undefined,
    mantineTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreatePatient,
    renderRowActions: ({ row }) => (
      <Tooltip label="Delete">
        {/* <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
          <IconTrash />
        </ActionIcon> */}
      </Tooltip>
    ),
    renderBottomToolbarCustomActions: () => (
      <Flex align="center" gap="md">
        <Button
          color="blue"
          onClick={handleSavePatients}
          disabled={
            Object.keys(editedPatients).length === 0 ||
            Object.values(validationErrors).some((error) => !!error)
          }
          loading={isUpdatingPatient}
        >
          Save
        </Button>
        {Object.values(validationErrors).some((error) => !!error) && (
          <Text color="red">Fix errors before submitting</Text>
        )}
      </Flex>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        onClick={() => {
          table.setCreatingRow(true); //simplest way to open the create row modal with no default values
          //or you can pass in a row object to set default values with the `createRow` helper function
          // table.setCreatingRow(
          //   createRow(table, {
          //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
          //   }),
          // );
        }}
      >
        Create New Patient
      </Button>
    ),
    state: {
      isLoading: isLoadingPatients,
      isSaving: isCreatingPatient || isUpdatingPatient || isDeletingPatient,
      showAlertBanner: isLoadingPatientsError,
      showProgressBars: isFetchingPatients,
    },
  });

  return <MantineReactTable table={table} />;
};

//CREATE hook (post new Patient to api)
function useCreatePatient() {
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

//READ hook (get Patients from api)
function useGetPatients(patients) {
  return useQuery({
    queryKey: ['Patients'],
    queryFn: async () => {
      //send api request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(patients);
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put Patients in api)
function useUpdatePatients() {
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

//DELETE hook (delete Patient in api)
function useDeletePatient() {
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

const queryClient = new QueryClient();

const PatientsTableWithProviders = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    {/* <ModalsProvider> */}
      <PatientsTable />
    {/* </ModalsProvider> */}
  </QueryClientProvider>
);

export {PatientsTableWithProviders};

const validateRequired = (value) => !!value?.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

function validatePatient(Patient) {
  return {
    firstName: !validateRequired(Patient.firstName)
      ? 'First Name is Required'
      : '',
    lastName: !validateRequired(Patient.lastName) ? 'Last Name is Required' : '',
    email: !validateEmail(Patient.email) ? 'Incorrect Email Format' : '',
  };
}