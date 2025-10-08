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
      if (!rowData?._id) {
        console.error("No formId found in rowData");
        setData(null);
        return;
      }

      const response = await userRequest.get(
        `/custom/getFormSteps?formId=${rowData._id}`
      );

      if (response?.data?.statusCode === 200 && response?.data?.data) {
        const apiData = response.data.data;
        const mappedData = {
          requester: apiData.requester,
          steps: apiData.steps.map(step => {
            const actualApprovals = step.approvals.filter(approval => approval.status !== 'Parallel Approved');
            const firstApproval = actualApprovals[0] || step.approvals[0];
            const actualApprovers = actualApprovals.map(approval => approval.approverId);
            const actualStatuses = actualApprovals.map(approval => approval.status);
            const actualComments = actualApprovals.map(approval => approval.comment).filter(Boolean);
            
            return {
              approverId: actualApprovers,
              position: step.position,
              status: actualStatuses.includes('Approved') ? 'Approved' : 
                     actualStatuses.includes('Declined') ? 'Declined' : 'Pending',
              comment: actualComments.join(', ') || '',
              created: firstApproval?.created || step.createdAt,
              createdAt: step.createdAt,
              updatedAt: step.updatedAt
            };
          })
        };
        setData(mappedData);
      } else {
        setData(null);
      }
    } catch (err) {
      console.error("Error fetching form steps:", err);
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

  const renderSteps = (data) => {
    const requesterStep = data?.requester
      ? {
          username: `${data?.requester?.username} (${data?.requester?.email})`,
          status: "Raised",
          comment: "Request submitted",
          created: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      : null;

    let stepsArr = [];
    if (Array.isArray(data?.steps)) {
      stepsArr = data.steps.map((step, idx) => {
        const approvers = step.approverId;
        const displayNames = approvers.map(approver => 
          `${approver?.username || "-"} (${approver?.email || "-"})`
        ).join('\n');
        const displayStatus = step.status || "-";
        const displayComment = step.comment || "-";
        return {
          key: `step-${idx}`,
          assignedTo: displayNames,
          assignedOn: step.created ? fDateTime(step.created) : "N/A",
          actionedOn:
            step.updatedAt && displayStatus !== "Pending"
              ? fDateTime(step.updatedAt)
              : "N/A",
          status: displayStatus,
          comment: displayComment,
        };
      });
    }
    // Compose final steps array
    const allSteps = [
      requesterStep && {
        key: "requester",
        assignedTo: requesterStep.username,
        assignedOn: requesterStep.created
          ? fDateTime(requesterStep.created)
          : "N/A",
        actionedOn: requesterStep.updatedAt
          ? fDateTime(requesterStep.updatedAt)
          : "N/A",
        status: requesterStep.status,
        comment: requesterStep.comment,
      },
      ...stepsArr,
    ].filter(Boolean);

    if (allSteps.length > 0) {
      return allSteps.map((step, idx) => (
        <tr style={{ borderBottom: "1px solid #aeaeae" }} key={step.key || idx}>
          <td style={{ padding: "8px", textAlign: "center", whiteSpace: "pre-line" }}>
            {step.assignedTo}
          </td>
          <td style={{ padding: "8px", textAlign: "center" }}>
            {step.assignedOn}
          </td>
          <td style={{ padding: "8px", textAlign: "center" }}>
            {step.actionedOn}
          </td>
          <td
            style={{
              padding: "8px",
              textAlign: "center",
              ...getStatusStyle(step.status),
            }}
          >
            {formatStatus(step.status)}
          </td>
          <td
            style={{
              padding: "8px",
              textAlign: "center",
              maxWidth: "30dvw",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
            title={step.comment}
          >
            {step.comment}
          </td>
        </tr>
      ));
    }
    return [];
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
              <Typography variant="h5">
                Request No. #{rowData?.requestNo}
              </Typography>
            </Box>
            <Divider sx={{ borderStyle: "solid" }} />
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100px",
                }}
              >
                <CircularProgress />
              </div>
            ) : data ? (
              <>
                <table
                  className="status-table"
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.875rem",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#003a95", color: "#fff" }}>
                      <th
                        style={{
                          borderBottom: "1px solid #ddd",
                          padding: "6px",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                        }}
                      >
                        Assigned To
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #ddd",
                          padding: "6px",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                        }}
                      >
                        Assigned On
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #ddd",
                          padding: "6px",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                        }}
                      >
                        Actioned On
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #ddd",
                          padding: "6px",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #ddd",
                          padding: "6px",
                          fontSize: "0.875rem",
                          fontWeight: "600",
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
