import { Button, CircularProgress, Grid, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../store/AppProvider";
import { AuthContext } from "../store/AuthProvider";
import { enqueueSnackbar } from "notistack";
import { axiosInstance } from "../axios/axios";

const Profile = () => {
  const { authUser, setAuthUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    name: "",
  });
  

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
        setError()
      await axiosInstance.put('/profile/update', formData)

      enqueueSnackbar("Profile Updated", {
        variant: "success",
        anchorOrigin: { horizontal: "center", vertical: "bottom" },
      });

      const newUser = {
        ...authUser,
        name: formData.name,
        phoneNumber: formData?.phone,
      };

      setAuthUser(newUser);
      localStorage.setItem("auth_user", JSON.stringify(newUser));
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

      enqueueSnackbar(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
        {
          variant: "error",
          anchorOrigin: { horizontal: "center", vertical: "bottom" },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      setFormData({
        ...formData,
        name: authUser?.name,
        phone: authUser?.phoneNumber,
        email: authUser?.email,
        username: authUser?.username,
      });
    }
  }, []);
  return (
    <div className="route">
      <h3 className="page-title">My Profile</h3>
      <div className="content">
        <div className="p-form-container">
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="User Name"
                  variant="outlined"
                  disabled
                  fullWidth
                  value={formData?.username}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  variant="outlined"
                  disabled
                  fullWidth
                  value={formData?.email}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  value={formData?.name}
                  helperText={error?.name}
                  error={error?.name}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  variant="outlined"
                  fullWidth
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  error={error?.phone}
                  value={formData?.phone}
                  helperText={error?.phone}
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
                  {loading ? <CircularProgress /> : "Update Profile"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
