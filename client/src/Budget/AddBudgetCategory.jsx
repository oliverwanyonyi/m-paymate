import { Button, CircularProgress, Grid, MenuItem, TextField } from '@mui/material'
import React, { useContext, useState } from 'react'
import { axiosInstance } from '../axios/axios'
import { AppContext } from '../store/AppProvider'
import { useSnackbar } from 'notistack'
import { useParams } from 'react-router-dom'

const AddBudgetCategory = () => {
    const [budgetCategory,setBudgetCategory] = useState()
    const [formData,setFormData] = useState({categpry:'', amount:0})
    const [error,setError] = useState()
    const [loading,setLoading] = useState(false)
    const {handleNavigate} = useContext(AppContext)
  const {enqueueSnackbar} = useSnackbar();

  const {budgetId} = useParams()

  
  const budgetCategories = [
    'Housing (Rent/Mortgage)',
    'Utilities (Electricity, Water, Gas)',
    'Transportation (Car Payment, Public Transportation)',
    'Food (Groceries, Dining Out)',
    'Insurance (Health, Life, Auto)',
    'Debt Payments (Credit Cards, Loans)',
    'Entertainment (Movies, Streaming Services)',
    'Healthcare (Doctor Visits, Medications)',
    'Savings (Emergency Fund, Retirement)',
    'Miscellaneous (Clothing, Gifts, Hobbies)'
];


   async function submitHandler(event){
        event.preventDefault()

        try {
            setLoading(true)
            
            await axiosInstance.post(`/budget/${budgetId}/category/add`, formData)

            enqueueSnackbar("Budget Category updated", {
                variant: "success",
                anchorOrigin: {
                  vertical: "top",
                  horizontal: "center",
                },
              });

             handleNavigate('/budget/list')

        } catch (error) {
            console.log(error);
            if (error?.response?.data?.errors) {
                const errorsArray = error.response.data.errors;
                const errorObject = {};
        
                errorsArray.forEach((error) => {
                  errorObject[error.path] = error.msg;
                });
        
                setError(errorObject);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                return;
              }
            
        }finally{
            setLoading(false)
        }
    }


  
  return (
    <div className="route">
     
      <h3 className="page-title">BudgetCategory</h3>
      <div className="content">
        <div className="crud-form">
          <div className="form-header">
            <h2 className="form-header">Updating Budget Category</h2>
          </div>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
          <TextField
                  select
                  label="Select budget Category"
                  variant="outlined"
                  fullWidth
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name:e.target.value})}
                  error={error?.name}
                  helperText={
                    error?.name
                  }
                  style={{ flex: 1 }}
                >
                 {budgetCategories.map(cate=>(
                  <MenuItem value={cate} key={cate}>{cate}</MenuItem>

                 ))}
                  
                </TextField>
            </Grid>
          
            <Grid item xs={12} sm={6}>
              <TextField
                label="Amount"
                variant="outlined"
                fullWidth
                value={formData?.amount}
                error={error?.amount}
                helperText={error?.amount}
                onChange={(e) => setFormData({...formData, amount:e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                disabled={loading}
                type="button"
                onClick={submitHandler}
                color="primary"
              >
                {loading ?  <CircularProgress /> :"Add Category"}
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  )
}

export default AddBudgetCategory