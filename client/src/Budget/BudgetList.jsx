import React, { useContext, useEffect, useState } from 'react'
import { axiosInstance } from '../axios/axios'
import { Button, IconButton, Pagination, TableBody, TableCell, TableContainer, TableHead, TableRow,Paper, Box, Table, Typography, ListItem, ListItemText, List } from '@mui/material'
import { MdAdd } from 'react-icons/md'
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { format } from 'date-fns';
import { AppContext } from '../store/AppProvider';
import Modal from '../components/Modal';

const BudgetList = () => {
  const [budgets,setBudgets] = useState([])
  const [loading,setLoading] = useState(false)
  const [pageCount,setPageCount] = useState(0)
  const [currentPage,setCurrentPage] = useState(1)
  const { handleOpen } = useContext(AppContext);
  const { handleNavigate } = useContext(AppContext);
  const [budgetCategories,setBudgetCategories] = useState([])

  async function retrieveBudgets () {

    const {data}  = await axiosInstance.get('/budget/all?page='+currentPage)
 
    setBudgets(data?.budgets)
    setPageCount(data?.pageCount)
  }


  const fetchBudgetCategories  = async (budgetId) =>{
    try {
      const response = await axiosInstance.get(`/budget/${budgetId}/categories`)
      setBudgetCategories(response.data)   
    } catch (error) {
      console.log(error);
    }
  }

 function handleAction(type,itemId){
    if(type === 'cates'){

      fetchBudgetCategories(itemId)

      handleOpen()
    }else{

    }
  }



  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  function onNavigate(path) {
    handleNavigate(path);
  }

  useEffect(()=>{
 retrieveBudgets()
  },[])



  return (
    <div className="route">

      <Modal title={"Budget Categories"}>
      <Table>
          <TableHead className="table-head">
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name </TableCell>
              <TableCell >Amount</TableCell>
              <TableCell >Total Spent</TableCell>

              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgetCategories?.map((row, idx) => (
              <TableRow
                key={row.id}
                className={idx % 2 !== 0 ? "striped" : ""}
              >
                <TableCell component="th" scope="row">
                  {idx + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                  { row.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.amount }
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.total_amount_spent }
                </TableCell>
                <TableCell>
                  <div className="btn-row">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(row.id)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>


                    <IconButton
                        color="success"
                        onClick={() =>
                          handleNavigate(`/budget/category/${row?.id}/edit`)
                        }
                      >
                        <EditIcon />
                      </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        </Modal>
    <h3 className="page-title">Budgets</h3>
    <div className="content">
      <TableContainer className="table-container" component={Paper}>
        <Box display="flex" className="page-header">
          <Button
            variant="contained"
            color="primary"
            startIcon={<MdAdd />} // Add the Add icon as start icon
            sx={{ marginBottom: 2 }} // Add some margin at the bottom for spacing
            onClick={() => onNavigate("/budget/add")}
          >
            Add Budget
          </Button>
        </Box>
        <Table>
          <TableHead className="table-head">
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell >End Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgets?.map((row, idx) => (
              <TableRow
                key={row.id}
                className={idx % 2 !== 0 ? "striped" : ""}
              >
                <TableCell component="th" scope="row">
                  {idx + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                  { format(new Date(row.start_date), 'MMMM do yyyy') }
                </TableCell>
                <TableCell component="th" scope="row">
                  { format(new Date(row.end_date), 'MMMM do yyyy') }
                </TableCell>
                <TableCell>
                  <div className="btn-row">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(row.id)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>


                    <Button endIcon={<Visibility/>}
                    onClick={()=>handleAction('cates', row.id)}
                    
                    
                    >View Categories</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!budgets?.length && (
          <div className="message-box">No Items Found</div>
        )}

        <div className="pagination-section">
        
            <Pagination
              count={pageCount}
              variant="outlined"
              shape="rounded"
              color="primary"
              page={currentPage}
              onChange={handlePageChange}
            />
        </div>
      </TableContainer>
    </div>
   
   

  </div>
  )
}

export default BudgetList