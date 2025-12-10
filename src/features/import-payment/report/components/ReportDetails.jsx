import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router-dom";
import ApprovalHistory from "./ApprovalHistory";
import ReportAction from "./ReportAction";
import { userRequest } from "src/requestMethod";
import swal from "sweetalert";
import IMTReportDetails from "./ReportDetail";

const ReportDetailView = () => {
  const { requestNo } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [assigned, setAssigned] = useState(false);
  const [approvalData, setApprovalData] = useState(null);
  const [error, setError] = useState(null);
  const [actionCompleted, setActionCompleted] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user?.email; // use email, not role
  const userRole = user?.userRoles?.[0]?.userType;

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get(`/imt/getFormById?id=${requestNo}`);
        if (res.data?.success && res.data.data) {
          const reportData = res.data.data;
          console.log("reportData",reportData)
          setData(reportData);
          setAssigned(reportData.assigned || false);
          setApprovalData(reportData);
          setError(null);
        } else {
          setError("No data found for this request number");
          swal("Error", "No data found for this request number", "error");
        }
      } catch (error) {
        console.error("Error fetching report details:", error);
        if(res?.data?.success === false){
          swal("Error", "No data found for this request number", "error");
        }
        setError("Something went wrong while fetching report data");
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetails();
  }, [requestNo]);

  const handleBack = () => {
    navigate(`/import-payment/report`);
  };

  const handleActionComplete = async () => {
    setActionCompleted(true);
     try {
        const res = await userRequest.get(`/imt/getFormById?id=${requestNo}`);
        if (res.data?.success && res.data.data) {
          const reportData = res.data.data;
          setData(reportData);
          setAssigned(reportData.assigned || false);
          setApprovalData(reportData);
          setError(null);
        } else {
          setError("No data found for this request number");
          swal("Error", "No data found for this request number", "error");
        }
      } catch (error) {
      console.error("Error refreshing report details:", error);
      setError("Something went wrong while refreshing report data");
    }
  };

  const steps = data?.steps || [];

// Show if user email matches approval email AND status is not Approved or Declined
const canShowAction = steps.some(step =>
  step.approvals?.some(appr =>
    appr?.approverId?.email === userEmail &&
    appr.status !== "Approved" &&
    appr.status !== "Declined"
  )
);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid #e0e0e0",
        backgroundColor: "#fff",
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box sx={{ pl: 3 }}>
          <Typography variant="h5">Report Details</Typography>
          <Box
            sx={{
              height: 2,
              width: "100%",
              background: "#12368d",
              borderRadius: 1,
              mb: 2,
            }}
          />
        </Box>
        <IconButton
          onClick={handleBack}
          sx={{
            color: "#d32f2f",
            "&:hover": { backgroundColor: "#fdecea" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Loader */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
           {/* Report Form (view-only) */}
           <IMTReportDetails defaultValues={data || {}} readOnly />
      {/* Approval History */}

      {!loading && (
        <ApprovalHistory 
          approvalData={approvalData}
          loading={false}
          error={error}
        />
      )}

      {/* Report Action */}
      {userRole === "APPROVER" && 
        canShowAction && 
        !actionCompleted && (
          <ReportAction
            requestNo={data?.requestNo}
            onActionComplete={handleActionComplete}
          />
      )}
    </>
      )}
    </Paper>
  );
};

export default ReportDetailView;


