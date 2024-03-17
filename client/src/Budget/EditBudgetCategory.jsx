import { Button, CircularProgress, Grid, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const EditBudgetCategory = () => {
    const [budgetCategory,setBudgetCategory] = useState()
    const [formData,setFormData] = useState({amount:0})
    const [errors,setErrors] = useState()
    const [loading,setLoading] = useState(false)
  const {cateId} = useParams()

    async function getBudgetCategory(category){

        const {data} = axiosInstance.get(`/category/${category}`)

        setBudgetCategory(data)
        setFormData({...formData, amount:data?.amout})

    }


   async function submitHandler(event){
        event.preventDefault()
    }


    useEffect(()=>{
        if(cateId){
            getBudgetCategory(cateId)
        }
    },[])
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
                label="Budget Category"
               
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
                onChange={(e) => changeHandler("amount", e.target.value)}
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
                {loading ?  <CircularProgress /> : expeId?"Update": "Submit"}
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  )
}

export default EditBudgetCategory