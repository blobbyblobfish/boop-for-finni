import { Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TableFooter, TablePagination, TableSortLabel } from '@mui/material'

export const PatientTable = ({ patients }) => {
    console.log(patients)

    if (!patients || patients.length == 0){
        return <Typography>Loading table</Typography>
    }

    const test = [{
        id: 123,
        string: "abc"
    },
    {
        id: 456,
        string: "def"
    }
    ]

    return (<TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Patient ID</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>First Name</TableCell>
                    <TableCell>Middle Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Address</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {patients.map((patient) =>{ 
                    return <TableRow key={patient.id}>
                        <TableCell>{patient.id}</TableCell>
                        <TableCell>{patient.status}</TableCell>
                        <TableCell>{patient.firstName}</TableCell>
                        <TableCell>{patient.middleName}</TableCell>
                        <TableCell>{patient.lastName}</TableCell>
                        <TableCell>{patient.address}</TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
    </TableContainer>
    )
}
