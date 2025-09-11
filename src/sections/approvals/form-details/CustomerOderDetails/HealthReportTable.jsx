import { Grid, Paper, Typography } from "@mui/material";
import { useEffect } from "react";

const HealthReportTable = ({ data, setScore }) => {
  // Map API data to card fields and calculate score/color
  const otherData = data?.formId?.otherData;
  const agreementStatus = otherData?.agreementStatus?.status;
  const agreementSigned =
    agreementStatus === "success"
      ? "Yes"
      : agreementStatus === "failed"
      ? "No"
      : agreementStatus || "-";
  const avgSalesInfo = otherData?.AVGSALE || "-";
  const overdue = otherData?.OVERDUE_DATE || "-";
  const controlCheque = otherData?.controlledChequeData?.chequeAvailability || "-";
  const chequeDishonour12M = otherData?.CHEQUE_DIS || "-";
  const dso = otherData?.dso?.value ?? "-";
  const orderDeviation = otherData?.DELAYORD || "-";
  const creditDeviation60Days = otherData?.AVGNOD || "-";

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
      isNeg: otherData?.dso
        ? otherData.dso.color === "NA"
          ? false
          : otherData.dso.color
        : false,
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
    if (setScore) setScore(score);
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
