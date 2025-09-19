import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";
import { userRequest } from "src/requestMethod";
import { fDate, fDateTime } from "src/utils/format-time";
import { Button, Divider, Typography } from "@mui/material";
import { useAccount } from "src/hooks/use-account";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 5,
  borderRadius: 2,
  width: "85dvw",
  maxHeight: "80vh",
  overflowY: "auto",
};

export default function RequestStatus({
  open,
  onClose,
  rowData,
  getRequestData,
  selectedTab,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const account = useAccount();

  const getData = async () => {
    setLoading(true);
    try {
      const dummyData = {
        formId: {
          requesterRemark: "Custom duty payment request for import goods",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T10:30:00Z"
        },
        requesterId: {
          username: "shweta@efl.com"
        },
        steps: [
          {
            username: "shweta@efl.com",
            status: "Raised",
            comment: "Custom duty payment request for import goods",
            created: "2024-01-15T10:30:00Z",
            updatedAt: "2024-01-15T10:30:00Z"
          },
          {
            username: "manager@efl.com",
            status: "Approved",
            comment: "Approved for processing",
            created: "2024-01-15T11:00:00Z",
            updatedAt: "2024-01-15T11:00:00Z"
          },
          {
            username: "finance@efl.com",
            status: "Processed",
            comment: "Payment processed successfully",
            created: "2024-01-15T14:30:00Z",
            updatedAt: "2024-01-15T14:30:00Z"
          }
        ]
      };
      
      setData(dummyData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      getData();
    }
  }, [open]);

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return { color: "green", fontWeight: "bold" };
      case "pending":
        return { color: "orange", fontWeight: "bold" };
      case "declined":
        return { color: "red", fontWeight: "bold" };
      case "processed":
        return { color: "blue", fontWeight: "bold" };
      case "raised":
        return { color: "purple", fontWeight: "bold" };
      default:
        return { color: "gray", fontWeight: "bold" };
    }
  };

  const formatStatus = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "Approved";
      case "declined":
        return "Declined";
      case "pending":
        return "Pending";
      case "processed":
        return "Processed";
      case "raised":
        return "Raised";
      default:
        return status;
    }
  };

  const renderSteps = (data) => {
    const requesterStep = data?.formId
      ? {
          username: data?.requesterId?.username || "-",
          status: "Raised",
          comment: data?.formId.requesterRemark || "-",
          created: data?.formId.createdAt,
          updatedAt: data?.formId.updatedAt,
        }
      : null;

    let stepsArr = [];
    if (Array.isArray(data?.steps)) {
      stepsArr = data.steps.map((step) => ({
        username: step.username || "-",
        status: step.status || "-",
        comment: step.comment || "-",
        created: step.created || step.updatedAt || "-",
        updatedAt: step.updatedAt || "-",
      }));
    }

    const allSteps = requesterStep ? [requesterStep, ...stepsArr] : stepsArr;

    return allSteps.map((step, index) => {
      const displayStatus = step.status || "-";
      const displayComment = step.comment || "-";
      const displayDate = step.updatedAt || step.created || "-";

      return (
        <tr key={index}>
          <td
            style={{
              padding: "6px",
              textAlign: "center",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            {step.username}
          </td>
          <td
            style={{
              padding: "6px",
              textAlign: "center",
              fontSize: "0.875rem",
            }}
          >
            {fDateTime(displayDate)}
          </td>
          <td
            style={{
              padding: "6px",
              textAlign: "center",
              fontSize: "0.875rem",
              ...getStatusStyle(displayStatus),
            }}
          >
            {formatStatus(displayStatus)}
          </td>
          <td
            style={{
              padding: "6px",
              textAlign: "center",
              maxWidth: "30dvw",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              fontSize: "0.875rem",
            }}
            title={displayComment}
          >
            {displayComment}
          </td>
        </tr>
      );
    });
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        keepMounted
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <div className="modal-content">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Typography variant="h5">Request No. #{rowData?.requestNo}</Typography>
            </Box>
            <Divider sx={{ borderStyle: "solid" }} />
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                }}
              >
                <CircularProgress />
              </div>
            ) : data ? (
              <div style={{ marginTop: "20px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    border: "1px solid #ddd",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                      <th
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          border: "1px solid #ddd",
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                        }}
                      >
                        User
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          border: "1px solid #ddd",
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                        }}
                      >
                        Date
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          border: "1px solid #ddd",
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          border: "1px solid #ddd",
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                        }}
                      >
                        Comment
                      </th>
                    </tr>
                  </thead>
                  <tbody>{renderSteps(data)}</tbody>
                </table>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                }}
              >
                <Typography>No data available</Typography>
              </div>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 3,
              }}
            >
              <Button variant="contained" onClick={onClose}>
                Close
              </Button>
            </Box>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
