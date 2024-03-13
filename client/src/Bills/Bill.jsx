import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../store/AppProvider'
import { Box, Button, IconButton, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { MdAdd } from 'react-icons/md'
import { axiosInstance } from '../axios/axios'
import PaymentIcon from "@mui/icons-material/Payments";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {format} from 'date-fns'
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


      async function handleDelete(itemeId){
        try {
          await axiosInstance.delete(`/bills/${itemeId}/delete`)
          setData(prev=>{
            return prev.filter(item=>item.id !== itemeId)
          })
        } catch (error) {
          console.log(error);
        }
      }

     async function getData(){
   const {data} =await axiosInstance.get(`/bills/all?page=${currentPage}`)
   
   
   setPageCount(data.pageCount)
   setData(data.bills)
      }



useEffect(()=>{
getData()
}, [currentPage])



  return (
    <div className="route">
<h3 className="page-title">Bills</h3>
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
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data?.map((row,idx) => (
          <TableRow key={row.id} className={idx % 2 !== 0 ? 'striped' : ''}>
            <TableCell component="th" scope="row">
              {idx+1}
            </TableCell>
            <TableCell component="th" scope="row">
              {row.expense}
            </TableCell>
            <TableCell align="right">Ksh{row.amount}</TableCell>

            <TableCell align="right">{format(row.due_date, 'yyyy/MM/dd', { timeZone: 'Africa/Nairobi' })}</TableCell>


            <TableCell align="right">{row.status}</TableCell>

            <TableCell align="right">Ksh {row.amount - (row.balance || 0)}</TableCell>


            <TableCell>
            <div className="btn-row">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(row.id)}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>

                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PaymentIcon />}
                      >
                        Pay
                      </Button>


                     
                    </div>
             
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
     
      </Table>
      {!data?.length && <div className='message-box'>No Items Found</div>}

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