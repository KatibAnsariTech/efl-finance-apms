import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Container,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { apmsSubmitSchema } from "../utils/validationSchemas";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { userRequest } from "src/requestMethod";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import { useAccount } from "src/hooks/use-account";

import CustomSelect from "../components/CustomFields/CustomSelect";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// Sections
import PettyCashSection from "../components/Form/PettyCashSection";
import NonPOExpenseSection from "../components/Form/NonPOExpenseSection";
import AdhocAdvanceSection from "../components/Form/AdhocAdvanceSection";
import ExpenseTableSection from "../components/Form/ExpenseTableSection";

export default function RaiseRequest() {
  const account = useAccount();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(apmsSubmitSchema),
    mode: "onChange",
    defaultValues: {
      proposedSpoc: account?.displayName || "",
      advanceType: "",
    },
  });

  const advanceType = watch("advanceType");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await userRequest.post("/apms/createRequest", {
        ...data,
        status: "SUBMITTED",
      });
      swal("Success", "APMS request submitted successfully", "success");
      reset();
    } catch (error) {
      showErrorMessage(error, "Failed to submit request", swal);
    } finally {
      setLoading(false);
    }
  };

  const onSaveDraft = async () => {
    try {
      const data = watch();
      await userRequest.post("/apms/saveDraft", {
        ...data,
        status: "DRAFT",
      });
      swal("Saved", "Draft saved successfully", "success");
    } catch (error) {
      showErrorMessage(error, "Failed to save draft", swal);
    }
  };

  return (
    <>
      <Helmet>
        <title>Raise APMS Request</title>
      </Helmet>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box
          sx={{
            backgroundColor: "#F7F9FC",
            // backgroundColor: "black",
            minHeight: "100vh",
          }}
        >
          <Container maxWidth="xl">

            {/* ✅ HEADER SELECT (OUTSIDE PAPER) */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                // py: 1.5,
                // mb: 2,
                position: "relative",
                zIndex: 1200,
              }}
            >
              <Box
                sx={{
                  width: 260,
                  backgroundColor: "#FFFFFF",
                  borderRadius: "10px",
                  // p: 1,
                }}
              >
                <Controller
                  name="advanceType"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      label="Form Type"
                      size="small"
                      options={[
                        { label: "Petty Cash Settlement", value: "PETTY_CASH" },
                        { label: "Non-PO Expense", value: "NON_PO" },
                        { label: "ADHOC Advance", value: "ADHOC" },
                      ]}
                      value={
                        field.value
                          ? {
                              label:
                                field.value === "PETTY_CASH"
                                  ? "Petty Cash Settlement"
                                  : field.value === "NON_PO"
                                  ? "Non-PO Expense"
                                  : "ADHOC Advance",
                              value: field.value,
                            }
                          : null
                      }
                      onChange={(_, option) =>
                        field.onChange(option?.value || "")
                      }
                      error={!!errors.advanceType}
                      helperText={errors.advanceType?.message}
                    />
                  )}
                />
              </Box>
            </Box>

            {/* 🔻 PAPER CONTENT */}
            <Paper
              sx={{
                p: 3,
                backgroundColor: "transparent",
                boxShadow: "none",
              }}
            >
              {/* EMPTY STATE */}
              {!advanceType && (
                <Paper
                  sx={{
                    height: 320,
                    backgroundColor: "#F7F9FC",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                  }}
                >
                  <Stack alignItems="center" spacing={1}>
                    <DescriptionOutlinedIcon
                      sx={{ fontSize: 48, color: "#9CA3AF" }}
                    />
                    <Typography sx={{ color: "#6B7280", fontSize: 14 }}>
                      No Data
                    </Typography>
                    <Typography sx={{ color: "#9CA3AF", fontSize: 13 }}>
                      Select a form type to get started
                    </Typography>
                  </Stack>
                </Paper>
              )}

              {/* FORMS */}
              {advanceType === "PETTY_CASH" && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <PettyCashSection
                    control={control}
                    errors={errors}
                    onSubmit={handleSubmit(onSubmit)}
                    onSaveDraft={onSaveDraft}
                    loading={loading}
                  />
                </>
              )}

              {advanceType === "NON_PO" && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <NonPOExpenseSection
                    control={control}
                    errors={errors}
                    onSubmit={handleSubmit(onSubmit)}
                    onSaveDraft={onSaveDraft}
                    loading={loading}
                  />
                </>
              )}

              {advanceType === "ADHOC" && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <AdhocAdvanceSection
                    control={control}
                    errors={errors}
                    onSubmit={handleSubmit(onSubmit)}
                    onSaveDraft={onSaveDraft}
                    loading={loading}
                  />
                </>
              )}

              {advanceType && <ExpenseTableSection />}
            </Paper>
          </Container>
        </Box>
      </LocalizationProvider>
    </>
  );
}
