import { useMemo, useState } from 'react';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { ActionIcon, Button, Flex, Text, Tooltip, Modal } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useCreatePatient, useGetPatients, useUpdatePatients, useDeletePatient } from '../helpers/hooks'
import { validateRequired, validatePatient } from '../helpers/validation'

export const PatientsTable = () => {
  
  // declare state and query variables
  const [validationErrors, setValidationErrors] = useState({})

  const [editedPatients, setEditedPatients] = useState({})

  const { mutateAsync: createPatient, isLoading: isCreatingPatient } = useCreatePatient()

  const {
    data: patients = [],
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
        header: 'PID',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        mantineEditTextInputProps: ({ cell, row }) => ({
          required: true,
          error: validationErrors?.[cell.id],
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? 'Required'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedPatients({ ...editedPatients, [row.id]: {
                ...row.original, firstName: event.currentTarget.value
                } 
            });
          },
        }),
      },
      {
        accessorKey: 'middleName',
        header: 'Middle Name',
        mantineEditTextInputProps: ({ cell, row }) => ({
          required: true,
          error: validationErrors?.[cell.id],
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
          required: true,
          error: validationErrors?.[cell.id],
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
        accessorKey: 'dob',
        header: 'Date of Birth',
        mantineEditTextInputProps: ({ cell, row }) => ({
          required: true,
          error: validationErrors?.[cell.id],
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
        accessorKey: 'address',
        header: 'Address',
        mantineEditTextInputProps: ({ cell, row }) => ({
          required: true,
          error: validationErrors?.[cell.id],
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
        accessorKey: 'status',
        header: 'Status',
        mantineEditTextInputProps: ({ cell, row }) => ({
          required: true,
          error: validationErrors?.[cell.id],
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
    ],
    [editedPatients, validationErrors],
  );

  const table = useMantineReactTable({
    columns,
    data: patients,
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
      <Flex align="left" gap="md">
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
          table.setCreatingRow(true)
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

