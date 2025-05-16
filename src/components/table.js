import { useMemo, useState, useEffect } from 'react';
import { MantineReactTable, useMantineReactTable, createRow } from 'mantine-react-table';
import { ActionIcon, Button, Flex, Text, Tooltip, Modal } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useCreatePatient, useGetPatients, useUpdatePatients, useDeletePatient } from '../helpers/hooks'
import { validateRequired, validatePatient } from '../helpers/validation'
import { db } from '../firebase-config.js'
import { getDocs, collection } from 'firebase/firestore'


export const PatientsTable = () => {
  const [validationErrors, setValidationErrors] = useState({})
  const [patientList, setPatientList] = useState([])
  const [editedPatients, setEditedPatients] = useState({})
  const patientsCollectionRef = collection(db, "patients")


  useEffect(() => {
    const getPatientsList = async () => {
    try {
        const patientData = await getDocs(patientsCollectionRef)

        const filteredPatientData = patientData.docs.map((doc) => ({...doc.data(), id: doc.id}))

        setPatientList(filteredPatientData)
    } catch (error) {
        // handle error
    }
    }

    getPatientsList()
  }, [])

  //what is this syntax:
  const { mutateAsync: createPatient, isLoading: isCreatingPatient } = useCreatePatient()

  const {
    data: fetchedPatients = [],
    isError: isLoadingPatientsError,
    isFetching: isFetchingPatients,
    isLoading: isLoadingPatients,
  } = useGetPatients();

  const { mutateAsync: updatePatients, isLoading: isUpdatingPatient } = useUpdatePatients();

  const { mutateAsync: deletePatient, isLoading: isDeletingPatient } = useDeletePatient();

  //handlers:
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

  const handleSavePatients = async () => {
    if (Object.values(validationErrors).some((error) => !!error)) return;
    await updatePatients(Object.values(editedPatients));
    setEditedPatients({});
  };

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

// CREATE THE TABLE
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
        accessorKey: 'state',
        header: 'State',
        editVariant: 'select',
        mantineEditSelectProps: ({ row }) => ({
          data: patientList,
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
    createDisplayMode: 'row', 
    editDisplayMode: 'cell',
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
        <ActionIcon color="red">
          <IconTrash />
        </ActionIcon>
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
          table.setCreatingRow(true || false)
        }}>
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

