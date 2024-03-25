import React, { useContext, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./login";
import Register from "./Register";
import Home from "./Home";
import { axiosInstance } from "./axios/axios";
import { AuthContext } from "./store/AuthProvider";
import Layout from "./Layout/Layout";
import Bill from "./Bills/Bill";
import Profile from "./profile/Profile";
import ExpenditureList from "./Expenditure/ExpenditureList";
import ExpenditureAdd from "./Expenditure/ExpenditureAdd";
import { useSnackbar } from "notistack";
import AddBill from "./Bills/AddBill";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import OCRComponent from "./TessaractTest";
import NewBudget from "./Budget/NewBudget";
import BudgetList from "./Budget/BudgetList";
import EditBudgetCategory from "./Budget/EditBudgetCategory";
import AddBudgetCategory from "./Budget/AddBudgetCategory";
import Landing from "./Landing";
import AddTestimonial from "./Testimonial/AddTestimonial";
import AdminDashboard from "./Admin/AdminDashboard";
import UserList from "./Admin/UserList";
import Testimonials from "./Admin/Testimonials";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
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
        const role = response.data.user.role
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'user') {
          navigate('/dashboard');
        } 
        enqueueSnackbar("Login Successful", {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "top" },
        });
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

      enqueueSnackbar(error?.response?.data?.message || "Network Error", {
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
        enqueueSnackbar("Account created", {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "bottom" },
        });
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
      <Route path="/" element={<Landing />} />

      {/* user routes */}
      <Route  element={<ProtectedRoute  allowedRoles={["user"]}/>} >
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

      <Route
        path="/budget/:budgetId/category/add"
        element={
          <Layout>
            <AddBudgetCategory />{" "}
          </Layout>
        }
      />

<Route
        path="/testimonial/add"
        element={
          <Layout>
            <AddTestimonial />
          </Layout>
        }
      />
</Route>
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

      <Route
        path="/user/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
      <Route path="/test" element={<OCRComponent />} />


      {/* admin routes */}
      <Route  element={<ProtectedRoute  allowedRoles={["admin"]}/>} >
          {/* <Route path="/" element={<UserDashboard />} /> */}

      <Route
        path="/admin/dashboard"
        element={
          <Layout>
            <AdminDashboard />
          </Layout>
        }
      />
      <Route
        path="/admin/users"
        element={
          <Layout>
            <UserList />
          </Layout>
        }
      />
      <Route
        path="/admin/testimonials"
        element={
          <Layout>
            <Testimonials />
          </Layout>
        }
      />
        </Route>

        <Route path="/unauthorized" element={<h1 className="message-box">Your are not allowed to visit that page</h1>}/>

    </Routes>
  );
}

export default App;
