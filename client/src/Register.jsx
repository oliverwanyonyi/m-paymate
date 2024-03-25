import React, { useContext, useEffect, useState } from 'react';
import { Button,  CircularProgress,  TextField, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from './assets/m-paymate.png'
import { AuthContext } from './store/AuthProvider';

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
  margin-bottom: 10px;
  width:100%;
`;

const RegisterButton = styled(Button)`
margin-top: 16px;
margin-bottom:16px;
`;


const ErrorMessage = styled.div`
  color: red;
  margin-top: 2px; 
  margin-bottom:10px;
text-align:left;
`;

const validateUsername = (username) => {
  // Regular expression to check for spaces
  const spaceRegex = /\s/;
  // Regular expression to check for letters
  const letterRegex = /[a-zA-Z]/;
  // Regular expression to check for numbers
  const numberRegex = /\d/;
  
  // Check if username contains spaces
  if (spaceRegex.test(username)) {
    return "Username should not contain spaces.";
  }

  // Check if username contains at least one letter
  if (!letterRegex.test(username)) {
    return "Username should contain letters.";
  }

  // Check if username contains at least one number
  if (!numberRegex.test(username)) {
    return "Username should contain at least one number.";
  }

  // If username passes all validations
  return null;
};



const Register = ({ onRegister,errors,setErrors }) => {

  const navigate = useNavigate();
  const location = useLocation();

   const [loading,setLoading] = useState(false)
  const [formData,setFormData] = useState({
    name:'',
    username:'',
    email:'',
    phone:'',
    password:''
  })
  


  const {authUser} = useContext(AuthContext)
  const handleSubmit = (event) => {
   setLoading(true)
    setErrors()
      event.preventDefault();
      onRegister(formData.name, formData.username,formData.email, formData.phone,formData.password);
  
  setLoading(false)
  };

  function changeHandler(value,name){
    setFormData({...formData, [name]:value})
  }



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
     Create account continue Here
      </Typography>
        </div>
        <Input
          label="Name"
          value={formData.name}
          onChange={(event) => changeHandler(event.target.value, "name")}
          error={errors?.name}
          helperText={errors?.name}
        />
         {/* {errors?.name && <ErrorMessage>{errors.name}</ErrorMessage>} */}
        <Input
          label="User Name"
          placeholder='e.g johndoe200'
          value={formData.username}
          onChange={(event) => {
            const value = event.target.value;
            const error = validateUsername(value);
            setErrors((prevErrors) => ({
              ...prevErrors,
              username: error,
            }));
            changeHandler(value, "username");
          }}

          error={errors?.username}
          helperText={errors?.username}
        />
        <Input
          label="Email"
          value={formData.email}
          onChange={(event) => changeHandler(event.target.value, "email")}
          error={errors?.email}
          helperText={errors?.email}
        />
        
        <Input
          label="Phone"
          value={formData.phone}
          onChange={(event) => changeHandler(event.target.value, "phone")}
          error={errors?.phone}
          helperText={errors?.phone}
        />
        
        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(event) => changeHandler(event.target.value, "password")}
          error={errors?.password}
          helperText={errors?.password}
        />
        
       <RegisterButton variant="contained" color="primary" type="submit" disabled={loading}>
          {loading ? <CircularProgress size={24}/>:"Register"}
        </RegisterButton> 
        <p className="info">Already have an account <Link to="/login">Login</Link></p>
      </Form>
    </Container>
  );
};

export default Register;