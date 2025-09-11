import React from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

const ApproverTable = ({ data, loading, onEdit, onDelete }) => {
  return (
    <Paper elevation={3} sx={{ borderRadius: 2, mt: 2 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 5 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold",paddingLeft:"20px" }}>S.No</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Approver Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Approver Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.value}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => onEdit(index)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => onDelete(index)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography variant="body1" color="textSecondary">
                      No Data Available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default ApproverTable;
