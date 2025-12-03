import React from "react";
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from "@mui/material";
import { RxCross2 } from "react-icons/rx";

const SAPStatusModal = ({ open, onClose, sapStatuses }) => {
  if (!sapStatuses || !Array.isArray(sapStatuses) || sapStatuses.length === 0) {
    return (
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "900px",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              SAP Status Details
            </Typography>
            <IconButton onClick={onClose} sx={{ color: "#B22222" }}>
              <RxCross2 size={24} />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
            No SAP status information available
          </Typography>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: "900px",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            SAP Status Details
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#B22222" }}>
            <RxCross2 size={24} />
          </IconButton>
        </Box>

        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f6f8" }}>
              <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                Group ID
              </TableCell>
              {/* <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                SAP Status
              </TableCell> */}
              <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                Document Number
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                SAP Message
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sapStatuses.map((item, index) => {
              const sapStatus = item.sapStatus?.toUpperCase() || "";
              const isSuccess = sapStatus === "S"; // S = Success
              const isError = sapStatus === "E"; // E = Failure

              let chipColor = "default";
              let statusLabel = "-";
              if (isSuccess) {
                chipColor = "success";
                statusLabel = "Success";
              } else if (isError) {
                chipColor = "error";
                statusLabel = "Failed";
              } else {
                chipColor = "warning";
                statusLabel = sapStatus || "Pending";
              }

              return (
                <TableRow key={index} hover>
                  <TableCell sx={{ fontSize: "0.875rem" }}>
                    {item.groupId || "-"}
                  </TableCell>
                  {/* <TableCell sx={{ fontSize: "0.875rem" }}>
                    {item.sapStatus || "-"}
                  </TableCell> */}
                  <TableCell>
                    <Chip
                      label={statusLabel}
                      color={chipColor}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.875rem" }}>
                    {item.documentNumber || "-"}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "0.875rem",
                      maxWidth: "300px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={item.sapMessage || ""}
                  >
                    {item.sapMessage || "-"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Modal>
  );
};

export default SAPStatusModal;

