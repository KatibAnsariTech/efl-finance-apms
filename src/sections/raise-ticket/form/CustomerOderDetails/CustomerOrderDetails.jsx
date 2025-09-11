import {
  Box,
  Grid,
  Paper,
  Dialog,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CustomerInfoTable from "./CustomerInfoTable";
import HealthReportTable from "./HealthReportTable";
import OrderDetailsTable from "./OrderDetailsTable";
import CustomerHeaderInfo from "./CustomerHeaderInfo";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import OrderDetailsModal from "./OrderDetailsModal";
import { userRequest } from "src/requestMethod";
import { useAccount } from "src/hooks/use-account";

const CustomerOrderDetails = ({ onCancel, formData, customerDetails }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [repaymentDates, setRepaymentDates] = useState({});
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOrder, setModalOrder] = useState(null);
  const [selectedApiOrders, setSelectedApiOrders] = useState([]);
  const [score, setScore] = useState(0);
  const [orderLoading, setOrderLoading] = useState(false);
  const [requesterRemark, setRequesterRemark] = useState("");
  const user = useAccount();

  const handleSelectionChange = (selected, selectedOrders) => {
    setSelectedRows(selected);
    setSelectedApiOrders(selectedOrders || []);
    // Remove repaymentDates and errors for unselected rows
    setRepaymentDates((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((idx) => {
        if (!selected.includes(Number(idx))) delete updated[idx];
      });
      return updated;
    });
    setErrors((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((idx) => {
        if (!selected.includes(Number(idx))) delete updated[idx];
      });
      return updated;
    });
  };

  const handleDateChange = (idx, value) => {
    setRepaymentDates((prev) => ({ ...prev, [idx]: value }));
    setErrors((prev) => ({ ...prev, [idx]: "" }));
  };

  const handleOrderNumberClick = (order) => {
    setModalOrder(order);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalOrder(null);
  };

  const validateRepaymentDates = () => {
    let hasError = false;
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight

    selectedRows.forEach((idx) => {
      const dateStr = repaymentDates[idx];
      const selectedDate = new Date(dateStr);

      if (!dateStr) {
        newErrors[idx] = "Repayment commitment date is required.";
        hasError = true;
      } else if (selectedDate < today) {
        newErrors[idx] = "Date cannot be earlier than today.";
        hasError = true;
      }
    });

    setErrors(newErrors);
    return !hasError;
  };

  // Called only after confirmation dialog is accepted
  const handleSubmit = async () => {
    // Use selectedApiOrders for sapData
    const sapOrders = selectedApiOrders.map((order, idx) => ({
      sapOrder: order.SAPORDER,
      commitDate: repaymentDates[selectedRows[idx]] || "",
    }));

    // Sum all TOTALORDERVALUE from selectedApiOrders
    const amount = selectedApiOrders.reduce((sum, order) => {
      const val = parseFloat(order.TOTALORDERVALUE) || 0;
      return sum + val;
    }, 0);

    function transformCustomerData(apiResponse) {
      const orderDetail =
        apiResponse?.dmsCustomerDetails?.IS_CUSTOMER_ORD_DET?.IS_ORDER_DETAIL ||
        {};
      const responseMessage =
        apiResponse?.dmsCustomerDetails?.IS_CUSTOMER_ORD_DET?.RESPONSE || "";

      const agreementStatus = apiResponse?.agreementStatus || {};
      const cfData = apiResponse?.cfData || {};
      const controlledChequeData = apiResponse?.controlledChequeData || {};
      const dso = apiResponse?.dso || {};
      const formStatistics = apiResponse?.formStatistics || {};

      return {
        ...orderDetail,
        RESPONSE: responseMessage,
        agreementStatus,
        cfData,
        controlledChequeData,
        dso,
        formStatistics,
      };
    }
    const otherData = transformCustomerData(customerDetails);
    const payload = {
      requesterId: user?._id,
      channel: formData?.channel,
      region: formData?.region,
      salesGroup: formData?.salesGroup,
      salesOffice: formData?.salesOffice,
      customerCode: formData?.customerCode,
      amount,
      otherData: otherData || {},
      sapData: {
        sapOrders,
      },
      requesterRemark: requesterRemark,
    };
    try {
      setOrderLoading(true);
      const res = await userRequest.post("/admin/createRequest", payload);
      if (res.data.success) {
        swal("Success", "Order(s) submitted successfully!", "success").then(
          () => {
            if (onCancel) onCancel();
          }
        );
      }

      // console.log("Payload to submit:", payload);
    } catch (error) {
      console.error("Error submitting order details:", error);
      swal(
        "Error",
        "Failed to submit order details. Please try again.",
        "error"
      );
      return;
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <Box p={3}>
      <CustomerHeaderInfo
        onCancel={onCancel}
        formData={formData}
        customerDetails={customerDetails}
      />
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={2}>
          <CustomerInfoTable customerDetails={customerDetails} />
          <HealthReportTable
            customerDetails={customerDetails}
            setScore={setScore}
          />
        </Grid>
      </Paper>
      {orderLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(255,255,255,0.6)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={60} thickness={5} />
        </Box>
      )}
      <OrderDetailsTable
        customerDetails={customerDetails}
        selected={selectedRows}
        onSelectionChange={handleSelectionChange}
        repaymentDates={repaymentDates}
        onDateChange={handleDateChange}
        errors={errors}
        onOrderNumberClick={handleOrderNumberClick}
        isSubmitEnabled={selectedRows.length > 0}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        validateRepaymentDates={validateRepaymentDates}
        score={score}
        requesterRemark={requesterRemark}
        setRequesterRemark={setRequesterRemark}
      />
      <OrderDetailsModal
        open={modalOpen}
        handleClose={handleModalClose}
        order={modalOrder}
      />
    </Box>
  );
};

export default CustomerOrderDetails;
