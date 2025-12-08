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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  OutlinedInput,
  Chip,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import swal from "sweetalert";

import { useAccount } from "src/hooks/use-account";
import Iconify from "src/components/iconify";
import { userRequest } from "src/requestMethod";
import { showErrorMessage } from "src/utils/errorUtils";

const profileSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  projectType: yup.array().min(1, "At least one project type is required"),
});

export default function AddUser() {
  const navigate = useNavigate();
  const account = useAccount();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileImg, setprofileImg] = useState(null);
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
      projectType: [],
    },
  });

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("project", "fcm");

        const response = await userRequest.post("/util/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          setprofileImg(response.data.data);
          setImagePreview(response.data.data);
          await swal({
            title: "Success!",
            text: "Image uploaded successfully!",
            icon: "success",
            button: "OK",
          });
        } else {
          throw new Error(response.data.msg || "Upload failed");
        }
      } catch (error) {
        showErrorMessage(error, "Failed to upload image", swal);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleRemoveImage = () => {
    setprofileImg(null);
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const userData = {
        ...data,
        profileImg: profileImg,
        password: "password123",
        projectType: data.projectType,
      };

      const response = await userRequest.post("/admin/createAdmin", userData);
      if (response.data.success) {
        await swal({
          title: "Success!",
          text: response.data.message || "User added successfully!",
          icon: "success",
          button: "OK",
        });

        setValue("username", "");
        setValue("email", "");
        setValue("projectType", []);
        setprofileImg(null);
        setImagePreview(null);
      }
    } catch (err) {
      showErrorMessage(err, "An error occurred while adding user", swal);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add User</title>
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
              <Box sx={{ mb: 2 }}>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Avatar
                    src={imagePreview}
                    alt="Profile Preview"
                    sx={{ width: 120, height: 120, mx: "auto" }}
                  >
                    {watch("username")?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>
                  {imagePreview && (
                    <IconButton
                      onClick={handleRemoveImage}
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bgcolor: "error.main",
                        color: "white",
                        "&:hover": { bgcolor: "error.dark" },
                      }}
                      size="small"
                    >
                      <Iconify icon="eva:close-fill" />
                    </IconButton>
                  )}
                </Box>
              </Box>

              <Box sx={{ mb: 1 }}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="profile-image-upload"
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="profile-image-upload">
                  <Button
                    type="button"
                    variant="outlined"
                    component="span"
                    disabled={uploading || loading}
                    startIcon={
                      uploading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Iconify icon="eva:camera-fill" />
                      )
                    }
                  >
                    {uploading ? "Uploading..." : "Upload Photo"}
                  </Button>
                </label>
              </Box>

              <Typography variant="body2" color="text.secondary">
                Click to upload profile image
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Add New User
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

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!errors.projectType}>
                      <InputLabel id="project-type-label">
                        Project Type
                      </InputLabel>
                      <Select
                        labelId="project-type-label"
                        multiple
                        input={<OutlinedInput label="Project Type" />}
                        value={watch("projectType") || []}
                        onChange={(e) =>
                          setValue("projectType", e.target.value)
                        }
                        disabled={loading}
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                          >
                            {selected.map((value) => {
                              const label =
                                value === "CRD"
                                  ? "Credit Deviation"
                                  : value === "JVM"
                                  ? "JVM"
                                  : value === "CPX"
                                  ? "Capex"
                                  : value === "CUSTOM"
                                  ? "Custom Duty"
                                  : value === "IMT"
                                  ? "Import Payment"
                                  : value;
                              return (
                                <Chip
                                  key={value}
                                  label={label}
                                  onDelete={() =>
                                    setValue(
                                      "projectType",
                                      (watch("projectType") || []).filter(
                                        (v) => v !== value
                                      )
                                    )
                                  }
                                  onMouseDown={(event) => {
                                    event.stopPropagation();
                                  }}
                                />
                              );
                            })}
                          </Box>
                        )}
                      >
                        <MenuItem value="CRD">Credit Deviation</MenuItem>
                        <MenuItem value="JVM">JVM</MenuItem>
                        <MenuItem value="CPX">Capex</MenuItem>
                        <MenuItem value="CUSTOM">Custom Duty</MenuItem>
                        <MenuItem value="IMT">Import Payment</MenuItem>
                        {/* <MenuItem value="PC">Petty Cash</MenuItem> */}
                      </Select>
                      {errors.projectType && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 0.5, ml: 1.5 }}
                        >
                          {errors.projectType.message}
                        </Typography>
                      )}
                    </FormControl>
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
                        {loading ? "Adding User..." : "Add User"}
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
