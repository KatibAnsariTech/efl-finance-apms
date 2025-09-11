import React from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Paper,
  Divider,
  Stack,
} from "@mui/material";

const CustomerOrderDetails = () => {
  const orderDetails = [
    {
      orderNumber: "ORD001",
      date: "01-07-25",
      quantity: 5,
      value: "na",
      creditDays: 0,
      red: false,
    },
    {
      orderNumber: "ORD001",
      date: "01-07-25",
      quantity: 18,
      value: "na",
      creditDays: 0,
      red: false,
    },
    {
      orderNumber: "ORD001",
      date: "01-07-25",
      quantity: 6,
      value: "na",
      creditDays: 0,
      red: true,
    },
    {
      orderNumber: "ORD001",
      date: "01-07-25",
      quantity: 8,
      value: "na",
      creditDays: 0,
      red: true,
    },
  ];

  return (
    <Box p={3}>
      {/* Header */}
      <Paper
        elevation={6}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "60%",
          }}
        >
          {/* Block 1 */}
          <Stack sx={{ display: "flex", flexDirection: "row" }}>
            <Typography variant="body2" fontSize="0.75rem">
              <b>Requestor Code:</b> 8879668
            </Typography>
            <Typography
              variant="body2"
              fontSize="0.75rem"
              fontWeight={700}
              sx={{ mx: 0.5 }}
            >
              |
            </Typography>
            <Typography variant="body2" fontSize="0.75rem">
              <b>Requestor Name:</b> Nikhil Sharma
            </Typography>
            <Typography
              variant="body2"
              fontSize="0.75rem"
              fontWeight={700}
              sx={{ mx: 0.5 }}
            >
              |
            </Typography>
            <Typography variant="body2" fontSize="0.75rem">
              <b>Designation:</b> PCH-ZSH
            </Typography>
          </Stack>

          {/* Block 2 */}
          <Stack sx={{ display: "flex", flexDirection: "row" }}>
            <Typography variant="body2" fontSize="0.75rem">
              <b>Channel:</b> GT
            </Typography>
            <Typography
              variant="body2"
              fontSize="0.75rem"
              fontWeight={700}
              sx={{ mx: 0.5 }}
            >
              |
            </Typography>
            <Typography variant="body2" fontSize="0.75rem">
              <b>Region:</b> South
            </Typography>
            <Typography
              variant="body2"
              fontSize="0.75rem"
              fontWeight={700}
              sx={{ mx: 0.5 }}
            >
              |
            </Typography>
            <Typography variant="body2" fontSize="0.75rem">
              <b>Sales Office:</b> Ulx-Bang
            </Typography>
            <Typography
              variant="body2"
              fontSize="0.75rem"
              fontWeight={700}
              sx={{ mx: 0.5 }}
            >
              |
            </Typography>
            <Typography variant="body2" fontSize="0.75rem">
              <b>Sales Group:</b> 345
            </Typography>
          </Stack>

          {/* Block 3 */}
          <Stack sx={{ display: "flex", flexDirection: "row" }}>
            <Typography variant="body2" fontSize="0.75rem">
              <b>Customer Code:</b> iui89ij
            </Typography>
            <Typography
              variant="body2"
              fontSize="0.75rem"
              fontWeight={700}
              sx={{ mx: 0.5 }}
            >
              |
            </Typography>
            <Typography variant="body2" fontSize="0.75rem">
              <b>Customer Name:</b> Shewta Tiwari
            </Typography>
          </Stack>
        </Box>
        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mt: { xs: 2, md: 0 },
          }}
        >
          <Button variant="text" sx={{ color: "grey.600", height: 40 }}>
            Cancel Request
          </Button>
          <Button variant="contained" sx={{ height: 40 }}>
            Submit Request
          </Button>
        </Box>
      </Paper>

      {/* Customer Info + Health Report */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              sx={{ bgcolor: "#dbe9ff", px: 1, py: 0.5 }}
            >
              Customer Information
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {[
                    "Credit Limit",
                    "Outstanding",
                    "Avg. Sales Info",
                    "Total Credit deviation submitted for the month",
                    "Average net sale last 3 months",
                    "channel finance",
                    "channel finance limit",
                    "channel finance oustanding",
                  ].map((head, idx) => (
                    <TableCell key={idx}>{head}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>{Array(8).fill("")}</TableRow>
              </TableBody>
            </Table>
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ bgcolor: "#dbe9ff", px: 1, py: 0.5 }}
            >
              Health Report
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Agreement Signed</TableCell>
                  <TableCell>Overdue</TableCell>
                  <TableCell>Control Cheque</TableCell>
                  <TableCell>DSO</TableCell>
                  <TableCell>Cheque Dishonour in Last 12 Months</TableCell>
                  <TableCell>Last 60 Days Credit Deviation</TableCell>
                  <TableCell>
                    Number of Order Deviated as per Commitment
                  </TableCell>
                  <TableCell>
                    <b>Score: 6/7</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>yes/no</TableCell>
                  <TableCell>3434234</TableCell>
                  <TableCell>yes/no</TableCell>
                  <TableCell>435345</TableCell>
                  <TableCell>yes/no</TableCell>
                  <TableCell>3/5</TableCell>
                  <TableCell>23</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Paper>

      {/* Order Details */}
      <Paper variant="outlined">
        <Box p={2}>
          <Typography variant="subtitle2" mb={1}>
            Order Details
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>Order Number</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Order Value</TableCell>
                <TableCell>Credit Days</TableCell>
                <TableCell>Repayment Commitment Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderDetails.map((order, idx) => (
                <TableRow
                  key={idx}
                  sx={{ bgcolor: order.red ? "#ffebeb" : "#e6ffed" }}
                >
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <Box
                      px={1}
                      py={0.5}
                      bgcolor={order.red ? "#ff4d4f" : "#4caf50"}
                      color="white"
                      borderRadius={1}
                      display="inline-block"
                      fontWeight="bold"
                      fontSize="0.8rem"
                    >
                      {order.orderNumber}
                    </Box>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.value}</TableCell>
                  <TableCell>{order.creditDays}</TableCell>
                  <TableCell>
                    <Box sx={{ bgcolor: "#f0f0f0", p: 1, textAlign: "center" }}>
                      —
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomerOrderDetails;
