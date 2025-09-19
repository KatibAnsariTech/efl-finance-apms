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
      // For demo purposes, using dummy data
      // In production, uncomment the API call below
      // const res = await userRequest.get(
      //   `/admin/getFormSteps?id=${rowData?._id}`
      // );
      // setData(res?.data?.data);
      
      // Dummy data for demonstration
      const dummyData = {
        formId: {
          requesterRemark: "Custom duty payment request for import goods",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T10:30:00Z"
        },
        requesterId: {
          username: "john.doe"
        },
        steps: [
          {
            approverId: {
              username: "shweta.more"
            },
            position: "Finance Manager",
            status: "Pending",
            comment: "kjjjjjjjjjjjjjjjj",
            created: "2024-01-15T11:00:00Z",
            updatedAt: null
          },
          {
            approverId: {
              username: "rajesh.kumar"
            },
            position: "Senior Finance Manager",
            status: "Pending",
            comment: "Awaiting approval",
            created: "2024-01-15T12:00:00Z",
            updatedAt: null
          },
          {
            approverId: {
              username: "priya.sharma"
            },
            position: "Finance Director",
            status: "Pending",
            comment: "Final approval required",
            created: "2024-01-15T13:00:00Z",
            updatedAt: null
          }
        ]
      };
      
      setData(dummyData);
    } catch (err) {
      console.log("err:", err);
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

  // Map steps array if present, and add requester step at the top
  const renderSteps = (data) => {
    // Add requester step if formId is present
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
      stepsArr = data.steps.map((step, idx) => {
        const displayName = step.approverId?.username || "-";
        const displayPosition = step.position || "-";
        const displayStatus = step.status || "-";
        const displayComment = step.comment || "-";
        return {
          key: `step-${idx}`,
          assignedTo: `${displayName} (${displayPosition})`,
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
          <td style={{ padding: "6px", textAlign: "center", fontSize: "0.875rem" }}>
            {step.assignedTo}
          </td>
          <td style={{ padding: "6px", textAlign: "center", fontSize: "0.875rem" }}>
            {step.assignedOn}
          </td>
          <td style={{ padding: "6px", textAlign: "center", fontSize: "0.875rem" }}>
            {step.actionedOn}
          </td>
          <td
            style={{
              padding: "6px",
              textAlign: "center",
              fontSize: "0.875rem",
              ...getStatusStyle(step.status),
            }}
          >
            {formatStatus(step.status)}
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
            title={step.comment}
          >
            {step.comment}
          </td>
        </tr>
      ));
    }
    // fallback to old logic if steps is not present
    return Object.keys(data)
      .filter((key) => key.startsWith("step") && data[key]?.length > 0)
      .sort(
        (a, b) =>
          parseInt(a.replace("step", ""), 10) -
          parseInt(b.replace("step", ""), 10)
      )
      .map((stepKey) => {
        const stepDataArray = data[stepKey];

        const firstApproved = stepDataArray.find(
          (item) => item.status === "Approved"
        );
        const firstDeclined = stepDataArray.find(
          (item) => item.status === "Declined"
        );
        const firstPending = stepDataArray.find(
          (item) => item.status === "Pending"
        );

        const allPendingEmails = stepDataArray
          .filter((item) => item.status === "Pending")
          .map((item) => <div key={item.email}>{item.email}</div>);

        const displayStatus = firstApproved
          ? firstApproved.status
          : firstDeclined
          ? firstDeclined.status
          : "Pending";

        const displayEmail = firstApproved
          ? firstApproved.email
          : firstDeclined
          ? firstDeclined.email
          : allPendingEmails;

        const displayComment =
          firstApproved?.comment || firstDeclined?.comment || "N/A";

        return (
          <tr style={{ borderBottom: "1px solid #aeaeae" }} key={stepKey}>
            <td style={{ padding: "6px", textAlign: "center", fontSize: "0.875rem" }}>
              {displayEmail}
            </td>
            <td style={{ padding: "6px", textAlign: "center", fontSize: "0.875rem" }}>
              {firstApproved?.createdAt ||
              firstDeclined?.createdAt ||
              firstPending?.createdAt
                ? fDate(
                    firstApproved?.createdAt ||
                      firstDeclined?.createdAt ||
                      firstPending?.createdAt
                  )
                : "N/A"}
            </td>
            <td style={{ padding: "6px", textAlign: "center", fontSize: "0.875rem" }}>
              {displayStatus === "Pending"
                ? "N/A"
                : fDate(firstApproved?.updatedAt || firstDeclined?.updatedAt)}
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
