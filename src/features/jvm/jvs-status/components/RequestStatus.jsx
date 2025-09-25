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
      if (!rowData?.groupId) {
        console.error("No groupId found in rowData");
        setData(null);
        return;
      }

      const response = await userRequest.get(`jvm/getSteps?groupId=${rowData.groupId}`);
      
      if (response.data.statusCode === 200) {
        setData(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch steps data");
      }
    } catch (err) {
      console.error("Error fetching steps data:", err);
      setData(null);
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
      default:
        return status;
    }
  };

  // Map steps array from the new API response structure
  const renderSteps = (data) => {
    if (!data || !Array.isArray(data.steps)) {
      return <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No steps data available</td></tr>;
    }

    return data.steps.map((step, idx) => {
      const displayStatus = step.status || "-";
      const displayComment = step.comment || "-";
      const assignedOn = step.created ? fDateTime(step.created) : "-";
      const actionedOn = step.updatedAt && displayStatus !== "Pending" 
        ? fDateTime(step.updatedAt) 
        : "-";

      return (
        <tr style={{ borderBottom: "1px solid #aeaeae" }} key={`step-${idx}`}>
          <td style={{ padding: "6px", textAlign: "center", fontSize: "0.875rem" }}>
            {step.approverId || "-"}
          </td>
          <td style={{ padding: "6px", textAlign: "center", fontSize: "0.875rem" }}>
            {assignedOn}
          </td>
          <td style={{ padding: "6px", textAlign: "center", fontSize: "0.875rem" }}>
            {actionedOn}
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
              <Typography variant="h5">Request No. #{rowData?.groupId}</Typography>
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
              <>
                <table
                  className="status-table"
                  style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#003a95", color: "#fff" }}>
                      <th
                        style={{
                          borderBottom: "1px solid #ddd",
                          padding: "6px",
                          fontSize: "0.875rem",
                          fontWeight: "600"
                        }}
                      >
                        Assigned To
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #ddd",
                          padding: "6px",
                          fontSize: "0.875rem",
                          fontWeight: "600"
                        }}
                      >
                        Assigned On
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #ddd",
                          padding: "6px",
                          fontSize: "0.875rem",
                          fontWeight: "600"
                        }}
                      >
                        Actioned On
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #ddd",
                          padding: "6px",
                          fontSize: "0.875rem",
                          fontWeight: "600"
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #ddd",
                          padding: "6px",
                          fontSize: "0.875rem",
                          fontWeight: "600"
                        }}
                      >
                        Comment
                      </th>
                    </tr>
                  </thead>
                  <tbody>{renderSteps(data)}</tbody>
                </table>
              </>
            ) : (
              <p>No data available</p>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
}
