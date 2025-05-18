import { useMemo, useState } from 'react'
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table'
import { ActionIcon, Button, Flex, Text, Tooltip, Modal } from '@mantine/core'
import { modals } from '@mantine/modals'
import { IconTrash } from '@tabler/icons-react'
import { useCreatePatient, useGetPatients, useUpdatePatients, useDeletePatient } from '../lib/hooks'
import { validateRequired, validatePatient } from '../lib/validation'

export const PatientsTable = () => {
  
  // declare state and query variables
  const [validationErrors, setValidationErrors] = useState([])

  const [editedPatients, setEditedPatients] = useState({})

  const { mutateAsync: createPatient, isLoading: isCreatingPatient } = useCreatePatient()

  const {
    data: patients = [],
    isError: isLoadingPatientsError,
    isFetching: isFetchingPatients,
    isLoading: isLoadingPatients,
  } = useGetPatients()

  const { mutateAsync: updatePatients, isLoading: isUpdatingPatient } = useUpdatePatients()

  const { mutateAsync: deletePatient, isLoading: isDeletingPatient } = useDeletePatient()

  //handlers:
  const handleCreatePatient = async ({ values, exitCreatingMode }) => {
    const newValidationErrors = validatePatient(values)

    if (Object.values(newValidationErrors).some((error) => !!error)) {
      setValidationErrors(newValidationErrors)

      return
    }
    setValidationErrors({})
    await createPatient(values)
    exitCreatingMode()
  }

  const handleSavePatients = async () => {
    if (Object.values(validationErrors).some((error) => !!error)) return
    await updatePatients(Object.values(editedPatients))
    setEditedPatients({})
  }

  const openDeleteConfirmModal = (row) =>
    modals.openConfirmModal({
      title: 'Are you sure you want to delete this Patient?',
      children: (
        <Text>
          Are you sure you want to delete {row.original.firstName}{' '}
          {row.original.lastName}? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deletePatient(row.original),
    })

// CREATE THE TABLE
  const statuses = [
    {label: 'Inquiry', value: "Inquiry"},
    {label: 'Active', value: "Active"},
    {label: 'Onboarding', value: "Onboarding"},
    {label: 'Churned', value: "Churned"},
  ]

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
          error: validationErrors?.firstName,
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? 'Required'
              : undefined
            setValidationErrors({
              ...validationErrors,
              firstName: validationError,
            })
            setEditedPatients({ ...editedPatients, [row.id]: {
                ...row.original, firstName: event.currentTarget.value
                } 
            })
          },
        }),
      },
      {
        accessorKey: 'middleName',
        header: 'Middle Name',
        mantineEditTextInputProps: ({ cell, row }) => ({
          onBlur: (event) => {
            setEditedPatients({ ...editedPatients, [row.id]: {
                ...row.original, middleName: event.currentTarget.value
            }})
          },
        }),
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        mantineEditTextInputProps: ({ cell, row }) => ({
          required: true,
          error: validationErrors?.lastName,
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? 'Last Name is required'
              : undefined
              setValidationErrors({
                ...validationErrors,
                lastName: validationError,
              }) 
            setEditedPatients({ ...editedPatients, [row.id]: {
                ...row.original, lastName: event.currentTarget.value
            }})
          },
        }),
      },
      {
        accessorKey: 'dob',
        header: 'Date of Birth',
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: 'date', 
          max: new Date().toISOString().split('T')[0],
          required: true,
          error: validationErrors?.dob,
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? 'Required'
              : undefined
            setValidationErrors({
              ...validationErrors,
              dob: validationError,
            })
            setEditedPatients({ ...editedPatients, [row.id]: {
                ...row.original, dob: event.currentTarget.value
            }})
          },
        }),
      },
      {
        accessorKey: 'address',
        header: 'Address',
        mantineEditTextInputProps: ({ cell, row }) => ({
          onBlur: (event) => {
            setEditedPatients({ ...editedPatients, [row.id]: {
                ...row.original, address: event.currentTarget.value
            }})
          },
        }),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        editVariant: 'select',
        mantineEditSelectProps: ({ cell, row }) => ({
          data: statuses,
          placeholder: "status",
          required: true,
          error: validationErrors?.status,
          onChange: (event) => {
            const validationError = !validateRequired(event)
              ? 'Required'
              : undefined
            setValidationErrors({
              ...validationErrors,
              status: validationError,
            })
            setEditedPatients({ ...editedPatients, [row.id]: {
                ...row.original, status: event
            }})
          },
        }),
      },
    ],
    [editedPatients, validationErrors],
  )

  const table = useMantineReactTable({
    columns,
    data: patients,
    createDisplayMode: 'row', 
    editDisplayMode: 'cell',
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: 'last',
    enableStickyHeader: true,
    getRowId: (row) => row.id,
    mantineTableHeadCellProps: {
      sx: {
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'white',
      },
    },
    mantineTableBodyCellProps: ({ row, column }) => {
      const rowId = row?.id
      const columnId = column?.id

      const editedValue = editedPatients?.[rowId]?.[columnId]
      const originalValue = row.original?.[columnId]

      const isEdited = editedValue !== undefined && editedValue !== originalValue

      return {
        style: {
          color: isEdited ? 'orange' : undefined,
        },
      }
    },
    mantineTableContainerProps: {
      sx: {
        overflowX: 'auto',
        overflowY: 'auto',
        minHeight: '400px',
        maxHeight: '400px',
        '&::-webkit-scrollbar': {
          height: '12px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#ccc',
          borderRadius: '6px',
        },
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreatePatient,
    renderRowActions: ({ row }) => (
      <Tooltip label="Delete">
        <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
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
  })

  return <MantineReactTable table={table} />
}

