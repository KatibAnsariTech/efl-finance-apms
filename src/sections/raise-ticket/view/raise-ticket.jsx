import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Container, Paper } from "@mui/material";
import swal from "sweetalert";
import TicketRaise from "../form/TicketRaise";
import CustomerOrderDetails from "../form/CustomerOderDetails/CustomerOrderDetails";
import { userRequest } from "src/requestMethod";

export default function RaiseTicket() {
  const [step, setStep] = useState(1); // 1: TicketRaise, 2: CustomerOrderDetails
  const [formData, setFormData] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTicketRaiseSubmit = async (data) => {
    setLoading(true);
    setFormData(data);
    try {
      const res = await userRequest.post(
        `/admin/getCustomerDetailsAndAgreementStatus`,
        {
          customerCode: data?.customerCode,
          salesGroup: data?.salesGroup,
          salesOffice: data?.salesOffice,
          channelCode: data?.channel,
          regionCode: data?.region,
        }
      );
      setCustomerDetails(res.data.data);
      setStep(2);
    } catch (err) {
      const apiError = err?.response?.data;
      let msg = "Failed to fetch customer details. Please try again.";
      if (apiError && (apiError.errors || apiError.message)) {
        msg = apiError.errors || apiError.message;
      }
      swal("Error", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCustomerInfo = () => {
    setStep(1);
    setCustomerDetails(null);
  };

  return (
    <Container maxWidth="md" sx={{ my: 0 }}>
      <Paper elevation={3} sx={{ borderRadius: 4 }}>
        {step === 1 && (
          <>
            {loading && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="60vh"
              >
                <CircularProgress />
              </Box>
            )}
            {!loading && <TicketRaise onSubmit={handleTicketRaiseSubmit} />}
          </>
        )}
        {step === 2 && (
          <CustomerOrderDetails
            onCancel={handleCancelCustomerInfo}
            formData={formData}
            customerDetails={customerDetails}
          />
        )}
      </Paper>
    </Container>
  );
}
