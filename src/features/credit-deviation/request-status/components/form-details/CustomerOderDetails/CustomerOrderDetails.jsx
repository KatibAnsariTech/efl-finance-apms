import {
  Box,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import CustomerInfoTable from "./CustomerInfoTable";
import HealthReportTable from "./HealthReportTable";
import OrderDetailsTable from "./OrderDetailsTable";
import CustomerHeaderInfo from "./CustomerHeaderInfo";
import { useState } from "react";
import OrderDetailsModal from "./OrderDetailsModal";

const CustomerOrderDetails = ({ onCancel, data }) => {
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOrder, setModalOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOrderNumberClick = (order) => {
    setModalOrder(order);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalOrder(null);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", p: 3 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }
  return (
    <Box p={3}>
      <CustomerHeaderInfo onCancel={onCancel} data={data} />
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={2}>
          <CustomerInfoTable data={data} />
          <HealthReportTable data={data} />
        </Grid>
      </Paper>
      <OrderDetailsTable
        data={data}
        errors={errors}
        onOrderNumberClick={handleOrderNumberClick}
        onCancel={onCancel}
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
