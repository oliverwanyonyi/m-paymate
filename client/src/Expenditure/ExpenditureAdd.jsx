import {
  Grid,
  TextField,
  Button,
  Typography,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { useContext, useState } from "react";
import { axiosInstance } from "../axios/axios";
import { AppContext } from "../store/AppProvider";
import { useSnackbar } from "notistack";

const ExpenditureAdd = () => {
  const [formData, setFormData] = useState({ name: "", amount: "" });
  const { snackbarOpen, openSnackbar, closeSnackbar, handleNavigate } =
    useContext(AppContext);
  const {enqueueSnackbar} = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState();
  function changeHandler(field, value) {
    setFormData({ ...formData, [field]: value });
  }

  async function submitHandler() {
    try {
      setLoading(true);

      await axiosInstance.post("/expenditure/create", formData);

      enqueueSnackbar("Expenditure added", {
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
            <h2 className="form-header">Add Expenditure</h2>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Expenditure Name"
                variant="outlined"
                fullWidth
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
                {loading ? <CircularProgress /> : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default ExpenditureAdd;
