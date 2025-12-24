import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Container } from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import Divider from "@mui/material/Divider";
import { publicRequest, setTokens, userRequest } from "src/requestMethod";
import { useForm } from "react-hook-form";
import LoginLeftPanel from "src/features/auth/components/LoginLeftPanel";
import { getUser } from "src/utils/userUtils";
import { useCountRefresh } from "src/hooks/useCountRefresh";
import { useAccountContext } from "src/contexts/AccountContext";

export default function OTPVerificationView({ mode = "password-reset" }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [showOTP, setShowOTP] = useState(mode === "2fa"); // For 2FA, OTP is already sent
  const [otpProcessing, setOtpProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const { refreshUserCounts } = useCountRefresh();
  const { refreshAccount } = useAccountContext();

  useEffect(() => {
    if (email) {
      setValue("email", email);
    }
    if (mode === "2fa" && !email) {
      toast.error("Invalid session. Please login again.");
      navigate("/login");
    }
  }, [email, setValue, mode, navigate]);

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

      // Call the sendOtp API endpoint
      await publicRequest.post("/admin/sendOtp", {
        email: data.email,
      });

      console.log("OTP send attempt:", data);
      setShowOTP(true);
      setTimeLeft(30);
      notifySuccess("OTP sent to your email");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setOtpProcessing(false);
    }
  };

  const handleResend2FAOTP = async () => {
    if (timeLeft > 0) {
      toast.info(`Please wait ${timeLeft} seconds before resending OTP`);
      return;
    }

    try {
      setOtpProcessing(true);
      await publicRequest.post("/admin/resendLoginOtp", {
        email: email,
      });
      setTimeLeft(30);
      toast.success("OTP sent to your registered email.");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setOtpProcessing(false);
    }
  };

  const handleVerifyOTP = async (data) => {
    try {
      setOtpProcessing(true);

      if (mode === "2fa") {
        // 2FA verification flow
        const response = await publicRequest.post("/admin/verifyLoginOtp", {
          email: email,
          otp: data.otp,
        });

        const token = response.data?.data;
        
        if (token) {
          setTokens(token);
          const user = await getUser(token);
          refreshAccount();
          await refreshUserCounts(user);
          toast.success(response.data?.message || "Login successfully");
          setTimeout(() => navigate("/"), 1000);
        } else {
          throw new Error("No token received from server");
        }
      } else {
        // Password reset flow
        const otpData = {
          email: data.email,
          otp: data.otp,
        };
        
        const response = await publicRequest.post("/admin/verifyOtp", otpData);
        
        console.log("OTP verification attempt:", otpData);
        console.log("OTP verification response:", response.data);

        notifySuccess("OTP verified successfully");
        navigate("/reset-password", {
          state: { 
            email: data.email, 
            token: response.data?.data || response.data?.token || "verified" 
          },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "OTP verification failed. Please enter a valid 6-digit OTP.");
    } finally {
      setOtpProcessing(false);
    }
  };

  const handleResendOTP = async () => {
    if (mode === "2fa") {
      await handleResend2FAOTP();
      return;
    }

    if (timeLeft === 0) {
      try {
        setOtpProcessing(true);
        
        // Get the current email from the form
        const currentEmail = document.querySelector('input[name="email"]')?.value;
        if (!currentEmail) {
          toast.error("Please enter your email first");
          return;
        }

        // Call the sendOtp API endpoint again
        await publicRequest.post("/admin/sendOtp", {
          email: currentEmail,
        });

        setTimeLeft(30);
        toast.info("OTP resent to your email");
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to resend OTP. Please try again.");
      } finally {
        setOtpProcessing(false);
      }
    }
  };

  const handleLoginDashboard = () => {
    navigate("/login");
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
               variant="h4"
               sx={{
                 mb: 1,
                 textAlign: "center",
                 fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
               }}
             >
               {mode === "2fa" ? "OTP Verification" : "Reset Password"}
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

             <form
               onSubmit={handleSubmit(mode === "2fa" ? handleVerifyOTP : (showOTP ? handleVerifyOTP : handleSendOTP))}
             >
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
                  disabled={showOTP || mode === "2fa"}
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
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 1,
                      px: 2,
                      mt: 0.5,
                      mb: 0.5,
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
                      }}
                      onClick={handleResendOTP}
                    >
                      Resend OTP
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ 
                        color: "text.secondary",
                        fontSize: "0.8rem",
                      }}
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
                   mt: 2,
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

              <Box sx={{ my: 1.5, display: "flex", alignItems: "center" }}>
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
