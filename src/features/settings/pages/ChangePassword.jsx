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
  TextField,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import swal from "sweetalert";

import Iconify from "src/components/iconify";
import { userRequest } from "src/requestMethod";
import { showErrorMessage } from "src/utils/errorUtils";


const changePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export default function ChangePassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });


  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await userRequest.post("/admin/updatePassword", {
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (response.data.success) {
        await swal({
          title: "Success!",
          text: response.data.message || "Password changed successfully!",
          icon: "success",
          button: "OK"
        });
        reset();
      } else {
        showErrorMessage(
          new Error(response.data.message || "Failed to change password"),
          "Password change failed",
          swal
        );
      }
    } catch (err) {
      showErrorMessage(err, "An error occurred while changing password", swal);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Change Password | EFL Finance Controller</title>
      </Helmet>

      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            onClick={() => navigate("/settings")}
            sx={{ mb: 2 }}
          >
            Back to Settings
          </Button>
        </Stack>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                p: 4, 
                height: 'fit-content',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  <Iconify icon="eva:lock-fill" sx={{ color: 'white', fontSize: 32 }} />
                </Box>
                <Typography variant="h4" gutterBottom sx={{ mb: 1, fontWeight: 700, color: 'text.primary' }}>
                  Change Password
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
                  Update your password to keep your account secure
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3.5}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                  Current Password
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your current password"
                  type={showCurrentPassword ? "text" : "password"}
                  {...register("currentPassword")}
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword?.message}
                  disabled={loading}
                  size="large"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          edge="end"
                        >
                          <Iconify
                            icon={
                              showCurrentPassword
                                ? "eva:eye-fill"
                                : "eva:eye-off-fill"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                  New Password
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your new password"
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword")}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                  disabled={loading}
                  size="large"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          <Iconify
                            icon={
                              showNewPassword
                                ? "eva:eye-fill"
                                : "eva:eye-off-fill"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                  Confirm New Password
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Confirm your new password"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  disabled={loading}
                  size="large"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          <Iconify
                            icon={
                              showConfirmPassword
                                ? "eva:eye-fill"
                                : "eva:eye-off-fill"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Stack 
                direction="row" 
                spacing={2} 
                justifyContent="center"
                sx={{ mt: 4, pt: 2 }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate("/settings")}
                  disabled={loading}
                  size="large"
                  sx={{ 
                    minWidth: 120,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  size="large"
                  startIcon={loading && <CircularProgress size={20} />}
                  sx={{ 
                    minWidth: 160,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                    }
                  }}
                >
                  {loading ? "Changing Password..." : "Change Password"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card 
          sx={{ 
            p: 4, 
            height: 'fit-content',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(0,0,0,0.05)',
            bgcolor: 'grey.50'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'info.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}
            >
              <Iconify icon="eva:info-fill" sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 1, fontWeight: 700, color: 'text.primary' }}>
              Password Requirements
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
              Your password must meet the following criteria
            </Typography>
          </Box>

          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: 2,
              mb: 3,
              '& .MuiAlert-icon': {
                fontSize: 20
              }
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'info.main' }}>
                Security Guidelines:
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                  <Iconify icon="eva:checkmark-circle-2-fill" sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                  8 characters minimum
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                  <Iconify icon="eva:checkmark-circle-2-fill" sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                  One uppercase letter (A-Z)
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                  <Iconify icon="eva:checkmark-circle-2-fill" sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                  One lowercase letter (a-z)
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                  <Iconify icon="eva:checkmark-circle-2-fill" sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                  One number (0-9)
                </Typography>
                <Typography component="li" variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Iconify icon="eva:checkmark-circle-2-fill" sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                  One special character (@$!%*?&)
                </Typography>
              </Box>
            </Box>
          </Alert>

          <Box sx={{ p: 3, bgcolor: 'warning.light', borderRadius: 2, mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'warning.dark', display: 'flex', alignItems: 'center' }}>
              <Iconify icon="eva:alert-triangle-fill" sx={{ fontSize: 18, mr: 1 }} />
              Security Tips
            </Typography>
            <Typography variant="body2" color="warning.dark" sx={{ mb: 1 }}>
              • Don't use personal information like names or birthdays
            </Typography>
            <Typography variant="body2" color="warning.dark" sx={{ mb: 1 }}>
              • Avoid common words or patterns
            </Typography>
            <Typography variant="body2" color="warning.dark">
              • Consider using a password manager
            </Typography>
          </Box>
        </Card>
      </Grid>
    </Grid>
  </Container>
    </>
  );
}
