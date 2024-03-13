import { useContext, useEffect, useState } from "react";

import {
  TextField,
  Button,
  Grid,
  CircularProgress,
  MenuItem,
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { axiosInstance } from "../axios/axios";
import { useSnackbar } from "notistack";
import { AppContext } from "../store/AppProvider";

const AddBill = () => {
  const [expenses, setExpenses] = useState([]);
  const [bills, setBills] = useState([
    { expenseId: null, expense: "", amount: "", due_date: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const { handleNavigate } = useContext(AppContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axiosInstance.get("/expenditure/all?page=all");
        setExpenses(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchExpenses();
  }, []);

  const handleExpenseChange = (index, expenseId) => {
    console.log(index, expenseId);
    const updatedBills = [...bills];
    updatedBills[index].expenseId = expenseId;
    updatedBills[index].expense =
      expenses.find((expense) => expense.id === expenseId)?.name || "";
    updatedBills[index].amount =
      expenses.find((expense) => expense.id === expenseId)?.amount || "";
    setBills(updatedBills);
  };

  const handleDateChange = (index, date) => {
    const updatedBills = [...bills];
    updatedBills[index].due_date = date;
    setBills(updatedBills);
  };

  const addNewBillRow = () => {
    setBills((prevBills) => [
      ...prevBills,
      { expenseId: null, expense: "", amount: "" },
    ]);
  };

  const submitHandler = async () => {
    try {
      setLoading(true);
      const filteredBills = bills.filter((bill) => bill.expenseId !== null);
      const response = await axiosInstance.post("/bills/create", {
        bills: filteredBills,
      });
      console.log(response.data);
      setLoading(false);
      setSnackbarOpen(true);
      enqueueSnackbar("Bills added", {
        anchorOrigin: { vertical: "top", horizontal: "center" },
        variant: "success",
      });

      handleNavigate("/bills");
    } catch (error) {
      console.log(error);
      enqueueSnackbar(
        error?.response?.data?.message ||
          error?.response?.statusText ||
          error?.message,
        {
          anchorOrigin: { horizontal: "center", vertical: "bottom" },
          variant: "error",
        }
      );

      setLoading(false);
    }
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="route">
      <h3 className="page-title">Bills</h3>
      <div className="content">
        <div className="crud-form">
          <div className="form-header">
            <h2 className="form-header">Add Bill</h2>
          </div>
          {bills.map((bill, index) => (
            <Grid container spacing={2} key={index} className="input-row">
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Select Expense"
                  variant="outlined"
                  fullWidth
                  value={bill.expenseId || ""}
                  onChange={(e) => handleExpenseChange(index, e.target.value)}
                >
                  {expenses?.map((expense) => (
                    <MenuItem key={expense.id} value={expense.id}>
                      {expense.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Expenditure Name"
                  variant="outlined"
                  fullWidth
                  value={bill.expense}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Amount"
                  variant="outlined"
                  fullWidth
                  value={bill.amount}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <DatePicker
                  label="Due Date"
                  value={bill.due_date}
                  onChange={(date) => handleDateChange(index, date)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </Grid>
          ))}
          <div className="btn-row">
            <Button variant="contained" onClick={addNewBillRow}>
              New Bill
            </Button>
            <Button
              variant="contained"
              disabled={loading}
              type="button"
              onClick={submitHandler}
              color="primary"
            >
              {loading ? <CircularProgress /> : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBill;
