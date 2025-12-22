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
import image1 from "../../../../public/assets/image1.png";
import companyLogo from "../../../../public/assets/spacetotech.png";
import { useForm } from "react-hook-form";
import { useCountRefresh } from "src/hooks/useCountRefresh";
import { useAccountContext } from "src/contexts/AccountContext";
import LoginLeftPanel from "src/features/auth/components/LoginLeftPanel";
import { getUser } from "src/utils/userUtils";
import { initiateAzureLogin } from "src/utils/azureAuth";

export default function LoginView() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loginProcessing, setLoginProcessing] = useState(false);
  const [azureLoginProcessing, setAzureLoginProcessing] = useState(false);
  const navigate = useNavigate();
  const { refreshUserCounts } = useCountRefresh();
  const { refreshAccount } = useAccountContext();

  const notifySuccess = (message) => toast.success(message);

  const handleLogin = async (data) => {
    try {
      setLoginProcessing(true);
      const response = await publicRequest.post("/admin/login", {
        email: data.email,
        password: data.password,
      });
      const token = response.data.data || response.data.token;
      if (token) {
        setTokens(token);
        const user = await getUser(token);
        refreshAccount();
        await refreshUserCounts(user);
        notifySuccess("Login successful!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        throw new Error("No token received from server");
      }
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
    toast.info("Contact administrator");
  };

  const handleAzureLogin = () => {
    setAzureLoginProcessing(true);
    // Redirect to backend Azure login endpoint
    // Backend will handle the Azure AD redirect
    initiateAzureLogin();
    // Note: We don't set processing to false here because the redirect will navigate away
    // The AzureRedirectHandler component will handle the completion
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
          <Box sx={{ maxWidth: { xs: "100%", sm: 400, md: 420 }, width: "100%", mx: "auto" }}>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 1, 
                textAlign: "center",
                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" }
              }}
            >
              Welcome back!
            </Typography>
            <Typography
              variant="body2"
              sx={{ 
                mb: 2, 
                lineHeight: 1.6, 
                textAlign: "center",
                fontSize: { xs: "0.75rem", sm: "0.875rem" }
              }}
            >
              Simplify your workflow and boost your productivity with
              SpaceToTech's App.
            </Typography>

            <form onSubmit={handleSubmit(handleLogin)}>
              <Stack spacing={{ xs: 1, sm: 1.5, md: 1.5 }} sx={{ mx: "auto" }}>
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
                       fontSize: { xs: "0.875rem", sm: "1rem" },
                     },
                     "& .MuiInputLabel-root": {
                       fontSize: { xs: "0.8rem", sm: "0.875rem" },
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
                       fontSize: { xs: "0.875rem", sm: "1rem" },
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
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
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
                      fontSize: { xs: "0.875rem", sm: "1rem" },
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
                  mt: 2,
                  borderRadius: "25px",
                  py: { xs: 1.5, sm: 1.5, md: 1.5 },
                  fontSize: { xs: "0.875rem", sm: "1rem" },
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

              <Box sx={{ my: 1.5, display: "flex", alignItems: "center" }}>
                <Divider sx={{ flex: 1 }} />
                <Typography variant="body2" sx={{ px: 2, fontSize: "0.8rem" }}>
                  or
                </Typography>
                <Divider sx={{ flex: 1 }} />
              </Box>

              <LoadingButton
                fullWidth
                size="large"
                variant="outlined"
                onClick={handleAzureLogin}
                disabled={azureLoginProcessing}
                loading={azureLoginProcessing}
                startIcon={
                  <Box
                    component="img"
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 23 23'%3E%3Cpath fill='%23f25022' d='M0 0h11v11H0z'/%3E%3Cpath fill='%2300a4ef' d='M12 0h11v11H12z'/%3E%3Cpath fill='%237fba00' d='M0 12h11v11H0z'/%3E%3Cpath fill='%23ffb900' d='M12 12h11v11H12z'/%3E%3C/svg%3E"
                    alt="Microsoft"
                    sx={{ width: 20, height: 20, mr: 0.5 }}
                  />
                }
                sx={{
                  borderRadius: "25px",
                  py: { xs: 1.5, sm: 1.5, md: 1.5 },
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  borderColor: "#0078d4",
                  color: "#0078d4",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#005a9e",
                    backgroundColor: "rgba(0, 120, 212, 0.04)",
                  },
                }}
              >
                Sign in with Microsoft
              </LoadingButton>

              <Box sx={{ my: 1.5, display: "flex", alignItems: "center" }}>
                <Divider sx={{ flex: 1 }} />
                <Typography variant="body2" sx={{ px: 2, fontSize: "0.8rem" }}>
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
                  py: { xs: 1.5, sm: 1.5, md: 1.5 },
                  fontSize: { xs: "0.875rem", sm: "1rem" },
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
