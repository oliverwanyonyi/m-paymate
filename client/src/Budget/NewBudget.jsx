import React, { useContext, useState } from "react";
import { TextField, MenuItem, Button, Grid, Box } from "@mui/material";
import { axiosInstance } from "../axios/axios";
import { useSnackbar } from "notistack";
import { AppContext } from "../store/AppProvider";

const NewBudget = () => {
  const [categories, setCategories] = useState([{ name: "", amount: "" }]);
  const [errors, setErrors] = useState([]);
  const {enqueueSnackbar} = useSnackbar();
 const {handleNavigate} = useContext(AppContext)

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

  const handleAddRow = () => {
    setCategories([...categories, { name: "", amount: "" }]);
  };

  const handleRemoveRow = (indexToRemove) => {
    setCategories(categories.filter((_, index) => index !== indexToRemove));
  };

  const handleChange = (index, key, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index][key] = value;
    setCategories(updatedCategories);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.post("/budget/create", {
        categories,
      });
     
      enqueueSnackbar("Budget Created", {variant:'success', anchorOrigin:{horizontal:'center',vertical:'top'}})

      handleNavigate('/budget/list')
    } catch (error) {
      
      if (error.response && error.response.status === 422) {
      
        setErrors(error.response.data.errors);
      } else {
        enqueueSnackbar(error?.response?.data?.message || error?.message || 'Something went wrong', {variant:'error', anchorOrigin:{horizontal:'center',vertical:'bottom',
        autoHideDuration: 1000
      
      }})

      }
    }
  };

  return (
    <div className="route">
      <h3 className="page-title">Budget</h3>
      <div className="content">
        <div className="crud-form">
          <div className="form-header">
            <h2 className="form-header">Add Budget</h2>
          </div>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {categories.map((category, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "center",
                  padding: "8px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "4px",
                }}
              >
                <TextField
                  select
                  label="Budget Category"
                  variant="outlined"
                  value={category.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  error={errors.some(
                    (error) => error.path === `categories[${index}].name`
                  )}
                  helperText={
                    errors.find(
                      (error) => error.path === `categories[${index}].name`
                    )?.msg
                  }
                  style={{ flex: 1 }}
                >
                 {budgetCategories.map(cate=>(
                  <MenuItem value={cate} key={cate}>{cate}</MenuItem>

                 ))}
                  
                </TextField>
                <TextField
                  label="Amount"
                  variant="outlined"
                  type="number"
                  value={category.amount}
                  onChange={(e) =>
                    handleChange(index, "amount", e.target.value)
                  }
                  error={errors.some(
                    (error) => error.path === `categories[${index}].amount`
                  )}
                  helperText={
                    errors.find(
                      (error) => error.path === `categories[${index}].amount`
                    )?.msg
                  }
                  style={{ width: "150px" }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveRow(index)}
                  style={{ marginLeft: "auto" }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <div style={{ display: "flex", gap: "16px" }}>
              <Button variant="outlined" onClick={handleAddRow}>
                New Category
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewBudget;
