/*
 * DEVELOPMENT MODE - API calls are commented out
 * This component uses local state and mock responses for UI development
 * To enable API calls, uncomment the API imports and replace mock logic with actual API calls
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
// import { publicRequest, setTokens, userRequest } from "src/requestMethod";
import { useForm } from "react-hook-form";
// import { useCounts } from "src/contexts/CountsContext";
import LoginLeftPanel from "src/sections/login/LoginLeftPanel";

export default function NewLoginView() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loginProcessing, setLoginProcessing] = useState(false);
  const navigate = useNavigate();
  // const { refreshCounts } = useCounts(); // Commented out for development

  const notifySuccess = (message) => toast.success(message);

  const handleLogin = async (data) => {
    try {
      setLoginProcessing(true);

      // API call commented out for development
      // await publicRequest.post("/admin/login", {
      //   email: data.email,
      //   password: data.password,
      // });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful login
      console.log("Login attempt:", data);
      toast.success("Login successful! Redirecting to OTP verification...");

      navigate("/otp-verification", { state: { email: data.email } });
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoginProcessing(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/otp-verification");
  };

  const handleContactAdmin = () => {
    // Handle contact administrator action
    toast.info("Contact administrator functionality");
  };

  return (
    <Container maxWidth={false} sx={{ backgroundColor: "white" }}>
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          padding: 3,
          backgroundColor: "white",
        }}
      >
        {/* Left Panel - Image Background Only */}
        <LoginLeftPanel />

         {/* Right Panel - White Background */}
         <Box
           sx={{
             flex: 1,
             backgroundColor: "white",
             display: "flex",
             alignItems: "center",
             justifyContent: "center",
             padding: 4,
           }}
         >
          <Box sx={{ maxWidth: 400, width: "100%", mx: "auto" }}>
            <Typography variant="h3" sx={{ mb: 1, textAlign: "center" }}>
              Welcome back!
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 2, lineHeight: 1.6, textAlign: "center" }}
            >
              Simplify your workflow and boost your productivity with
              SpaceToTech's App.
            </Typography>

            <form onSubmit={handleSubmit(handleLogin)}>
              <Stack spacing={2} sx={{ mx: "auto" }}>
                <TextField
                  label="Official Email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email format",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
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
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ mr: 1 }}>
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          <Iconify
                            icon={
                              showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
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

                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "black",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                    onClick={handleForgotPassword}
                  >
                    Forgot Password?
                  </Typography>
                </Box>
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
                disabled={loginProcessing}
                loading={loginProcessing}
              >
                Login
              </LoadingButton>

              <Box sx={{ my: 2, display: "flex", alignItems: "center" }}>
                <Divider sx={{ flex: 1 }} />
                <Typography variant="body2" sx={{ px: 2 }}>
                  or need access
                </Typography>
                <Divider sx={{ flex: 1 }} />
              </Box>

              <LoadingButton
                fullWidth
                size="large"
                variant="contained"
                onClick={handleContactAdmin}
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
                Contact Administrator
              </LoadingButton>
            </form>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
