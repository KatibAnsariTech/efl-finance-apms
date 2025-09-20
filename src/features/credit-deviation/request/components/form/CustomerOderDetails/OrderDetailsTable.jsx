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

const OrderDetailsTable = ({
  customerDetails,
  selected = [],
  onSelectionChange,
  repaymentDates = {},
  onDateChange,
  errors = {},
  onOrderNumberClick,
  isSubmitEnabled,
  onSubmit,
  onCancel,
  validateRepaymentDates,
  score,
  requesterRemark = "",
  setRequesterRemark
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmOpen, setConfirmOpen] = useState(false);
  // Normalize ORDER_DETAILS.item and MATERIAL_DATA.item to arrays and flatten for table
  // Support both with and without dmsCustomerDetails wrapper
  const orderDetailsArr = Array.isArray(
    customerDetails?.dmsCustomerDetails?.IS_CUSTOMER_ORD_DET?.IS_ORDER_DETAIL
      ?.ORDER_DETAILS?.item
  )
    ? customerDetails.dmsCustomerDetails.IS_CUSTOMER_ORD_DET.IS_ORDER_DETAIL
        .ORDER_DETAILS.item
    : customerDetails?.dmsCustomerDetails?.IS_CUSTOMER_ORD_DET?.IS_ORDER_DETAIL
        ?.ORDER_DETAILS?.item
    ? [
        customerDetails.dmsCustomerDetails.IS_CUSTOMER_ORD_DET.IS_ORDER_DETAIL
          .ORDER_DETAILS.item,
      ]
    : Array.isArray(
        customerDetails?.IS_CUSTOMER_ORD_DET?.IS_ORDER_DETAIL?.ORDER_DETAILS
          ?.item
      )
    ? customerDetails.IS_CUSTOMER_ORD_DET.IS_ORDER_DETAIL.ORDER_DETAILS.item
    : customerDetails?.IS_CUSTOMER_ORD_DET?.IS_ORDER_DETAIL?.ORDER_DETAILS?.item
    ? [customerDetails.IS_CUSTOMER_ORD_DET.IS_ORDER_DETAIL.ORDER_DETAILS.item]
    : [];

  const isAllSelected =
    selected.length === orderDetailsArr.length && orderDetailsArr.length > 0;

  const handleSelectAll = (e) => {
    const newSelected = e.target.checked
      ? paginatedOrders.map((_, i) => i + page * rowsPerPage)
      : [];
    const selectedOrders = e.target.checked ? paginatedOrders : [];
    onSelectionChange && onSelectionChange(newSelected, selectedOrders);
  };

  const handleSelectRow = (idx) => {
    const globalIdx = page * rowsPerPage + idx;
    let newSelected;
    let selectedOrders;
    if (selected.includes(globalIdx)) {
      newSelected = selected.filter((i) => i !== globalIdx);
      selectedOrders = paginatedOrders.filter((_, i) =>
        newSelected.includes(page * rowsPerPage + i)
      );
    } else {
      newSelected = [...selected, globalIdx];
      selectedOrders = paginatedOrders.filter((_, i) =>
        newSelected.includes(page * rowsPerPage + i)
      );
    }
    onSelectionChange && onSelectionChange(newSelected, selectedOrders);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const paginatedOrders = orderDetailsArr.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Only open confirm dialog if validation passes
  const handleOpenConfirm = () => {
    if (validateRepaymentDates && validateRepaymentDates()) {
      setConfirmOpen(true);
    }
    // If validation fails, errors will be shown via setErrors in parent
  };
  const handleCloseConfirm = () => setConfirmOpen(false);
  const handleConfirmSubmit = () => {
    setConfirmOpen(false);
    onSubmit && onSubmit();
  };

  const agreementStatus = customerDetails?.agreementStatus?.status;
  const agreementSigned =
    agreementStatus === "success"
      ? "Yes"
      : agreementStatus === "failed"
      ? "No"
      : agreementStatus || "-";

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
          Order Details{" "}
          {selected.length > 0 ? `(${selected.length} selected)` : ""}
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={
                    paginatedOrders.length > 0 &&
                    paginatedOrders.every((_, idx) =>
                      selected.includes(page * rowsPerPage + idx)
                    )
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
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
              const isSelected = selected.includes(globalIdx);
              return (
                <TableRow key={globalIdx} sx={{ bgcolor: order.red ? "" : "" }}>
                  <TableCell padding="checkbox" align="center">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleSelectRow(idx)}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Box
                      px={1}
                      py={0.5}
                      bgcolor={order.red ? "#083389" : "#083389"}
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

                  <TableCell align="center">{order.TOTALORDERVALUE}</TableCell>
                  <TableCell align="center">{order.CREDITDAY}</TableCell>
                  <TableCell align="center">
                    {isSelected ? (
                      <Box>
                        <TextField
                          type="date"
                          size="small"
                          value={repaymentDates[globalIdx] || ""}
                          onChange={(e) =>
                            onDateChange &&
                            onDateChange(globalIdx, e.target.value)
                          }
                          error={Boolean(errors[globalIdx])}
                          sx={{ minWidth: 200 }}
                          inputProps={{
                            min: new Date().toISOString().split("T")[0], // 👈 sets today's date as minimum
                          }}
                        />
                        {errors[globalIdx] && (
                          <FormHelperText error>
                            {errors[globalIdx]}
                          </FormHelperText>
                        )}
                      </Box>
                    ) : (
                      <Box
                        sx={{ bgcolor: "#f0f0f0", p: 1, textAlign: "center" }}
                      >
                        —
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={orderDetailsArr.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />

        <TextField
          id="requesterRemark"
          placeholder="Remarks..."
          multiline
          onChange={(e) => setRequesterRemark(e.target.value)}
          minRows={4}
          fullWidth
          variant="filled"
          error={!!errors?.comment}
          helperText={errors?.comment?.message}
          sx={{ backgroundColor: "#f3f4f6", mt: 2 }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
            mt: 3,
          }}
        >
          <Button
            variant="text"
            sx={{ color: "grey.600", height: 40 }}
            onClick={onCancel}
          >
            Cancel Request
          </Button>
          <Button
            variant="contained"
            sx={{ height: 40 }}
            disabled={!isSubmitEnabled}
            onClick={handleOpenConfirm}
          >
            Submit Request
          </Button>
        </Box>
      </Box>
      <ConfirmDialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmSubmit}
        title="Submit Request?"
        message="Are you sure you want to submit this request?"
        agreement={agreementSigned || "Agreement is not present"}
        score={score}
        amount={selected
          .map((idx) => {
            const order = orderDetailsArr[idx];
            return order ? parseFloat(order.TOTALORDERVALUE) || 0 : 0;
          })
          .reduce((sum, val) => sum + val, 0)}
      />
    </Paper>
  );
};

export default OrderDetailsTable;
