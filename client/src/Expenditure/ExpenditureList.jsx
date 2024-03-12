import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Pagination, Stack } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { AuthContext } from '../store/AuthProvider';
import { AppContext } from '../store/AppProvider';
import { axiosInstance } from '../axios/axios';

const ExpenditureList = () => {
const {handleNavigate} = useContext(AppContext)
const [currentPage,setCurrentPage] = useState(1)
const [expenditures,setExpenditures] = useState()
    const [pageCount,setPageCount] = useState(0)
    const data = [
        { id: 1, name: 'Electricity', amount: 100 },
        { id: 2, name: 'Rent', amount: 800 },
        { id: 3, name: 'Water', amount: 50 },
        { id: 4, name: 'Netflix', amount: 15 }
      ];

      function onNavigate(path){
        handleNavigate(path)
      }

      const handlePageChange = (event,value) =>{

        setCurrentPage(value)
      }


     async function getExpenditures(){
   const {data} =await axiosInstance.get(`/expenditure/all?page=${currentPage}`)
   console.log(data);
   setPageCount(data.pageCount)
   setExpenditures(data.expenditures)
      }



useEffect(()=>{
getExpenditures()
}, [currentPage])



  return (
    <div className="route">
<h3 className="page-title">Expenditures</h3>
<div className="content">
    <TableContainer component={Paper}>

    <Box display="flex" justifyContent="flex-end" className="page-header">
    <Button
        variant="contained"
        color="primary"
        startIcon={<MdAdd />} // Add the Add icon as start icon
        sx={{ marginBottom: 2 }} // Add some margin at the bottom for spacing
    
    onClick={()=>onNavigate('/expenditure/add')}
    >
        Add Expenditure
      </Button>

      </Box>
    <Table>
      <TableHead>
        <TableRow>
        <TableCell>#</TableCell>
          <TableCell>Name</TableCell>
          <TableCell align="right">Amount</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {expenditures?.map((row,idx) => (
          <TableRow key={row.id}>
            <TableCell component="th" scope="row">
              {idx+1}
            </TableCell>
            <TableCell component="th" scope="row">
              {row.name}
            </TableCell>
            <TableCell align="right">{row.amount}</TableCell>
            <TableCell>
                <div className="btn-row">
                <Button variant="contained" sx={{bgcolor:'#10e30c',' &:hover':{bgcolor:'#0eba0b'}}} color="primary" size="small" onClick={() => handleAction(row)}>
                Edit
              </Button>
              <Button variant="contained" color="primary" sx={{bgcolor:'#eb130c',' &:hover':{bgcolor:'#d10f08'}}} size="small" onClick={() => handleAction(row)}>
              Delete
              </Button>
                </div>
             
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <div className="pagination-section">
      <Stack spacing={2}>
      <Pagination count={pageCount} variant="outlined" shape='rounded' color="primary" page={currentPage} onChange={handlePageChange} />
      </Stack>
      </div>
      </Table>
  
  </TableContainer>
  </div>

    </div>
  )
}

export default ExpenditureList