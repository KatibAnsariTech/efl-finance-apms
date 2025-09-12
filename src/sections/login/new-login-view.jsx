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
import { publicRequest, setTokens, userRequest } from "src/requestMethod";
import { useForm } from "react-hook-form";
import { useCounts } from "src/contexts/CountsContext";
import loginImage from "../../../public/assets/loginImage.webp";

export default function NewLoginView() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loginProcessing, setLoginProcessing] = useState(false);
  const navigate = useNavigate();
  const { refreshCounts } = useCounts();

  const notifySuccess = (message) => toast.success(message);

  const handleLogin = async (data) => {
    try {
      setLoginProcessing(true);
      await publicRequest.post("/admin/login", {
        email: data.email,
        password: data.password,
      });
      navigate("/otp-verification", { state: { email: data.email } });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.errors || "Login failed.");
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
    <Container maxWidth={false} className="new-login-container">
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          // width: "100%",
          padding:3

        }}
      >
        {/* Left Panel - Image Background Only */}
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${loginImage})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#f5faf4",
            borderRadius:3,
            backgroundPositionY:10
          }}
        />

        {/* Right Panel - White Background */}
        <Box 
          sx={{ 
            flex: 1, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            padding: 4,
            // minHeight: "100vh",
          }}
        >
          <Box sx={{ maxWidth: 400, width: "100%", mx: "auto" }}>
            <Typography className="new-login-typography-primary" variant="h3" sx={{ mb: 1, textAlign: "center" }}>
              Welcome back!
            </Typography>
            <Typography
              className="new-login-typography-secondary"
              variant="body1"
              sx={{ mb: 4, lineHeight: 1.6, textAlign: "center" }}
            >
              Simplify your workflow and boost your productivity with SpaceToTech's App.
            </Typography>

            <form onSubmit={handleSubmit(handleLogin)}>
              <Stack spacing={3} sx={{ mx: "auto" }}>
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
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          <Iconify
                            icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
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

                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "primary.main",
                      cursor: "pointer",
                      textDecoration: "underline",
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
                className="new-login-button new-login-button-black"
                sx={{ mt: 3, py: 1.5 }}
                disabled={loginProcessing}
                loading={loginProcessing}
              >
                Login
              </LoadingButton>

              <Box sx={{ my: 3, display: "flex", alignItems: "center" }}>
                <Divider className="new-login-divider" sx={{ flex: 1 }} />
                <Typography className="new-login-typography-secondary" variant="body2" sx={{ px: 2 }}>
                  or need access
                </Typography>
                <Divider className="new-login-divider" sx={{ flex: 1 }} />
              </Box>

              <LoadingButton
                fullWidth
                size="large"
                variant="contained"
                onClick={handleContactAdmin}
                className="new-login-button new-login-button-blue"
                sx={{ py: 1.5 }}
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
