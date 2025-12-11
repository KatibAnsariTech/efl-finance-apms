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
  TextField,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
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
import RequestCurrentStatus from "../components/RequestCurrentStatus";

export default function RequestDetail() {
  const router = useRouter();
  const { requestNo } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);
  const [approvalData, setApprovalData] = useState(null);
  const [assigned, setAssigned] = useState(false);
  const [comment, setComment] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const {
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

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



  const fetchFormData = async () => {
    try {
      setLoading(true);
      
      const response = await userRequest.get(`/cpx/getFormById/${requestNo}`);

      if (response.data?.success || response.data?.statusCode === 200) {
        const data = response.data.data || response.data;
        setFormData(data);
        
        // Set approval data from request field
        if (data.request) {
          setApprovalData(data.request);
          
          // Use isAssigned from API response
          setAssigned(data.request.isAssigned || false);
        }
        
        // Map API data to form structure
        const formValues = {
          proposedSpoc: data.requesterId?.proposedSPOC || "",
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
          expectedImplementationDate: data?.expectedDateOfImplementation || null,
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
        throw new Error(response.data.message || "Failed to fetch form data");
      }
    } catch (error) {
      console.error("Error fetching form data:", error);
      showErrorMessage(error, "Failed to fetch request details", swal);
    } finally {
      setLoading(false);
    }
  };



console.log(formData)

  useEffect(() => {
    if (requestNo) {
      fetchFormData();
    }
  }, [requestNo]);

  const handleApprovalAction = async (action) => {
    if (action === "rejected" && !comment.trim()) {
      swal("Warning", "Please provide a comment for rejection", "warning");
      return;
    }

    if (!requestNo) {
      swal("Error", "No request ID found", "error");
      return;
    }

    try {
      if (action === "approved") {
        setApproveLoading(true);
      } else {
        setRejectLoading(true);
      }

      const apiEndpoint =
        action === "approved" ? "/cpx/acceptForm" : "/cpx/declineForm";

      const response = await userRequest.post(apiEndpoint, {
        id: requestNo,
        comment: comment.trim() || (action === "approved" ? "Approved" : "Declined"),
      });

      if (response.data?.success || response.data?.statusCode === 200) {
        swal("Success", `Request ${action} successfully`, "success");
        setComment("");
        await fetchFormData();
      } else {
        throw new Error(response.data.message || `Failed to ${action} request`);
      }
    } catch (error) {
      console.error("Error performing action:", error);
      showErrorMessage(error, `Failed to ${action} request`, swal);
    } finally {
      if (action === "approved") {
        setApproveLoading(false);
      } else {
        setRejectLoading(false);
      }
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
        <Typography>Request not found</Typography>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>CAPEX Request Detail - {requestNo}</title>
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
                Request No: {requestNo}
              </Typography>
              <CloseButton
                onClick={() => router.back()}
                tooltip="Back to Requests"
              />
            </Box>

            <Box component="form">
              <BasicInformationSection control={control} errors={errors} readOnly={true} />

              <Divider sx={{ my: 4 }} />

              <TechnicalAspectsSection
                control={control}
                setValue={setValue}
                watch={watch}
                errors={errors}
                trigger={() => {}}
                measurementUnits={[]}
                unitsMap={{}}
                readOnly={true}
              />

              <Divider sx={{ my: 4 }} />

              <ModificationUpgradeSection
                control={control}
                errors={errors}
                watch={watch}
                readOnly={true}
              />

              <Divider sx={{ my: 4 }} />

              <FinanceAspectSection control={control} readOnly={true} />

              <Divider sx={{ my: 4 }} />

              <SupportingDocumentsSection
                control={control}
                setValue={setValue}
                watch={watch}
                errors={errors}
                trigger={() => {}}
                readOnly={true}
              />

              {approvalData && (
                <>
                  <Divider sx={{ my: 4 }} />
                  <Box sx={{ mt: 3 }}>
                    <RequestCurrentStatus
                      steps={approvalData.steps || []}
                      data={{
                        requester: approvalData.requester,
                        requesterId: approvalData.requester,
                        requesterRemark: formData?.requesterRemark || "",
                        createdAt: formData?.createdAt || approvalData.requester?.createdAt,
                        formId: formData,
                      }}
                    />
                  </Box>
                </>
              )}

              {assigned && (
                <Box
                  sx={{
                    mt: 4,
                    p: 3,
                    backgroundColor: "#f8f9fa",
                    borderRadius: 1,
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Approver Actions
                    </Typography>

                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleApprovalAction("approved")}
                        disabled={approveLoading || rejectLoading}
                        startIcon={
                          approveLoading ? <CircularProgress size={20} /> : null
                        }
                        sx={{ minWidth: 120 }}
                      >
                        {approveLoading ? "Processing..." : "Approve"}
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleApprovalAction("rejected")}
                        disabled={approveLoading || rejectLoading}
                        startIcon={
                          rejectLoading ? <CircularProgress size={20} /> : null
                        }
                        sx={{ minWidth: 120 }}
                      >
                        {rejectLoading ? "Processing..." : "Reject"}
                      </Button>
                    </Stack>
                  </Stack>

                  <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                    Leave a comment with your response
                  </Typography>

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    sx={{ backgroundColor: "#fff" }}
                  />
                </Box>
              )}
            </Box>
          </Paper>
        </Container>
      </LocalizationProvider>
    </>
  );
}

