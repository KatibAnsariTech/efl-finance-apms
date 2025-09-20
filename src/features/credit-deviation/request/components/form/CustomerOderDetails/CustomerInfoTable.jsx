import { Grid, Paper, Typography } from "@mui/material";

const CustomerInfoTable = ({ customerDetails }) => {
  // Map API data to card fields
  const orderDetail =
    customerDetails?.dmsCustomerDetails?.IS_CUSTOMER_ORD_DET?.IS_ORDER_DETAIL ||
    {};
  const cfData = customerDetails?.cfData || {};
  const formStatistics = customerDetails?.formStatistics || {};
  const cardData = [
    {
      id: "creditLimit",
      label: "Credit Limit",
      value: orderDetail.CREDITLIMIT || "-",
    },
    {
      id: "outstanding",
      label: "Outstanding",
      value: orderDetail.OUTSTANDING_DATE || "-",
    },
    {
      id: "avgSalesInfo",
      label: "Average per day sale",
      value: orderDetail.AVGSALE || "-",
    },
    {
      id: "channelFinance",
      label: "Channel Finance",
      value: orderDetail.CFPARTNER || "-",
    },
    {
      id: "totalCreditDeviation",
      label: "Total Monthly Credit Deviation Submitted Value",
      value: formStatistics?.totalAmount || "-",
    },
    {
      id: "channelFinanceLimit",
      label: "Channel Finance Limit",
      value: cfData.cfLimit || "-",
    },
    {
      id: "channelFinanceOutstanding",
      label: "Channel Finance Outstanding",
      value: cfData.outstandingAsOnDate || "-",
    },
  ];

  return (
    <>
      <Grid
        container
        alignItems="center"
        sx={{
          bgcolor: "#083389",
          color: "white",
          px: 2,
          py: 1,
          mb: 2,
          borderRadius: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Customer Information
        </Typography>
      </Grid>

      <Grid container spacing={2}>
        {cardData.map((item, index) => {
          // const isCritical =
          //   item.id === "outstanding" && parseInt(item.value) > 0;
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 0.5,
                  // bgcolor: isCritical ? "error.main" : "white",
                  // color: isCritical ? "white" : "text.primary",
                  bgcolor: "white",
                  color: "text.primary",
                }}
              >
                <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                  {item.label}
                </Typography>
                <Typography variant="h6">{item.value}</Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default CustomerInfoTable;
