import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloseButton from "src/routes/components/CloseButton";

const OrderDetails = ({ order, onBack }) => {
  // Use passed order or fallback
  const orderInfo = order || {
    orderNumber: "01-07-25",
    orderDate: "30-07-25",
    quantity: "na",
    orderValue: "-",
    creditDays: 0,
    repayment: {
      invoiced: "10",
      status: "Not Due",
    },
  };
  // Ensure repayment property exists
  const repayment = orderInfo.repayment || { invoiced: "-", status: "-" };

  return (
    <Paper
      elevation={6}
      sx={{
        p: { xs: 2, sm: 4 },
        borderRadius: 4,
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Order Detail: Ord001
        </Typography>
        <CloseButton onClick={onBack} tooltip="Close Order Details" />
      </Box>

      {/* Top Table */}
      <Table sx={{ mb: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                backgroundColor: "#083389",
                color: "white",
                borderTopLeftRadius: 8,
              }}
            >
              Order Number
            </TableCell>
            <TableCell sx={{ backgroundColor: "#083389", color: "white" }}>
              Order Date
            </TableCell>
            <TableCell sx={{ backgroundColor: "#083389", color: "white" }}>
              Quantity
            </TableCell>
            <TableCell sx={{ backgroundColor: "#083389", color: "white" }}>
              Order Value
            </TableCell>
            <TableCell sx={{ backgroundColor: "#083389", color: "white" }}>
              Credit Days
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: "#083389",
                color: "white",
                borderTopRightRadius: 8,
              }}
            >
              Repayment Commitment Date
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{orderInfo.orderNumber}</TableCell>
            <TableCell>{orderInfo.orderDate}</TableCell>
            <TableCell>{orderInfo.quantity}</TableCell>
            <TableCell>{orderInfo.orderValue}</TableCell>
            <TableCell>{orderInfo.creditDays}</TableCell>
            <TableCell>
              <Grid container direction="column">
                <Typography variant="body2">{repayment.invoiced}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {repayment.status}
                </Typography>
              </Grid>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Bottom Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                backgroundColor: "#083389",
                color: "white",
                borderTopLeftRadius: 8,
              }}
            >
              Material Code
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: "#083389",
                color: "white",
              }}
            >
              Material Name
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: "#083389",
                color: "white",
              }}
            >
              Quantity
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: "#083389",
                color: "white",
                borderTopRightRadius: 8,
              }}
            >
              Value(INR)
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

export default OrderDetails;
