import React, { useContext, useEffect, useState } from "react";
import { Avatar, Button, CircularProgress, Snackbar, TextField, Typography } from "@mui/material";
import { Link,useLocation,useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import logo from './assets/m-paymate.png'
import { AuthContext } from "./store/AuthProvider";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
    width: 400px;
  
  margin:0 auto;
  box-shadow: 0 5px 15px rgba(0,0,0,.15);
  padding:20px;
  border-radius:10px;
`;


const Input = styled(TextField)`
  margin-bottom: 16px;
  width: 100%;
`;

const LoginButton = styled(Button)`
  margin-top: 16px;
  margin-bottom:16px;
`;

const Login = ({ onLogin,errors }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading,setLoading] = useState(false)
  const {authUser} = useContext(AuthContext)
  const handleSubmit = (event) => {

  
      setLoading(true)
      event.preventDefault();
      onLogin(formData.email, formData.password);
   
      setLoading(false)
    
  };

  function changeHandler(value, name) {
    setFormData({ ...formData, [name]: value });
  }



  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleRedirect = () => {
      if (authUser) {
        const role = authUser?.role

        if (role === 'admin') {
          const from = location.state?.from?.pathname || '/admin/dashboard';
          navigate(from, { replace: true });
        } else if (role === 'user') {
          const from = location.state?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        } else {
         
          console.error('Unknown user role');
        }
      }
    };

    handleRedirect();
  }, [authUser]);

  return (
    <Container>

    
    
      


      <Form onSubmit={handleSubmit}>
        <div className="auth-header">
        <Typography variant="h4" component="h1">
       <img src={logo} className="auth-logo" />
      </Typography>

      <Typography variant="body1" gutterBottom>
      Login to continue
      </Typography>
        </div>

     
        <Input
          label="Email or Username"
          value={formData.email}
          onChange={(event) => changeHandler(event.target.value, "email")}
          error={errors?.email}
          helperText={errors?.email}
          placeholder="Email Or Username"
        />
      
       
        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(event) => changeHandler(event.target.value, "password")}
          error={errors?.password}
          helperText={errors?.password}
          placeholder="********"
        />
        <LoginButton disabled={loading} variant="contained" color="primary" type="submit">
        {loading ? <CircularProgress/> :" Login"}
        </LoginButton>
        <p className="info">
          Don't have an account? <Link to="/Register">Register</Link>
        </p>
      </Form>
    </Container>
  );
};

export default Login;
