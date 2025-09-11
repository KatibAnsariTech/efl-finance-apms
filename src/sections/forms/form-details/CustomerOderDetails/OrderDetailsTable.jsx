import {
  Paper,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  TextField,
  FormHelperText,
  TablePagination,
  Button,
} from "@mui/material";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

const headLabel = [
  { id: "orderNumber", label: "Order Number", minWidth: 130 },
  { id: "date", label: "Order Date", minWidth: 120 },
  { id: "quantity", label: "Quantity", minWidth: 90 },
  { id: "value", label: "Order Value", minWidth: 120 },
  { id: "creditDays", label: "Credit Days", minWidth: 110 },
  {
    id: "repaymentCommitmentDate",
    label: "Repayment Commitment Date",
    minWidth: 220,
  },
];

const OrderDetailsTable = ({ data, errors = {}, onOrderNumberClick }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const sapOrders = data?.formId?.otherData?.sapData?.sapOrders || [];
  // Support both array and object for ORDER_DETAILS.item
  const orderDetailsRaw = data?.formId?.otherData?.ORDER_DETAILS?.item;
  const orderDetailsArr = Array.isArray(orderDetailsRaw)
    ? orderDetailsRaw
    : orderDetailsRaw
    ? [orderDetailsRaw]
    : [];

  // Filter sapOrders to only those with commitDate
  const filteredSapOrders = sapOrders.filter((order) => order.commitDate);

  // Map sapOrders to order details by matching SAPORDER
  const matchedOrders = filteredSapOrders
    .map((sapOrder) => {
      const orderDetail = orderDetailsArr.find(
        (od) => od.SAPORDER === sapOrder.sapOrder
      );
      if (orderDetail) {
        return {
          ...orderDetail,
          commitDate: sapOrder.commitDate,
        };
      }
      return null;
    })
    .filter(Boolean);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const paginatedOrders = matchedOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper elevation={6} sx={{ p: 2, borderRadius: 3, mt: 3 }}>
      <Box p={2}>
        <Typography
          variant="subtitle2"
          sx={{
            bgcolor: "#083389",
            color: "white",
            px: 2,
            py: 1.5,
            mb: 2,
            borderRadius: 1,
          }}
        >
          Order Details
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              {headLabel.map((col) => (
                <TableCell
                  key={col.id}
                  sx={{ minWidth: col.minWidth }}
                  align="center"
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedOrders.map((order, idx) => {
              const globalIdx = page * rowsPerPage + idx;
              return (
                <TableRow key={globalIdx}>
                  <TableCell align="center">
                    <Box
                      px={1}
                      py={0.5}
                      bgcolor="#083389"
                      color="white"
                      borderRadius={1}
                      display="inline-block"
                      fontWeight="bold"
                      fontSize="0.8rem"
                      sx={{
                        cursor: onOrderNumberClick ? "pointer" : "default",
                        textDecoration: onOrderNumberClick
                          ? "underline"
                          : "none",
                      }}
                      onClick={
                        onOrderNumberClick
                          ? () => onOrderNumberClick(order)
                          : undefined
                      }
                    >
                      {order.SAPORDER}
                    </Box>
                  </TableCell>
                  <TableCell align="center">{order.ORDERDATE}</TableCell>
                  <TableCell align="center">
                    {Array.isArray(order.MATERIAL_DATA.item)
                      ? order.MATERIAL_DATA.item.reduce(
                          (sum, item) =>
                            sum + parseFloat(item.ORDERQUANTITY || 0),
                          0
                        )
                      : parseFloat(order.MATERIAL_DATA.item.ORDERQUANTITY || 0)}
                  </TableCell>
                  <TableCell align="center">{order.ORDER_VALUE}</TableCell>
                  <TableCell align="center">{order.CREDITDAY}</TableCell>
                  <TableCell align="center">{order.commitDate}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* <TablePagination
          component="div"
          count={sapOrders.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        /> */}
      </Box>
    </Paper>
  );
};

export default OrderDetailsTable;
