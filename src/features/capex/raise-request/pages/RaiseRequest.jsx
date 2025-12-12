import React, { useState, useEffect } from "react";
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
import { yupResolver } from "@hookform/resolvers/yup";
import { capexFormSchema } from "../utils/validationSchemas";
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
import { useAccount } from "src/hooks/use-account";

export default function RaiseRequest() {
  const account = useAccount();
  
  // Helper function to format current date for datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(capexFormSchema),
    mode: "onChange",
    defaultValues: {
      proposedSpoc: account?.displayName || account?.username || "",
      date: getCurrentDateTime(),
      businessVertical: "",
      location: "",
      function: "",
      businessPlantCode: "",
      contactPersonName: "",
      contactPersonNumber: "",
      deliveryAddress: "",
      state: "",
      postalCode: "",
      country: "",
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
      projectStatus: "",
      submitCheckBox: false,
      documents: {
        rfq: [],
        drawings: [],
        layout: [],
        catalogue: [],
        offer1: [],
        offer2: [],
        offer3: [],
        previousHistory: [],
      },
    },
  });

  const [loading, setLoading] = useState(false);
  const [measurementUnits, setMeasurementUnits] = useState([]);
  const [unitsMap, setUnitsMap] = useState({});

  useEffect(() => {
    const fetchMeasurementUnits = async () => {
      try {
        const response = await userRequest.get("cpx/getMeasurementUnits", {
          params: {
            page: 1,
            limit: 100,
          },
        });

        if (response.data.success) {
          const units = response.data.data?.items || response.data.data?.measurementUnits || [];
          setMeasurementUnits(units);
          // Create a map for quick lookup: { _id: { unit, abbr } }
          const map = {};
          units.forEach((unit) => {
            map[unit._id] = {
              unit: unit.unit,
              abbr: unit.abbr,
            };
          });
          setUnitsMap(map);
        }
      } catch (error) {
        console.error("Error fetching measurement units:", error);
        showErrorMessage(error, "Failed to load measurement units", swal);
      }
    };

    fetchMeasurementUnits();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Map form data to API payload structure
      // Extract IDs from dropdown values (handle both string IDs and objects)
      const getFieldId = (value) => {
        if (!value) return "";
        if (typeof value === "string") return value;
        if (typeof value === "object" && value._id) return value._id;
        return "";
      };

      const formattedData = {
        businessVertical: getFieldId(data.businessVertical),
        location: getFieldId(data.location),
        function: getFieldId(data.function),
        plantCode: getFieldId(data.businessPlantCode),
        technicalAspect: {
          items: (data.capexItems || []).map((item) => ({
            capexDescription: item.description || "",
            quantity: item.quantity ? parseFloat(item.quantity) : 0,
            uom: item.uom || null, // Send ObjectId (_id) from measurement units dropdown
            specificationDetails: item.specification || "",
            cpu: item.costPerUnit ? parseFloat(item.costPerUnit) : 0,
            totalItemCost: item.totalCost ? parseFloat(item.totalCost) : 0,
          })),
          totalCost: calculateTotalCost(data.capexItems || []),
          applicationDetails: data.applicationDetails || "",
          acceptanceCriteria: data.acceptanceCriteria || "",
          currentScenario: data.currentScenario || "",
          proposedScenario: data.proposedAfterScenario || "",
          dateOfImplementation: data.expectedImplementationDate 
            ? new Date(data.expectedImplementationDate).toISOString()
            : null,
          capacityAlignment: data.capacityAlignment || "",
          technologyEvaluation: data.alternateMakeTechnology || "",
        },
        modification: {
          modification: data.modificationOrUpgrade === "Yes",
          challenges: data.challengesInPresentSystem || "",
          vendorOEM: data.vendorOEM || "",
          previousHistory: data.previousModificationHistory || "",
          oldPO: data.oldPOReference || "",
          oldAssetCode: data.oldAssetCode || "",
        },
        financeAspect: {
          reason: data.reasonForNeed || "",
          benefits: data.benefitsOnInvestment || "",
          budget: data.budgetBasicCost ? parseFloat(data.budgetBasicCost) : 0,
          impact: data.impactOnBusiness || "",
          newAssetCode: data.newAssetCode || "",
          roiPayback: data.businessCaseROI || "",
        },
        supportingDocuments: {
          rfq: data.documents?.rfq ? (Array.isArray(data.documents.rfq) ? data.documents.rfq : [data.documents.rfq]) : [],
          drawings: data.documents?.drawings ? (Array.isArray(data.documents.drawings) ? data.documents.drawings : [data.documents.drawings]) : [],
          layout: data.documents?.layout ? (Array.isArray(data.documents.layout) ? data.documents.layout : [data.documents.layout]) : [],
          catalogue: data.documents?.catalogue ? (Array.isArray(data.documents.catalogue) ? data.documents.catalogue : [data.documents.catalogue]) : [],
          offer1: data.documents?.offer1 ? (Array.isArray(data.documents.offer1) ? data.documents.offer1 : [data.documents.offer1]) : [],
          offer2: data.documents?.offer2 ? (Array.isArray(data.documents.offer2) ? data.documents.offer2 : [data.documents.offer2]) : [],
          offer3: data.documents?.offer3 ? (Array.isArray(data.documents.offer3) ? data.documents.offer3 : [data.documents.offer3]) : [],
          previousHistoryPresentStatus: data.documents?.previousHistory ? (Array.isArray(data.documents.previousHistory) ? data.documents.previousHistory : [data.documents.previousHistory]) : [],
        },
        expectedImplementationDate: data.expectedImplementationDate 
          ? new Date(data.expectedImplementationDate).toISOString()
          : null,
        status: "Pending",
        projectStatus: data.projectStatus === "Active" || data.projectStatus === true,
        submitCheckBox: data.submitCheckBox || false,
      };

      const response = await userRequest.post(
        "/cpx/createForm",
        formattedData
      );

      if (response.data.success) {
        swal("Success!", "CAPEX request submitted successfully!", "success");
        // Reset form to default values
        reset({
          proposedSpoc: account?.displayName || account?.username || "",
          date: getCurrentDateTime(),
          businessVertical: "",
          location: "",
          function: "",
          businessPlantCode: "",
          contactPersonName: "",
          contactPersonNumber: "",
          deliveryAddress: "",
          state: "",
          postalCode: "",
          country: "",
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
          projectStatus: "",
          submitCheckBox: false,
          documents: {
            rfq: [],
            drawings: [],
            layout: [],
            catalogue: [],
            offer1: [],
            offer2: [],
            offer3: [],
            previousHistory: [],
          },
        });
      } else {
        throw new Error(response.data.message || "Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      showErrorMessage(error, "Error submitting request", swal);
    } finally {
      setLoading(false);
    }
  };

  const onSaveDraft = async () => {
    setLoading(true);
    try {
      // Get current form values without validation
      const formValues = watch();
      
      // Extract IDs from dropdown values (handle both string IDs and objects)
      const getFieldId = (value) => {
        if (!value) return "";
        if (typeof value === "string") return value;
        if (typeof value === "object" && value._id) return value._id;
        return "";
      };

      const formattedData = {
        businessVertical: getFieldId(formValues.businessVertical),
        location: getFieldId(formValues.location),
        function: getFieldId(formValues.function),
        plantCode: getFieldId(formValues.businessPlantCode),
        technicalAspect: {
          items: (formValues.capexItems || []).map((item) => ({
            capexDescription: item.description || "",
            quantity: item.quantity ? parseFloat(item.quantity) : 0,
            uom: item.uom || null,
            specificationDetails: item.specification || "",
            cpu: item.costPerUnit ? parseFloat(item.costPerUnit) : 0,
            totalItemCost: item.totalCost ? parseFloat(item.totalCost) : 0,
          })),
          totalCost: calculateTotalCost(formValues.capexItems || []),
          applicationDetails: formValues.applicationDetails || "",
          acceptanceCriteria: formValues.acceptanceCriteria || "",
          currentScenario: formValues.currentScenario || "",
          proposedScenario: formValues.proposedAfterScenario || "",
          dateOfImplementation: formValues.expectedImplementationDate 
            ? new Date(formValues.expectedImplementationDate).toISOString()
            : null,
          capacityAlignment: formValues.capacityAlignment || "",
          technologyEvaluation: formValues.alternateMakeTechnology || "",
        },
        modification: {
          modification: formValues.modificationOrUpgrade === "Yes",
          challenges: formValues.challengesInPresentSystem || "",
          vendorOEM: formValues.vendorOEM || "",
          previousHistory: formValues.previousModificationHistory || "",
          oldPO: formValues.oldPOReference || "",
          oldAssetCode: formValues.oldAssetCode || "",
        },
        financeAspect: {
          reason: formValues.reasonForNeed || "",
          benefits: formValues.benefitsOnInvestment || "",
          budget: formValues.budgetBasicCost ? parseFloat(formValues.budgetBasicCost) : 0,
          impact: formValues.impactOnBusiness || "",
          newAssetCode: formValues.newAssetCode || "",
          roiPayback: formValues.businessCaseROI || "",
        },
        supportingDocuments: {
          rfq: formValues.documents?.rfq ? (Array.isArray(formValues.documents.rfq) ? formValues.documents.rfq : [formValues.documents.rfq]) : [],
          drawings: formValues.documents?.drawings ? (Array.isArray(formValues.documents.drawings) ? formValues.documents.drawings : [formValues.documents.drawings]) : [],
          layout: formValues.documents?.layout ? (Array.isArray(formValues.documents.layout) ? formValues.documents.layout : [formValues.documents.layout]) : [],
          catalogue: formValues.documents?.catalogue ? (Array.isArray(formValues.documents.catalogue) ? formValues.documents.catalogue : [formValues.documents.catalogue]) : [],
          offer1: formValues.documents?.offer1 ? (Array.isArray(formValues.documents.offer1) ? formValues.documents.offer1 : [formValues.documents.offer1]) : [],
          offer2: formValues.documents?.offer2 ? (Array.isArray(formValues.documents.offer2) ? formValues.documents.offer2 : [formValues.documents.offer2]) : [],
          offer3: formValues.documents?.offer3 ? (Array.isArray(formValues.documents.offer3) ? formValues.documents.offer3 : [formValues.documents.offer3]) : [],
          previousHistoryPresentStatus: formValues.documents?.previousHistory ? (Array.isArray(formValues.documents.previousHistory) ? formValues.documents.previousHistory : [formValues.documents.previousHistory]) : [],
        },
        expectedImplementationDate: formValues.expectedImplementationDate 
          ? new Date(formValues.expectedImplementationDate).toISOString()
          : null,
        projectStatus: formValues.projectStatus === "Active" || formValues.projectStatus === true,
        submitCheckBox: formValues.submitCheckBox || false,
      };

      const response = await userRequest.post("/cpx/saveDraft", formattedData);

      if (response.data.success) {
      swal("Success!", "Request saved as draft!", "success");
        // Reset form to default values
        reset({
          proposedSpoc: account?.displayName || account?.username || "",
          date: getCurrentDateTime(),
          businessVertical: "",
          location: "",
          function: "",
          businessPlantCode: "",
          contactPersonName: "",
          contactPersonNumber: "",
          deliveryAddress: "",
          state: "",
          postalCode: "",
          country: "",
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
          projectStatus: "",
          submitCheckBox: false,
          documents: {
            rfq: [],
            drawings: [],
            layout: [],
            catalogue: [],
            offer1: [],
            offer2: [],
            offer3: [],
            previousHistory: [],
          },
        });
      } else {
        throw new Error(response.data.message || "Failed to save draft");
      }
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
                trigger={trigger}
                measurementUnits={measurementUnits}
                unitsMap={unitsMap}
              />

              <Divider sx={{ my: 4 }} />

              <ModificationUpgradeSection
                control={control}
                errors={errors}
                watch={watch}
              />

              <Divider sx={{ my: 4 }} />

              <FinanceAspectSection control={control} />

              <Divider sx={{ my: 4 }} />

              <SupportingDocumentsSection
                control={control}
                setValue={setValue}
                watch={watch}
                errors={errors}
                trigger={trigger}
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
                  onClick={onSaveDraft}
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
