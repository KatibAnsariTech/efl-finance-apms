import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";
import { userRequest } from "src/requestMethod";
import { fDateTime } from "src/utils/format-time";
import {
  Divider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
} from "@mui/material";

const ModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(5),
  borderRadius: theme.spacing(2),
  width: "85dvw",
  maxHeight: "80vh",
  overflowY: "auto",
}));

const StatusTableCell = styled(TableCell)(({ status }) => ({
  padding: "8px",
  textAlign: "center",
  color:
    status === "approved"
      ? "green"
      : status === "pending"
      ? "orange"
      : status === "declined"
      ? "red"
      : "gray",
  fontWeight: "bold",
}));

const CommentTableCell = styled(TableCell)({
  padding: "8px",
  textAlign: "center",
  maxWidth: "30dvw",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

const TableHeaderCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: "6px",
  fontSize: "0.875rem",
  fontWeight: 600,
  textAlign: "center",
  backgroundColor: "#003a95",
  color: "#fff",
}));

const TableRowStyled = styled(TableRow)({
  borderBottom: "1px solid #aeaeae",
});

const LoadingContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100px",
});

const ModalTitleContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
}));

export default function RequestStatus({
  open,
  onClose,
  rowData,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      if (!rowData?._id && !rowData?.requestNo) {
        console.error("No formId found in rowData");
        setData(null);
        return;
      }

      const formId = rowData._id || rowData.requestNo;

      // TEMPORARY: Use dummy data for testing
      // Uncomment the API call below when ready
      /*
      const response = await userRequest.get(
        `/cpx/getFormSteps?formId=${formId}`
      );

      if (response?.data?.statusCode === 200 && response?.data?.data) {
        const apiData = response.data.data;
        const mappedData = {
          requester: {
            ...apiData.requester,
            createdAt: apiData?.createdAt || null,
            updatedAt: apiData?.updatedAt || null
          },
          steps: (apiData.steps || []).map(step => {
            const actualApprovals = (step.approvals || []).filter(approval => approval.status !== 'Parallel Approved');
            const firstApproval = actualApprovals[0] || step.approvals?.[0];
            const actualApprovers = actualApprovals.map(approval => approval.approverId);
            const actualStatuses = actualApprovals.map(approval => approval.status);
            const actualComments = actualApprovals.map(approval => approval.comment).filter(Boolean);
            
            return {
              approverId: actualApprovers,
              position: step.position,
              status: actualStatuses.includes('Approved') ? 'Approved' : 
                     actualStatuses.includes('Declined') ? 'Declined' : 'Pending',
              comment: actualComments.join(', ') || '',
              created: firstApproval?.created || step.createdAt || null,
              createdAt: step.createdAt || null,
              updatedAt: step.updatedAt || null
            };
          })
        };
        setData(mappedData);
      } else {
        setData(null);
      }
      */

      // TEMPORARY: Using dummy approval data
      const dummyData = {
        requester: {
          username: "john.doe",
          email: "john.doe@example.com",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        steps: [
          {
            approverId: [
              {
                username: "manager1",
                email: "manager1@example.com",
              }
            ],
            position: 1,
            status: "Approved",
            comment: "Looks good, approved for next step",
            created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            approverId: [
              {
                username: "finance.head",
                email: "finance.head@example.com",
              }
            ],
            position: 2,
            status: "Pending",
            comment: "",
            created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: null,
          },
        ],
      };
      setData(dummyData);
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

  const formatStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "Approved";
      case "declined":
      case "rejected":
        return "Declined";
      case "pending":
        return "Pending";
      default:
        return status || "Pending";
    }
  };

  const renderSteps = (data) => {
    const requesterStep = data?.requester
      ? {
          username:
            `${data?.requester?.username || "-"} (${data?.requester?.email || "-"})` ||
            "-",
          status: "Raised",
          comment: "-",
          created: data?.requester?.createdAt,
          updatedAt: data?.requester?.updatedAt,
        }
      : null;

    let stepsArr = [];
    if (Array.isArray(data?.steps)) {
      stepsArr = data.steps.map((step, idx) => {
        const approvers = Array.isArray(step.approverId) ? step.approverId : [step.approverId];
        const displayNames = approvers
          .map((approver) =>
            approver?.username
              ? `${approver.username} (${approver.email || "-"})`
              : approver?.email || "-"
          )
          .join("\n");
        const displayStatus = step.status || "-";
        const displayComment = step.comment || "-";
        return {
          key: `step-${idx}`,
          assignedTo: displayNames,
          assignedOn: step.createdAt ? fDateTime(step.createdAt) : "N/A",
          actionedOn:
            step.updatedAt && displayStatus !== "Pending"
              ? fDateTime(step.updatedAt)
              : "N/A",
          status: displayStatus,
          comment: displayComment,
        };
      });
    }
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
        <TableRowStyled key={step.key || idx}>
          <TableCell sx={{ padding: "8px", textAlign: "center", whiteSpace: "pre-line" }}>
            {step.assignedTo}
          </TableCell>
          <TableCell sx={{ padding: "8px", textAlign: "center" }}>
            {step.assignedOn}
          </TableCell>
          <TableCell sx={{ padding: "8px", textAlign: "center" }}>
            {step.actionedOn}
          </TableCell>
          <StatusTableCell status={step.status?.toLowerCase()}>
            {formatStatus(step.status)}
          </StatusTableCell>
          <CommentTableCell title={step.comment}>
            {step.comment}
          </CommentTableCell>
        </TableRowStyled>
      ));
    }
    return [];
  };

  const titleId = rowData?.requestNo || rowData?._id;

  return (
    <Modal
      open={open}
      onClose={onClose}
      keepMounted
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <ModalBox>
        <ModalTitleContainer>
          <Typography variant="h5">Request No. #{titleId}</Typography>
        </ModalTitleContainer>
        <Divider sx={{ borderStyle: "solid" }} />
        {loading ? (
          <LoadingContainer>
            <CircularProgress />
          </LoadingContainer>
        ) : data ? (
          <TableContainer component={Paper} sx={{ width: "100%", fontSize: "0.875rem" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Assigned To</TableHeaderCell>
                  <TableHeaderCell>Assigned On</TableHeaderCell>
                  <TableHeaderCell>Actioned On</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Comment</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderSteps(data)}</TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No data available</Typography>
        )}
      </ModalBox>
    </Modal>
  );
}



