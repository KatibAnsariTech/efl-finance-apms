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
import { publicRequest, setTokens, userRequest } from "src/requestMethod";
import { useForm } from "react-hook-form";
import { useCounts } from "src/contexts/CountsContext";
import loginImage from "../../../public/assets/loginImage.webp";

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
  const { refreshCounts } = useCounts();

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
      await publicRequest.post("/admin/forgot-password", {
        email: data.email,
      });
      setShowOTP(true);
      setTimeLeft(60);
      notifySuccess("OTP sent to your email");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.errors || "Failed to send OTP.");
    } finally {
      setOtpProcessing(false);
    }
  };

  const handleVerifyOTP = async (data) => {
    try {
      setOtpProcessing(true);
      const otpData = {
        email: data.email,
        otp: Number(data.otp),
      };
      const res = await publicRequest.post("/admin/verifyOTP", otpData);
      notifySuccess("OTP verified successfully");
      navigate("/reset-password", { state: { email: data.email, token: res.data.data } });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.errors || "OTP verification failed.");
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
    navigate("/login");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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

            <form onSubmit={handleSubmit(showOTP ? handleVerifyOTP : handleSendOTP)}>
              <Stack spacing={3} sx={{ maxWidth: 350, mx: "auto" }}>
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
                  }}
                />

                {showOTP && (
                  <TextField
                    label="Enter OTP shared to registered email"
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
                        <InputAdornment position="end">
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
                    }}
                  />
                )}

                {showOTP && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: timeLeft === 0 ? "primary.main" : "text.secondary",
                        cursor: timeLeft === 0 ? "pointer" : "default",
                        textDecoration: timeLeft === 0 ? "underline" : "none",
                      }}
                      onClick={handleResendOTP}
                    >
                      resend OTP
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
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
