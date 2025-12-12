import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { capexFormSchema } from "../../raise-request/utils/validationSchemas";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import BasicInformationSection from "../../raise-request/components/BasicInformationSection";
import TechnicalAspectsSection from "../../raise-request/components/TechnicalAspectsSection";
import ModificationUpgradeSection from "../../raise-request/components/ModificationUpgradeSection";
import FinanceAspectSection from "../../raise-request/components/FinanceAspectSection";
import SupportingDocumentsSection from "../../raise-request/components/SupportingDocumentsSection";
import { userRequest } from "src/requestMethod";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import { useParams, useRouter } from "src/routes/hooks";
import CloseButton from "src/routes/components/CloseButton";

export default function DraftEdit() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(null);
  const [measurementUnits, setMeasurementUnits] = useState([]);
  const [unitsMap, setUnitsMap] = useState({});

  // Helper function to format date for datetime-local input
  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
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
  });

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
      }
    };

    fetchMeasurementUnits();
  }, []);

  useEffect(() => {
    const fetchDraftData = async () => {
      try {
        setLoading(true);
        const response = await userRequest.get(`/cpx/getFormById/${id}`);

        if (response.data?.success || response.data?.statusCode === 200) {
          const data = response.data.data || response.data;
          setFormData(data);

          // Map API data to form structure
          const formValues = {
            proposedSpoc: data.requesterId?.user?.username || data.requesterId?.proposedSPOC || "",
            date: formatDateTimeLocal(data.createdAt),
            businessVertical: data.businessVertical?._id || "",
            location: data.location?._id || "",
            function: data.function?._id || "",
            businessPlantCode: data.plantCode?._id || "",
            contactPersonName: data.requesterId?.contactPersonName || "",
            contactPersonNumber: data.requesterId?.contactPersonNumber || "",
            deliveryAddress: data.location?.deliveryAddress || "",
            state: data.location?.state || "",
            postalCode: data.location?.postalCode || "",
            country: "INDIA",
            capexItems: data.technicalAspect?.items?.map((item) => ({
              description: item.capexDescription || "",
              quantity: item.quantity || 0,
              uom: item.uom?._id || item.uom || "",
              specification: item.specificationDetails || "",
              costPerUnit: item.cpu || 0,
              totalCost: item.totalItemCost || 0,
            })) || [],
            totalCost: data.technicalAspect?.totalCost || 0,
            applicationDetails: data.technicalAspect?.applicationDetails || "",
            acceptanceCriteria: data.technicalAspect?.acceptanceCriteria || "",
            currentScenario: data.technicalAspect?.currentScenario || "",
            proposedAfterScenario: data.technicalAspect?.proposedScenario || "",
            expectedImplementationDate: data.expectedImplementationDate 
              ? new Date(data.expectedImplementationDate) 
              : null,
            capacityAlignment: data.technicalAspect?.capacityAlignment || "",
            alternateMakeTechnology: data.technicalAspect?.technologyEvaluation || "",
            modificationOrUpgrade: data.modification?.modification ? "Yes" : "No",
            previousModificationHistory: data.modification?.previousHistory || "",
            challengesInPresentSystem: data.modification?.challenges || "",
            vendorOEM: data.modification?.vendorOEM || "",
            oldPOReference: data.modification?.oldPO || "",
            oldAssetCode: data.modification?.oldAssetCode || "",
            reasonForNeed: data.financeAspect?.reason || "",
            benefitsOnInvestment: data.financeAspect?.benefits || "",
            budgetBasicCost: data.financeAspect?.budget || "",
            impactOnBusiness: data.financeAspect?.impact || "",
            newAssetCode: data.financeAspect?.newAssetCode || "",
            businessCaseROI: data.financeAspect?.roiPayback || "",
            projectStatus: data.projectStatus ? "Active" : "Inactive",
            submitCheckBox: data.submitCheckBox || false,
            documents: {
              rfq: data.supportingDocuments?.rfq || [],
              drawings: data.supportingDocuments?.drawings || [],
              layout: data.supportingDocuments?.layout || [],
              catalogue: data.supportingDocuments?.catalogue || [],
              offer1: data.supportingDocuments?.offer1 || [],
              offer2: data.supportingDocuments?.offer2 || [],
              offer3: data.supportingDocuments?.offer3 || [],
              previousHistory: data.supportingDocuments?.previousHistoryPresentStatus || [],
            },
          };

          reset(formValues);
        } else {
          throw new Error(response.data.message || "Failed to fetch draft data");
        }
      } catch (error) {
        console.error("Error fetching draft data:", error);
        showErrorMessage(error, "Failed to fetch draft", swal);
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDraftData();
    }
  }, [id, reset, router]);

  const calculateTotalCost = (capexItems) => {
    return capexItems.reduce((total, item) => {
      const cost = parseFloat(item.totalCost) || 0;
      return total + cost;
    }, 0);
  };

  const formatFormData = (data) => {
    // Extract IDs from dropdown values (handle both string IDs and objects)
    const getFieldId = (value) => {
      if (!value) return "";
      if (typeof value === "string") return value;
      if (typeof value === "object" && value._id) return value._id;
      return "";
    };

    return {
      businessVertical: getFieldId(data.businessVertical),
      location: getFieldId(data.location),
      function: getFieldId(data.function),
      plantCode: getFieldId(data.businessPlantCode),
      technicalAspect: {
        items: (data.capexItems || []).map((item) => ({
          capexDescription: item.description || "",
          quantity: item.quantity ? parseFloat(item.quantity) : 0,
          uom: item.uom || null,
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
      projectStatus: data.projectStatus === "Active" || data.projectStatus === true,
      submitCheckBox: data.submitCheckBox || false,
    };
  };

  const onUpdateDraft = async () => {
    setSubmitting(true);
    try {
      const formValues = watch();
      const formattedData = formatFormData(formValues);

      const response = await userRequest.put(`/cpx/updateDraft/${id}`, formattedData);

      if (response.data?.success || response.data?.statusCode === 200) {
        swal("Success!", "Draft updated successfully!", "success");
      } else {
        throw new Error(response.data.message || "Failed to update draft");
      }
    } catch (error) {
      console.error("Error updating draft:", error);
      showErrorMessage(error, "Error updating draft", swal);
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitDraft = async (data) => {
    setSubmitting(true);
    try {
      const formattedData = formatFormData(data);

      const response = await userRequest.put(`/cpx/submitDraft/${id}`, formattedData);

      if (response.data?.success || response.data?.statusCode === 200) {
        swal("Success!", "Draft submitted successfully!", "success").then(() => {
          router.push("/capex/my-requests");
        });
      } else {
        throw new Error(response.data.message || "Failed to submit draft");
      }
    } catch (error) {
      console.error("Error submitting draft:", error);
      showErrorMessage(error, "Error submitting draft", swal);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!formData) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Typography>Draft not found</Typography>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Draft - {formData.slNo || id}</title>
      </Helmet>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                Request No: {formData.slNo || "-"}
              </Typography>
              <CloseButton
                onClick={() => router.back()}
                tooltip="Back to My Requests"
              />
            </Box>

            <Box component="form" onSubmit={handleSubmit(onSubmitDraft)}>
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
                  onClick={onUpdateDraft}
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20} /> : null}
                >
                  {submitting ? "Updating..." : "Update Draft"}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20} /> : null}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </LocalizationProvider>
    </>
  );
}

