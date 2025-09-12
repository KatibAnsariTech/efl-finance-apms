import React, { useState, useEffect } from "react";
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
// import { publicRequest, setTokens, userRequest } from "src/requestMethod";
import { useForm } from "react-hook-form";
// import { useCounts } from "src/contexts/CountsContext";
import LoginLeftPanel from "src/sections/login/LoginLeftPanel";

export default function OTPVerificationView() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [showOTP, setShowOTP] = useState(false);
  const [otpProcessing, setOtpProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const navigate = useNavigate();
  const location = useLocation();
  // const { refreshCounts } = useCounts(); // Commented out for development

  const email = location.state?.email || "";

  useEffect(() => {
    if (email) {
      setValue("email", email);
    }
  }, [email, setValue]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const notifySuccess = (message) => toast.success(message);

  const handleSendOTP = async (data) => {
    try {
      setOtpProcessing(true);

      // API call commented out for development
      // await publicRequest.post("/admin/forgot-password", {
      //   email: data.email,
      // });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful OTP send
      console.log("OTP send attempt:", data);
      setShowOTP(true);
      setTimeLeft(60);
      notifySuccess("OTP sent to your email");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setOtpProcessing(false);
    }
  };

  const handleVerifyOTP = async (data) => {
    try {
      setOtpProcessing(true);

      // API call commented out for development
      // const otpData = {
      //   email: data.email,
      //   otp: Number(data.otp),
      // };
      // const res = await publicRequest.post("/admin/verifyOTP", otpData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock OTP verification (accept any 6-digit OTP)
      const otpData = {
        email: data.email,
        otp: Number(data.otp),
      };
      console.log("OTP verification attempt:", otpData);

      if (data.otp && data.otp.length === 6) {
        notifySuccess("OTP verified successfully");
        navigate("/reset-password", {
          state: { email: data.email, token: "mock-token-123" },
        });
      } else {
        throw new Error("Invalid OTP format");
      }
    } catch (error) {
      console.error(error);
      toast.error("OTP verification failed. Please enter a valid 6-digit OTP.");
    } finally {
      setOtpProcessing(false);
    }
  };

  const handleResendOTP = () => {
    if (timeLeft === 0) {
      setTimeLeft(60);
      // Resend OTP logic here
      toast.info("OTP resent to your email");
    }
  };

  const handleLoginDashboard = () => {
    navigate("/new-login");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
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
              variant="h3"
              sx={{
                mb: 1,
                textAlign: "center",
                fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
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
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              Simplify your workflow and boost your productivity with
              SpaceToTech's App.
            </Typography>

            <form
              onSubmit={handleSubmit(showOTP ? handleVerifyOTP : handleSendOTP)}
            >
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
                  disabled={showOTP}
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

                {showOTP && (
                  <TextField
                    label="OTP"
                    type="text"
                    {...register("otp", {
                      required: "OTP is required",
                      validate: (value) =>
                        /^\d{6}$/.test(value) || "OTP must be a 6-digit number",
                    })}
                    error={!!errors.otp}
                    helperText={errors.otp?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ mr: 1 }}>
                          <IconButton edge="end">
                            <Iconify icon="eva:eye-fill" />
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
                )}

                {showOTP && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          timeLeft === 0 ? "primary.main" : "text.secondary",
                        cursor: timeLeft === 0 ? "pointer" : "default",
                        textDecoration: timeLeft === 0 ? "underline" : "none",
                        fontWeight: "bold",
                        fontSize: "0.8rem",
                        ml: 2,
                      }}
                      onClick={handleResendOTP}
                    >
                      Resend OTP
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {formatTime(timeLeft)}
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
                disabled={otpProcessing}
                loading={otpProcessing}
              >
                {showOTP ? "Confirm OTP" : "Send OTP"}
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
