import { Grid, Paper, Typography } from "@mui/material";
import { useEffect } from "react";

const HealthReportTable = ({ customerDetails, setScore }) => {
  // Map API data to card fields and calculate score/color
  const agreementStatus = customerDetails?.agreementStatus?.status;
  const agreementSigned =
    agreementStatus === "success"
      ? "Yes"
      : agreementStatus === "failed"
      ? "No"
      : agreementStatus || "-";
  const avgSalesInfo =
    customerDetails?.dmsCustomerDetails?.IS_CUSTOMER_ORD_DET?.IS_ORDER_DETAIL
      ?.AVGSALE || "-";
  const overdue =
    customerDetails?.dmsCustomerDetails?.IS_CUSTOMER_ORD_DET?.IS_ORDER_DETAIL
      ?.OVERDUE_DATE || "-";
  const controlCheque =
    customerDetails?.controlledChequeData?.chequeAvailability || "No";
  const chequeDishonour12M =
    customerDetails?.dmsCustomerDetails?.IS_CUSTOMER_ORD_DET?.IS_ORDER_DETAIL
      ?.CHEQUE_DIS || "-";
  // const dso =
  //   avgSalesInfo &&
  //   !isNaN(parseFloat(avgSalesInfo)) &&
  //   parseFloat(avgSalesInfo) !== 0 &&
  //   !isNaN(parseFloat(overdue))
  //     ? (parseFloat(overdue) / parseFloat(avgSalesInfo)) * 90
  //     : "NA";

  const dso = customerDetails?.dso?.value;
  const orderDeviation =
    customerDetails?.dmsCustomerDetails?.IS_CUSTOMER_ORD_DET?.IS_ORDER_DETAIL
      ?.DELAYORD || "-";
  const creditDeviation60Days =
    customerDetails?.dmsCustomerDetails?.IS_CUSTOMER_ORD_DET?.IS_ORDER_DETAIL
      ?.AVGNOD || "-";

  // Scoring logic based on provided rules
  const rules = [
    {
      id: "agreementSigned",
      label: "Agreement signed",
      value: agreementSigned,
      isNeg: agreementSigned === "No",
    },
    {
      id: "overdue",
      label: "Overdue",
      value: overdue,
      isNeg: parseFloat(overdue) > 0,
    },
    {
      id: "controlCheque",
      label: "Control Cheque",
      value: controlCheque,
      isNeg: controlCheque === "No",
    },
    {
      id: "dso",
      label: "DSO",
      value: dso,
      // isNeg:
      //   dso !== "NA" &&
      //   !isNaN(parseFloat(dso)) &&
      //   avgSalesInfo &&
      //   !isNaN(parseFloat(avgSalesInfo)) &&
      //   overdue &&
      //   !isNaN(parseFloat(overdue)) &&
      //   (parseFloat(overdue) / parseFloat(avgSalesInfo)) * 90 > 90, // Example: dso > 90 is negative
      isNeg:
        customerDetails?.dso?.color === "NA"
          ? false
          : customerDetails?.dso?.color,
    },
    {
      id: "chequeDishonour12M",
      label: "Cheque Dishonour in Last 12 Months",
      value: chequeDishonour12M,
      isNeg: chequeDishonour12M === "Yes",
    },
    {
      id: "creditDeviation60Days",
      label: "Average Delay in Payment",
      value: creditDeviation60Days,
      isNeg: parseFloat(creditDeviation60Days) > 0,
    },
    {
      id: "orderDeviation",
      label: "Number of Order Deviated as per Commitment",
      value: orderDeviation,
      isNeg: parseFloat(orderDeviation) > 0,
    },
  ];

  const score = rules.reduce((acc, item) => acc + (item.isNeg ? 1 : 0), 0);

  useEffect(() => {
    setScore(score);
  }, [score]);

  const cardData = rules.map((item) => ({
    ...item,
    isCritical: item.isNeg,
  }));
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
          my: 2,
          borderRadius: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Risk Analysis Report
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            bgcolor: "white",
            // color: score > 0 ? "#c62828" : "#083389",
            color: score > 0 ? "#083389" : "#083389",
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontWeight: 600,
            fontSize: "0.875rem",
            boxShadow: 1,
          }}
        >
          Score: {score}/7
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={2}>
          {cardData.map((item, index) => (
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
                  bgcolor: item.isCritical ? "error.main" : "white",
                  color: item.isCritical ? "white" : "text.primary",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.75rem",
                    color: item.isCritical ? "white" : "text.secondary",
                  }}
                >
                  {item.label}
                </Typography>
                <Typography variant="h6">{item.value || "-"}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default HealthReportTable;
