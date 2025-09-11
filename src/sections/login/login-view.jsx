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

import Iconify from "src/components/iconify";
import { publicRequest, setTokens, userRequest } from "src/requestMethod";
import image1 from "../../../public/assets/image1.png";
import companyLogo from "../../../public/assets/spacetotech.png";
import { useForm } from "react-hook-form";
import { useCounts } from "src/contexts/CountsContext";

export default function LoginView() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOtp] = useState(false);
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
      setShowOtp(true);
      // notifySuccess('Login successful, OTP sent to email.');
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

  const handleVerifyOTP = async (data) => {
    try {
      setLoginProcessing(true);
      const otpData = {
        email: data.email,
        otp: Number(data.otp),
      };
      const res = await publicRequest.post("/admin/verifyOTP", otpData);
      notifySuccess("Login successful");
      const token = res.data.data;
      setTokens(token);
      await getUser(token);
      await refreshCounts();
      const user = JSON.parse(localStorage.getItem("user"));
      let navigateUrl = "/";
      if (user?.userType === "APPROVER") {
        navigateUrl = "/approvals";
      } else if (user?.userType === "REQUESTER") {
        navigateUrl = "/request";
      } else if (user?.userType === "ADMIN") {
        navigateUrl = "/master-sheet";
      } else if (user?.userType === "SUPER_ADMIN") {
        navigateUrl = "/master";
      }
      setTimeout(() => navigate(navigateUrl), 2000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.errors || "OTP verification failed.");
    } finally {
      setLoginProcessing(false);
    }
  };

  const resetEmail = () => {
    setValue("email", "");
    setShowOtp(false);
  };

  return (
    <Container>
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "94vh",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img
            src={image1}
            alt="Background"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
              marginLeft: "-200px",
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card sx={{ p: 5, maxWidth: 800, width: 500 }}>
            <Typography variant="h4" style={{ marginBottom: "10px" }}>
              SignIn
            </Typography>
            <form
              onSubmit={handleSubmit(showOTP ? handleVerifyOTP : handleLogin)}
            >
              <Stack spacing={3}>
                <TextField
                  label="Email Address"
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
                />
                {showOTP ? (
                  <>
                    <TextField
                      label="OTP"
                      type="number"
                      {...register("otp", {
                        required: "OTP is required",
                        validate: (value) =>
                          /^\d{6}$/.test(value) ||
                          "OTP must be a 6-digit number",
                      })}
                      error={!!errors.otp}
                      helperText={errors.otp?.message}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "primary.main",
                        cursor: "pointer",
                        textDecoration: "underline",
                        textAlign: "right",
                      }}
                      onClick={resetEmail}
                    >
                      Change email
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#c62828", mt: 1 }}
                    >
                      OTP has been shared to your email.
                    </Typography>
                  </>
                ) : (
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
                              icon={
                                showPassword
                                  ? "eva:eye-fill"
                                  : "eva:eye-off-fill"
                              }
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              </Stack>
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="inherit"
                sx={{ mt: 3 }}
                disabled={loginProcessing}
                loading={loginProcessing}
              >
                {showOTP ? "Verify" : "Login"}
              </LoadingButton>
            </form>
          </Card>
        </Box>
      </Box>
      <Typography
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{ fontWeight: "bolder", marginTop: "1px", fontSize: "13px" }}
        >
          powered by
        </span>{" "}
        <img
          style={{ width: "180px", marginLeft: "10px" }}
          onClick={() => window.open("https://spacetotech.com/", "_blank")}
          src={companyLogo}
          alt="companylogo"
        />
      </Typography>
    </Container>
  );
}
