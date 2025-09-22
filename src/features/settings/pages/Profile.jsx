import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Container,
  Typography,
  Grid,
  Button,
  Stack,
  Avatar,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import swal from "sweetalert";

import { useAccount } from "src/hooks/use-account";
import Iconify from "src/components/iconify";
import { userRequest } from "src/requestMethod";

// ----------------------------------------------------------------------

const profileSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  //   firstName: yup.string().required("First name is required"),
  //   lastName: yup.string().required("Last name is required"),
  projectType: yup.string().optional(),
});

export default function Profile() {
  const navigate = useNavigate();
  const account = useAccount();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      username: "",
      email: "",
      //   firstName: "",
      //   lastName: "",
      projectType: "",
    },
  });

  useEffect(() => {
    if (account) {
      setValue("username", account.username || "");
      setValue("email", account.email || "");
      //   setValue("firstName", account.firstName || "");
      //   setValue("lastName", account.lastName || "");
      setValue("projectType", account.projectType || "");
    }
  }, [account, setValue]);


  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // const response = await userRequest.put("/user/profile", data);
      // if (response.data.success) {
      //   // Update local storage with new data
      //   const updatedUser = { ...account, ...data };
      //   localStorage.setItem("user", JSON.stringify(updatedUser));
      //   // Refresh the page to update the account context
      //   window.location.reload();
      // } else {
      //   swal("Error", response.data.message || "Failed to update profile", "error");
      // }
      
      // Simulate success for now
      await swal({
        title: "Success!",
        text: "Profile updated successfully!",
        icon: "success",
        button: "OK"
      });
    } catch (err) {
      await swal({
        title: "Error!",
        text: err.response?.data?.message || "An error occurred while updating profile",
        icon: "error",
        button: "OK"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>My Profile</title>
      </Helmet>

      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 5 }}>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            onClick={() => navigate("/settings")}
          >
            Back to Settings
          </Button>
        </Stack>

        <Grid container spacing={3}>
          {/* Profile Picture */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, textAlign: "center" }}>
              <Avatar
                src={account?.photoURL}
                alt={account?.displayName}
                sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
              >
                {account?.displayName?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {account?.username || account?.displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {account?.email}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
               <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                 Personal Information
               </Typography>

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      {...register("username")}
                      error={!!errors.username}
                      helperText={errors.username?.message}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      {...register("email")}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      disabled={loading}
                    />
                  </Grid>

                  {/* <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      {...register("firstName")}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      {...register("lastName")}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      disabled={loading}
                    />
                  </Grid> */}

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Project Type"
                      {...register("projectType")}
                      error={!!errors.projectType}
                      helperText={errors.projectType?.message}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="flex-end"
                    >
                      <Button
                        variant="outlined"
                        onClick={() => navigate("/settings")}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20} />}
                      >
                        {loading ? "Updating..." : "Update Profile"}
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
