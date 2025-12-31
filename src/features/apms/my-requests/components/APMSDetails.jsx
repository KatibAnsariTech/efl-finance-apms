import React from "react";
import {
  Box,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useParams, useNavigate } from "react-router-dom";
import APMSRequestDetails from "./APMSDetail";
import ApprovalHistory from "./ApprovalHistory";

/* 🔹 DUMMY REQUEST DATA */
const dummyMyRequests = [
  {
    _id: "1",
    requestNo: "APMS-REQ-002",
    createdAt: "2025-01-08T14:15:00Z",
    advanceType: "Non-PO Expense",
    purpose: "Client meeting travel expenses",
    requestedAmount: 12000,
    approvedAmount: 10000,
    status: "approved",
  },
  {
    _id: "2",
    requestNo: "APMS-REQ-003",
    createdAt: "2025-01-10T09:45:00Z",
    advanceType: "ADHOC Advance",
    purpose: "Emergency vendor payment",
    requestedAmount: 25000,
    approvedAmount: null,
    status: "pending",
  },
];

/* 🔹 DUMMY APPROVAL HISTORY */
const dummyApprovalData = {
  requester: {
    username: "Kaitb Ansari",
    email: "kaitb.ansari@company.com",
  },
  createdAt: "2025-01-05T10:30:00Z",
  steps: [
    {
      approvals: [
        {
          approverId: {
            username: "Finance Manager",
            email: "finance.manager@company.com",
          },
          status: "Approved",
          comment: "Approved as per policy",
          created: "2025-01-06T09:00:00Z",
          updated: "2025-01-06T10:00:00Z",
        },
      ],
    },
    {
      approvals: [
        {
          approverId: {
            username: "Accounts Head",
            email: "accounts.head@company.com",
          },
          status: "Pending",
          comment: null,
          created: "2025-01-07T11:00:00Z",
          updated: null,
        },
      ],
    },
  ],
};

export default function RequestDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const data = dummyMyRequests.find((item) => item._id === id);

  if (!data) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* 🔹 REQUEST DETAILS */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          border: "1px solid #e0e0e0",
          backgroundColor: "#fff",
          mb: 3,
        }}
      >
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <IconButton
            onClick={() => navigate("/apms/my-requests")}
            sx={{
              color: "#d32f2f",
              "&:hover": { backgroundColor: "#fdecea" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <APMSRequestDetails defaultValues={data} />
      </Paper>

      {/* 🔹 APPROVAL HISTORY */}
      <ApprovalHistory
        approvalData={dummyApprovalData}
        loading={false}
        error={null}
      />
    </>
  );
}
