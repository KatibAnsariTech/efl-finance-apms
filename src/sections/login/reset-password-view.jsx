import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { Container } from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";
import Divider from "@mui/material/Divider";

import Iconify from "src/components/iconify";
import { publicRequest } from "src/requestMethod";
import { useForm } from "react-hook-form";
import loginImage from "../../../public/assets/loginImage.webp";

export default function ResetPasswordView() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetProcessing, setResetProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const newPassword = watch("newPassword", "");

  const getPasswordStrength = (password) => {
    if (!password) return { text: "", color: "" };
    if (password.length < 6) return { text: "Weak", color: "#f44336" };
    if (password.length < 8) return { text: "Fair", color: "#ff9800" };
    if (password.length < 10) return { text: "Good", color: "#4caf50" };
    return { text: "Strong", color: "#2e7d32" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const handleResetPassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setResetProcessing(true);
      await publicRequest.post("/admin/reset-password", {
        email: location.state?.email,
        token: location.state?.token,
        newPassword: data.newPassword,
      });
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.errors || "Failed to reset password.");
    } finally {
      setResetProcessing(false);
    }
  };

  const handleLoginDashboard = () => {
    navigate("/login");
  };

  return (
    <Container maxWidth={false} sx={{ height: "100vh", p: 0 }}>
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100%",
        }}
      >
        {/* Left Panel - Image Background Only */}
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${loginImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",
          }}
        />

        {/* Right Panel - White Background */}
        <Box
          sx={{
            flex: 1,
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
            minHeight: "100vh",
          }}
        >
          <Box sx={{ maxWidth: 400, width: "100%", mx: "auto" }}>
            <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1, color: "text.primary", textAlign: "center" }}>
              Reset Password
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", mb: 4, lineHeight: 1.6, textAlign: "center" }}
            >
              Simplify your workflow and boost your productivity with SpaceToTech's App.
            </Typography>

            <form onSubmit={handleSubmit(handleResetPassword)}>
              <Stack spacing={3} sx={{ maxWidth: 350, mx: "auto" }}>
                <TextField
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          <Iconify
                            icon={showNewPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "25px",
                    },
                  }}
                />

                <TextField
                  label="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  })}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          <Iconify
                            icon={showConfirmPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "25px",
                    },
                  }}
                />

                {newPassword && (
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: passwordStrength.color,
                        fontWeight: "bold",
                      }}
                    >
                      password strength: {passwordStrength.text}
                    </Typography>
                  </Box>
                )}
              </Stack>

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{
                  mt: 3,
                  borderRadius: "25px",
                  py: 1.5,
                  backgroundColor: "black",
                  "&:hover": {
                    backgroundColor: "grey.800",
                  },
                }}
                disabled={resetProcessing}
                loading={resetProcessing}
              >
                Save new password
              </LoadingButton>

              <Box sx={{ my: 3, display: "flex", alignItems: "center" }}>
                <Divider sx={{ flex: 1 }} />
                <Typography variant="body2" sx={{ px: 2, color: "text.secondary" }}>
                  or don't change
                </Typography>
                <Divider sx={{ flex: 1 }} />
              </Box>

              <LoadingButton
                fullWidth
                size="large"
                variant="contained"
                onClick={handleLoginDashboard}
                sx={{
                  borderRadius: "25px",
                  py: 1.5,
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                Login Dashboard
              </LoadingButton>
            </form>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
