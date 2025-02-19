import { Button, CircularProgress, Grid, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { axiosInstance } from '../axios/axios'
import { useSnackbar } from 'notistack'
import { AppContext } from '../store/AppProvider'

const EditBudgetCategory = () => {
    const [budgetCategory,setBudgetCategory] = useState()
    const [formData,setFormData] = useState({amount:0})
    const [errors,setErrors] = useState()
    const [loading,setLoading] = useState(false)
    const {handleNavigate} = useContext(AppContext)
  const {enqueueSnackbar} = useSnackbar();

  const {cateId} = useParams()

    async function getBudgetCategory(category){



        const {data} = await axiosInstance.get(`/budget/category/${category}`)
       

        setBudgetCategory(data)
        setFormData({...formData, amount:data?.amount})

    }


   async function submitHandler(event){
        event.preventDefault()

        try {
            setLoading(true)
            
            await axiosInstance.put(`/budget/category/${cateId}/update`, formData)

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
        
                setErrors(errorObject);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                return;
              }
            
        }finally{
            setLoading(false)
        }
    }


    useEffect(()=>{
        if(cateId){
            getBudgetCategory(cateId)
        }
    },[cateId])
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
                
               
                variant="outlined"
                fullWidth
                value={budgetCategory?.name}
                disabled
               />
            </Grid>
          
            <Grid item xs={12} sm={6}>
              <TextField
                label="Amount"
                variant="outlined"
                fullWidth
                value={formData?.amount}
                error={errors?.amount}
                helperText={errors?.amount}
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
                {loading ?  <CircularProgress /> :"Update"}
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  )
}

export default EditBudgetCategory