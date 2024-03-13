import React, { useState } from "react";
import { Button, CircularProgress, Snackbar, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 370px;
`;

const Input = styled(TextField)`
  margin-bottom: 16px;
  width: 100%;
`;

const LoginButton = styled(Button)`
  margin-top: 16px;
`;

const Login = ({ onLogin,errors }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading,setLoading] = useState(false)
  const handleSubmit = (event) => {
  
      setLoading(true)
      event.preventDefault();
      onLogin(formData.email, formData.password);
   
      setLoading(false)
    
  };

  function changeHandler(value, name) {
    setFormData({ ...formData, [name]: value });
  }

  return (
    <Container>

    
    
      <Typography variant="h4" component="h1">
        Login 
      </Typography>


      <Form onSubmit={handleSubmit}>
        <Input
          label="Email"
          value={formData.email}
          onChange={(event) => changeHandler(event.target.value, "email")}
          error={errors?.email}
          helperText={errors?.email}

        />
       
        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(event) => changeHandler(event.target.value, "password")}
          error={errors?.password}
          helperText={errors?.password}
        />
        <LoginButton disabled={loading} variant="contained" color="primary" type="submit">
        {loading ? <CircularProgress/> :" Login"}
        </LoginButton>
        <p>
          Don't have an account? <Link to="/Register">Register</Link>
        </p>
      </Form>
    </Container>
  );
};

export default Login;
