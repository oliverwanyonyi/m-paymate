import {
  Grid,
  TextField,
  Button,
  Typography,
  Snackbar,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../axios/axios";
import { AppContext } from "../store/AppProvider";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";

const ExpenditureAdd = () => {
  const [formData, setFormData] = useState({ name: "", amount: "",category:'' });
  const {expeId} = useParams()
  const { snackbarOpen, openSnackbar, closeSnackbar, handleNavigate } =
    useContext(AppContext);

  const {enqueueSnackbar} = useSnackbar();
  const [budgetCategories , setBudgetCategories] = useState([])

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState();
  function changeHandler(field, value) {
    setFormData({ ...formData, [field]: value });
  }


  const fetchBudgetCategories  = async () =>{
    try {
      const response = await axiosInstance.get('/budget/categories')
      setBudgetCategories(response.data)
      
    } catch (error) {
      console.log(error);
    }
  }

  async function submitHandler() {
    try {
      setLoading(true);
      let message;
      if(expeId){

        await axiosInstance.put(`/expenditure/${expeId}/update`, formData);
        message = "Update Successful"
       
        
      }else{
      

       await axiosInstance.post("/expenditure/create", formData);

       message = "Expenditure added"
      }

      enqueueSnackbar(message, {
        variant: "success",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });

      handleNavigate("/expenditure/list");
    } catch (error) {
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
    } finally {
      setLoading(false);
    }
  }

async function getExpenditure(expenditure){
  try {
  const {data} = await axiosInstance.get(`/expenditure/${expenditure}`)

  setFormData({...formData, name:data?.name, amount:data?.amount})
    
  } catch (error) {   
  }

}


  useEffect(()=>{
if(expeId){
    getExpenditure(expeId)
}

fetchBudgetCategories()
  },[])
  return (
    <div className="route">
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={closeSnackbar}
      >
        Expenditure added successfully
      </Snackbar>
      <h3 className="page-title">Expenditures</h3>
      <div className="content">
        <div className="crud-form">
          <div className="form-header">
            <h2 className="form-header">{!expeId? "Add Expenditure":"Update Expenditure"}</h2>
          </div>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
              <TextField
                label="Budget Category"
                select
                variant="outlined"
                fullWidth
                value={formData?.category}
                onChange={(e) => changeHandler("category", e.target.value)}
                error={errors?.category}
                helperText={errors?.category}
          >

{budgetCategories.map(cate=>(<MenuItem value={cate.id}>{cate.name}</MenuItem>))}
            
            </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Expenditure Name"
                variant="outlined"
                fullWidth
                value={formData?.name}
                onChange={(e) => changeHandler("name", e.target.value)}
                error={errors?.name}
                helperText={errors?.name}
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
  );
};

export default ExpenditureAdd;
