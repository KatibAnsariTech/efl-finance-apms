import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
} from "@mui/material";
import { Save, Send } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import BasicInformationSection from "../components/BasicInformationSection";
import TechnicalAspectsSection from "../components/TechnicalAspectsSection";
import ModificationUpgradeSection from "../components/ModificationUpgradeSection";
import FinanceAspectSection from "../components/FinanceAspectSection";
import SupportingDocumentsSection from "../components/SupportingDocumentsSection";
import { userRequest } from "src/requestMethod";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";

export default function RaiseRequest() {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      proposedSpoc: "",
      date: new Date(),
      businessVertical: "",
      location: "",
      function: "",
      businessPlantCode: "",
      contactPersonName: "",
      contactPersonNumber: "",
      deliveryAddress: "",
      state: "",
      postalCode: "",
      country: "INDIA",
      capexItems: [],
      totalCost: 0,
      applicationDetails: "",
      acceptanceCriteria: "",
      currentScenario: "",
      proposedAfterScenario: "",
      expectedImplementationDate: null,
      capacityAlignment: "",
      alternateMakeTechnology: "",
      modificationOrUpgrade: "",
      previousModificationHistory: "",
      challengesInPresentSystem: "",
      vendorOEM: "",
      oldPOReference: "",
      oldAssetCode: "",
      reasonForNeed: "",
      benefitsOnInvestment: "",
      budgetBasicCost: "",
      impactOnBusiness: "",
      newAssetCode: "",
      businessCaseROI: "",
      projectStatus: "Active",
      submitCheckBox: false,
      documents: {
        rfq: "",
        drawings: "",
        layout: "",
        catalogue: "",
        offer1: "",
        offer2: "",
        offer3: "",
        previousHistory: "",
      },
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formattedData = {
        ...data,
        capexItems: data.capexItems || [],
        totalCost: calculateTotalCost(data.capexItems || []),
      };

      // const response = await userRequest.post(
      //   "/cpx/createRequest",
      //   formattedData
      // );

      // if (response.data.success) {
      //   swal("Success!", "CAPEX request submitted successfully!", "success");
      // }

      swal("Success!", "CAPEX request submitted successfully!", "success");
    } catch (error) {
      console.error("Error submitting request:", error);
      showErrorMessage(error, "Error submitting request", swal);
    } finally {
      setLoading(false);
    }
  };

  const onSaveDraft = async (data) => {
    setLoading(true);
    try {
      const formattedData = {
        ...data,
        status: "Draft",
      };

      // const response = await userRequest.post("/cpx/saveDraft", formattedData);

      // if (response.data.success) {
      //   swal("Success!", "Request saved as draft!", "success");
      // }
      swal("Success!", "Request saved as draft!", "success");
    } catch (error) {
      console.error("Error saving draft:", error);
      showErrorMessage(error, "Error saving draft", swal);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalCost = (capexItems) => {
    return capexItems.reduce((total, item) => {
      const cost = parseFloat(item.totalCost) || 0;
      return total + cost;
    }, 0);
  };

  return (
    <>
      <Helmet>
        <title>Raise CAPEX Request</title>
      </Helmet>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <BasicInformationSection control={control} errors={errors} />

              <Divider sx={{ my: 4 }} />

              <TechnicalAspectsSection
                control={control}
                setValue={setValue}
                watch={watch}
                errors={errors}
              />

              <Divider sx={{ my: 4 }} />

              <ModificationUpgradeSection
                control={control}
                errors={errors}
                watch={watch}
              />

              <Divider sx={{ my: 4 }} />

              <FinanceAspectSection control={control} errors={errors} />

              <Divider sx={{ my: 4 }} />

              <SupportingDocumentsSection
                control={control}
                setValue={setValue}
                watch={watch}
                errors={errors}
              />

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  mt: 4,
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  // startIcon={<Save />}
                  onClick={handleSubmit(onSaveDraft)}
                  disabled={loading}
                >
                  Save as draft
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  // startIcon={<Send />}
                  disabled={loading}
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
