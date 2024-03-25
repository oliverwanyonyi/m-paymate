import { useContext, useEffect, useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Switch,
  FormControl,
  Rating,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { AuthContext } from "../store/AuthProvider";
import { enqueueSnackbar } from "notistack";
import { axiosInstance } from "../axios/axios";

const AddTestimonial = () => {
  const { authUser } = useContext(AuthContext);
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [formData, setFormData] = useState({
    isAnonymous: false,
    name: '',
    rating: 5,
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAnonymousChange = (e) => {
    const isAnonymous = e.target.checked;
    setFormData((prevData) => ({
      ...prevData,
      isAnonymous,
      name: isAnonymous ? "Anonymous" : authUser?.name,
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setFormData((prevData) => ({
      ...prevData,
      rating: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axiosInstance.post('/testimonials/add', formData)
      enqueueSnackbar("Testimonial Added", {
        variant: "success",
        anchorOrigin: { horizontal: "center", vertical: "bottom" },
      });

      setFormData(
        {
          isAnonymous: false,
          name: authUser?.name,
          rating: 5,
          description: "",
        }
      )
    } catch (error) {
      if (error?.response?.data?.errors) {
        const errorsArray = error.response.data.errors;
        const errorObject = {};

        errorsArray.forEach((error) => {
          errorObject[error.path] = error.msg;
        });

        setError(errorObject);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(authUser){
setFormData({...formData, name:authUser?.name})
    }
  },[authUser])
  return (
    <div className="route">
      <h3 className="page-title">Testimonials</h3>
      <div className="content">
        <div className="crud-form">
          <div className="form-header">
            <h2 className="form-header">Add Testimonial</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item sm={12} md={12}>
                <Switch
                  checked={formData.isAnonymous}
                  onChange={handleAnonymousChange}
                  name="isAnonymous"
                  color="primary"
                />
                Anonymous
              </Grid>
              <Grid item sm={12} md={12}>
                <TextField
                  label={formData?.isAnonymous ? "" : "Name"}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  disabled={formData.isAnonymous}
                   
                  error={error?.name}
                  helperText={error?.name}
                />
              </Grid>
              <Grid item sm={12} md={12}>
                <FormControl fullWidth >
                  <TextField
                    select
                    label="Rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={1.5}>1.5</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={2.5}>2.5</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={3.5}>3.5</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={4.5}>4.5</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                  </TextField>
                </FormControl>
                <Rating
                  name="rating"
                  value={formData.rating}
                  onChange={handleRatingChange}
                  precision={0.5}
                />
              </Grid>
              <Grid item sm={12} md={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  fullWidth
                  rows={4}
                  error={error?.description}
                  helperText={error?.description}
                />
              </Grid>
              <Grid item sm={12} md={12}>
                <Button type="submit" disabled={loading} variant="contained" color="primary">
               {  loading ? <CircularProgress/>:" Submit"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>{" "}
    </div>
  );
};

export default AddTestimonial;
