import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../store/AppProvider'
import { Box, Button, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { MdAdd } from 'react-icons/md'
import { axiosInstance } from '../axios/axios'

const Bill = () => {
  const {handleNavigate} = useContext(AppContext)
const [currentPage,setCurrentPage] = useState(1)
const [data,setData] = useState([])
    const [pageCount,setPageCount] = useState(0)
 

      function onNavigate(path){
        handleNavigate(path)
      }

      const handlePageChange = (event,value) =>{

        setCurrentPage(value)
      }


     async function getExpenditures(){
   const {data} =await axiosInstance.get(`/bills/all?page=${currentPage}`)
   console.log(data);
   setPageCount(data.pageCount)
   setData(data.bills)
      }



useEffect(()=>{
getExpenditures()
}, [currentPage])



  return (
    <div className="route">
<h3 className="page-title">bills</h3>
<div className="content">
    <TableContainer className='table-container' component={Paper}>

    <Box display="flex" className="page-header">
    <Button
        variant="contained"
        color="primary"
        startIcon={<MdAdd />} // Add the Add icon as start icon
        sx={{ marginBottom: 2 }} // Add some margin at the bottom for spacing
    
    onClick={()=>onNavigate('/bills/add')}
    >
        Add Bill
      </Button>

      </Box>
    <Table>
      <TableHead className='table-head'>
        <TableRow>
        <TableCell>#</TableCell>
          <TableCell>Expense</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Due Date</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Balance</TableCell>

          <TableCell align="right">Amount</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {expenditures?.map((row,idx) => (
          <TableRow key={row.id} className={idx % 2 !== 0 ? 'striped' : ''}>
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
     
      </Table>
      {!expenditures?.length && <div className='message-box'>No Items Found</div>}

      <div className="pagination-section">
      <Stack spacing={2}>
      <Pagination count={pageCount} variant="outlined" shape='rounded' color="primary" page={currentPage} onChange={handlePageChange} />
      </Stack>
      </div>

  
  </TableContainer>



  </div>

    </div>
  )
}

export default Bill