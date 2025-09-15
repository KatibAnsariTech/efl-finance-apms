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
import image1 from "../../../public/assets/image1.png";
import companyLogo from "../../../public/assets/spacetotech.png";
import { useForm } from "react-hook-form";
import { useCounts } from "src/contexts/CountsContext";
import LoginLeftPanel from "src/sections/login/LoginLeftPanel";

export default function LoginView() {
  const {
    register,
    handleSubmit,
    setValue,
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
      const response = await publicRequest.post("/admin/login", {
        email: data.email,
        password: data.password,
      });
      
      // Get token directly from login response
      const token = response.data.data || response.data.token;
      if (token) {
        setTokens(token);
        await getUser(token);
        await refreshCounts();
        
        const user = JSON.parse(localStorage.getItem("user"));
        
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

  const getUser = async (token) => {
    try {
      const response = await userRequest.get("/admin/getUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = response?.data?.data;

      if (user?.email && user?.username) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
          })
        );
      } else {
        throw new Error("User data is incomplete");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.errors || "Failed to fetch user data.");
    }
  };


  const handleForgotPassword = () => {
    navigate("/otp-verification");
  };

  const handleContactAdmin = () => {
    toast.info("Contact administrator functionality");
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
