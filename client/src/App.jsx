import React, { useContext, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
// import axios from 'axios';
import Login from "./login";
import Register from "./Register";
import Home from "./Home";
import { axiosInstance } from "./axios/axios";
import { AuthContext } from "./store/AuthProvider";
import Layout from "./Layout/Layout";
import Bill from "./Bills/Bill";
import Profile from "./Profile";
import ExpenditureList from "./Expenditure/ExpenditureList";
import ExpenditureAdd from "./Expenditure/ExpenditureAdd";
import { useSnackbar } from "notistack";
import AddBill from "./Bills/AddBill";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import OCRComponent from "./TessaractTest";
import NewBudget from "./Budget/NewBudget";
import BudgetList from "./Budget/BudgetList";
import EditBudgetCategory from "./Budget/EditBudgetCategory";
import AddBudgetCategory from "./Budget/AddBudgetCategory";
function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { setIsAuth, isAuth, setAuthUser, authUser } = useContext(AuthContext);

  const { enqueueSnackbar } = useSnackbar();
  const [errors, setErrors] = useState();
  const navigate = useNavigate();
  const handleLogin = async (email, password) => {
    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });
      if (response.data.success) {
        setIsAuth(true);
        setAuthUser(response.data.user);
        localStorage.setItem("auth_user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      }
    } catch (error) {
      if (error?.response?.data?.errors) {
        const errorsArray = error.response.data.errors;
        const errorObject = {};

        errorsArray.forEach((error) => {
          errorObject[error.path] = error.msg;
        });

        console.log(errorObject);

        setErrors(errorObject);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        return;
      }

      enqueueSnackbar(error?.response?.data?.message || "Newtwork Error", {
        variant: "error",
        anchorOrigin: { horizontal: "center", vertical: "bottom" },
      });
    }
  };

  const handleRegister = async (name, username, email, phone, password) => {
    try {
      const response = await axiosInstance.post("/register", {
        name,
        username,
        email,
        phone,
        password,
      });
      if (response.data.success) {
        setIsAuth(true);
        setAuthUser(response.data.user);
        localStorage.setItem("auth_user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      }
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
    }
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login onLogin={handleLogin} errors={errors} />}
      />
      <Route
        path="/register"
        element={
          <Register
            errors={errors}
            setErrors={setErrors}
            onRegister={handleRegister}
          />
        }
      />

      <Route
        path="/dashboard"
        element={
          isAuth ? (
            <Layout>
              <Home />
            </Layout>
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

      <Route 
      path="/expenditure/:expeId/edit"

      element={
        <Layout>
          <ExpenditureAdd />
        </Layout>
      }
      />

      <Route
        path="/expenditure/list"
        element={
          <Layout>
            <ExpenditureList />
          </Layout>
        }
      />

      <Route
        path="/expenditure/add"
        element={
          <Layout>
            <ExpenditureAdd />
          </Layout>
        }
      />

      <Route
        path="/bills/add"
        element={
          <Layout>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <AddBill />
            </LocalizationProvider>
          </Layout>
        }
      />

      <Route
        path="/bills"
        element={
          isAuth ? (
            <Layout>
              <Bill />
            </Layout>
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

<Route
        path="/budget/list"
        element={
          isAuth ? (
            <Layout>
              <BudgetList />
            </Layout>
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/budget/add"
        element={
          isAuth ? (
            <Layout>
              <NewBudget />
            </Layout>
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

<Route
        path="/budget/category/:cateId/edit"
        element={
          isAuth ? (
            <Layout>
              <EditBudgetCategory />
            </Layout>
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

      <Route path="/budget/:budgetId/category/add"  element={<Layout><AddBudgetCategory/> </Layout>} />

      <Route
        path="/profile"
        element={
          isAuth ? (
            <Layout>
              <Profile />
            </Layout>
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

      <Route path='/test' element={<OCRComponent/>}/>
    </Routes>
  );
}

export default App;
