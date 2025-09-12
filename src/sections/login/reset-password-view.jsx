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
// API imports commented out for development
// import { publicRequest } from "src/requestMethod";
import { useForm } from "react-hook-form";
import LoginLeftPanel from "src/sections/login/LoginLeftPanel";

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
      // await publicRequest.post("/admin/reset-password", {
      //   email: location.state?.email,
      //   token: location.state?.token,
      //   newPassword: data.newPassword,
      // });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful password reset
      const resetData = {
        email: location.state?.email,
        token: location.state?.token,
        newPassword: data.newPassword,
      };
      console.log("Password reset attempt:", resetData);

      toast.success("Password reset successfully! Redirecting to login...");

      // Simulate redirect delay
      setTimeout(() => {
        navigate("/new-login");
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setResetProcessing(false);
    }
  };

  const handleLoginDashboard = () => {
    navigate("/new-login");
  };

  return (
    <Container maxWidth={false} sx={{ backgroundColor: "white" }}>
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          paddingY: { xs: 1, sm: 2, md: 3 },
          backgroundColor: "white",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          sx={{
            flex: { xs: 0.4, sm: 0.5, md: 1 },
            minHeight: { xs: "200px", sm: "300px", md: "auto" },
          }}
        >
          <LoginLeftPanel />
        </Box>

        <Box
          sx={{
            flex: { xs: 1, md: 1 },
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: { xs: 2, sm: 3, md: 4 },
            minHeight: { xs: "100vh", md: "auto" },
          }}
        >
          <Box
            sx={{
              maxWidth: { xs: "100%", sm: 400, md: 400 },
              width: "100%",
              mx: "auto",
            }}
          >
             <Typography
               variant="h4"
               sx={{
                 mb: 1,
                 textAlign: "center",
                 fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
               }}
             >
               Reset Password
             </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 2,
                lineHeight: 1.6,
                textAlign: "center",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Simplify your workflow and boost your productivity with
              SpaceToTech's App.
            </Typography>

            <form onSubmit={handleSubmit(handleResetPassword)}>
              <Stack spacing={2} sx={{ mx: "auto" }}>
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
                      <InputAdornment position="end" sx={{ mr: 1 }}>
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "25px",
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.875rem",
                      transform: "translate(20px, 20px) scale(1)",
                      "&.Mui-focused": {
                        transform: "translate(20px, -9px) scale(0.75)",
                      },
                      "&.MuiFormLabel-filled": {
                        transform: "translate(20px, -9px) scale(0.75)",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      paddingLeft: "24px",
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
                   error={!!errors.confirmPassword || (watch("confirmPassword") && newPassword !== watch("confirmPassword"))}
                   helperText={errors.confirmPassword?.message || (watch("confirmPassword") && newPassword !== watch("confirmPassword") ? "Passwords do not match" : "")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ mr: 1 }}>
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "25px",
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.875rem",
                      transform: "translate(20px, 20px) scale(1)",
                      "&.Mui-focused": {
                        transform: "translate(20px, -9px) scale(0.75)",
                      },
                      "&.MuiFormLabel-filled": {
                        transform: "translate(20px, -9px) scale(0.75)",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      paddingLeft: "24px",
                    },
                  }}
                />

                {newPassword && (
                  <Box sx={{ textAlign: "left" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.primary",
                        fontWeight: "bold",
                        fontSize: "0.8rem",
                        ml: 2,
                      }}
                    >
                      Password strength :{" "}
                      <span
                        style={{
                          fontWeight: "bold",
                          color: passwordStrength.color,
                        }}
                      >
                        {passwordStrength.text}{" "}
                      </span>
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

              <Box sx={{ my: 2, display: "flex", alignItems: "center" }}>
                <Divider sx={{ flex: 1 }} />
                <Typography variant="body2" sx={{ px: 2 }}>
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
                  backgroundColor: "#013594",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#002366",
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
