import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import swal from "sweetalert";

import { useParams, useRouter } from "src/routes/hooks";
import { userRequest } from "src/requestMethod";
import CloseButton from "src/routes/components/CloseButton";
import { showErrorMessage } from "src/utils/errorUtils";

import BasicInfoSection from "../components/BasicInfoSection";
import AdvanceDetailsSection from "../components/AdvanceDetailsSection";
import SupportingDocumentsSection from "../components/SupportingDocumentsSection";
import { apmsDraftSchema } from "../utils/validationSchema";

export default function APMSDraftEdit() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [requestData, setRequestData] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(apmsDraftSchema),
  });

  // Fetch draft
  useEffect(() => {
    const fetchDraft = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get(`/apms/getDraftById/${id}`);

        if (res.data?.success) {
          const data = res.data.data;
          setRequestData(data);

          reset({
            requestNo: data.requestNo,
            advanceType: data.advanceType,
            purpose: data.purpose,
            requestedAmount: data.requestedAmount,
            expectedSettlementDate: data.expectedSettlementDate
              ? new Date(data.expectedSettlementDate)
              : null,
            documents: data.documents || [],
          });
        } else {
          throw new Error("Draft not found");
        }
      } catch (err) {
        showErrorMessage(err, "Failed to load draft", swal);
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDraft();
  }, [id, reset, router]);

  const onUpdateDraft = async () => {
    try {
      setSubmitting(true);
      const payload = watch();

      await userRequest.put(`/apms/updateDraft/${id}`, payload);
      swal("Success", "Draft updated successfully", "success");
    } catch (err) {
      showErrorMessage(err, "Update failed", swal);
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitDraft = async (data) => {
    try {
      setSubmitting(true);
      await userRequest.put(`/apms/submitDraft/${id}`, data);
      swal("Success", "Draft submitted", "success").then(() =>
        router.push("/apms/my-requests")
      );
    } catch (err) {
      showErrorMessage(err, "Submit failed", swal);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 5, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>APMS Edit Draft</title>
      </Helmet>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Paper sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <Typography variant="h5">
                Request No: {requestData?.requestNo}
              </Typography>
              <CloseButton onClick={() => router.back()} />
            </Box>

            <Box component="form" onSubmit={handleSubmit(onSubmitDraft)}>
              <BasicInfoSection control={control} errors={errors} />

              <Divider sx={{ my: 3 }} />

              <AdvanceDetailsSection control={control} errors={errors} />

              <Divider sx={{ my: 3 }} />

              <SupportingDocumentsSection control={control} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 4,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={onUpdateDraft}
                  disabled={submitting}
                >
                  Update Draft
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </LocalizationProvider>
    </>
  );
}
