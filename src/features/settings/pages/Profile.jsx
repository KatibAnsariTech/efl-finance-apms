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
import { getUser } from "src/utils/userUtils";

// ----------------------------------------------------------------------

const profileSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  projectType: yup.string().optional(),
});

export default function Profile() {
  const navigate = useNavigate();
  const account = useAccount();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileImg, setProfileImg] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
      projectType: "",
    },
  });

  useEffect(() => {
    if (account) {
      setValue("username", account.username || "");
      setValue("email", account.email || "");
      setValue("projectType", account.projectType || "");
    }
  }, [account, setValue]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await userRequest.post("/util/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          const imageUrl = response.data.data;
          setProfileImg(imageUrl);
          setImagePreview(imageUrl);
          
           try {
             const profileData = {
               profileImg: imageUrl
             };
            
            const profileResponse = await userRequest.put("/admin/updateProfile", profileData);
            
            if (profileResponse.data.success) {
              const token = localStorage.getItem("accessToken");
              await getUser(token);
              
              await swal({
                title: "Success!",
                text: "Profile photo updated successfully!",
                icon: "success",
                button: "OK"
              });
            } else {
              throw new Error(profileResponse.data.message || "Failed to update profile");
            }
          } catch (profileError) {
            await swal({
              title: "Warning!",
              text: "Image uploaded but profile update failed. Please try updating your profile again.",
              icon: "warning",
              button: "OK"
            });
          }
        } else {
          throw new Error(response.data.message || "Failed to upload image");
        }
      } catch (error) {
        await swal({
          title: "Error!",
          text: error.response?.data?.message || "Failed to upload image",
          icon: "error",
          button: "OK"
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await userRequest.put("/admin/updateProfile", data);
      if (response.data.success) {
        const token = localStorage.getItem("accessToken");
        await getUser(token);
        
        await swal({
          title: "Success!",
          text: "Profile updated successfully!",
          icon: "success",
          button: "OK"
        });
      } else {
        swal("Error", response.data.message || "Failed to update profile", "error");
      }
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
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, textAlign: "center" }}>
              <Avatar
                src={imagePreview || account?.photoURL}
                alt={account?.displayName}
                sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
              >
                {account?.displayName?.charAt(0).toUpperCase()}
              </Avatar>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="profile-image-upload"
                type="file"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              <label htmlFor="profile-image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  size="small"
                  disabled={uploading}
                  startIcon={uploading ? <CircularProgress size={16} /> : <Iconify icon="eva:camera-fill" />}
                  sx={{
                    mb: 1,
                    textTransform: "none",
                    fontSize: "12px",
                    minWidth: "140px",
                  }}
                >
                  {uploading ? "Uploading..." : "Update Photo"}
                </Button>
              </label>
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
                     disabled
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
                      disabled
                    />
                  </Grid>


                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Project Type"
                      {...register("projectType")}
                      error={!!errors.projectType}
                      helperText={errors.projectType?.message}
                      disabled
                    />
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
