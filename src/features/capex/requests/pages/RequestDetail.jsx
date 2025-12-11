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
import { useAccount } from "src/hooks/use-account";

export default function RequestDetail() {
  const router = useRouter();
  const { requestNo } = useParams();
  const { user } = useAccount();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);
  const [approvalData, setApprovalData] = useState(null);
  const [assigned, setAssigned] = useState(false);
  const [comment, setComment] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [clarificationLoading, setClarificationLoading] = useState(false);
  const [clarificationResponse, setClarificationResponse] = useState("");
  const [respondLoading, setRespondLoading] = useState(false);

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
          
          // Use isAssigned from API response - this is the only source to show approver actions
          setAssigned(data.request.isAssigned || false);
        } else {
          setAssigned(false);
        }
        
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
    // Map action to API format
    const actionMap = {
      approved: "Approved",
      rejected: "Declined",
      clarification: "Need Clarification",
    };

    const apiAction = actionMap[action];

    // Require comment for rejection and clarification
    if ((action === "rejected" || action === "clarification") && !comment.trim()) {
      swal("Warning", `Please provide a comment for ${action === "rejected" ? "rejection" : "clarification request"}`, "warning");
      return;
    }

    const requestNumber = formData?.slNo || formData?.requestNo || requestNo;
    if (!requestNumber) {
      swal("Error", "No request number found", "error");
      return;
    }

    try {
      if (action === "approved") {
        setApproveLoading(true);
      } else if (action === "clarification") {
        setClarificationLoading(true);
      } else {
        setRejectLoading(true);
      }

      const response = await userRequest.post("/cpx/handleApprovalAction", {
        slNo: requestNumber,
        action: apiAction,
        comment: comment.trim() || (action === "approved" ? "Approved" : apiAction),
      });

      if (response.data?.success || response.data?.statusCode === 200) {
        swal("Success", `Request ${action === "approved" ? "approved" : action === "rejected" ? "declined" : "clarification requested"} successfully`, "success");
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
      } else if (action === "clarification") {
        setClarificationLoading(false);
      } else {
        setRejectLoading(false);
      }
    }
  };

  const handleRespondToClarification = async () => {
    if (!clarificationResponse.trim()) {
      swal("Warning", "Please provide a clarification response", "warning");
      return;
    }

    const requestNumber = formData?.slNo || formData?.requestNo || requestNo;
    if (!requestNumber) {
      swal("Error", "No request number found", "error");
      return;
    }

    try {
      setRespondLoading(true);

      const response = await userRequest.post("/cpx/respondToClarification", {
        slNo: requestNumber,
        response: clarificationResponse.trim(),
      });

      if (response.data?.success || response.data?.statusCode === 200) {
        swal("Success", "Clarification response submitted successfully", "success");
        setClarificationResponse("");
        await fetchFormData();
      } else {
        throw new Error(response.data.message || "Failed to submit clarification response");
      }
    } catch (error) {
      console.error("Error submitting clarification response:", error);
      showErrorMessage(error, "Failed to submit clarification response", swal);
    } finally {
      setRespondLoading(false);
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
                        disabled={approveLoading || rejectLoading || clarificationLoading}
                        startIcon={
                          approveLoading ? <CircularProgress size={20} /> : null
                        }
                        sx={{ minWidth: 120 }}
                      >
                        {approveLoading ? "Processing..." : "Approve"}
                      </Button>
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleApprovalAction("clarification")}
                        disabled={approveLoading || rejectLoading || clarificationLoading}
                        startIcon={
                          clarificationLoading ? <CircularProgress size={20} /> : null
                        }
                        sx={{ minWidth: 160 }}
                      >
                        {clarificationLoading ? "Processing..." : "Need Clarification"}
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleApprovalAction("rejected")}
                        disabled={approveLoading || rejectLoading || clarificationLoading}
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

              {/* Clarification Response Section for Requesters and Approvers */}
              {formData && (
                (() => {
                  // Check for pending clarification step assigned to current user
                  const pendingClarificationStep = formData.request?.steps?.find(step => 
                    step.isClarification && 
                    step.status === "Pending" && 
                    !step.completedAt
                  );

                  if (!pendingClarificationStep) return null;

                  // Check if assigned to requester
                  const isAssignedToRequester = pendingClarificationStep.assignedTo === "requester";
                  
                  // Verify user is the requester (check if user email/username matches requesterId)
                  const isCurrentUserRequester = formData.requesterId && (
                    formData.requesterId.user?.email === user?.email ||
                    formData.requesterId.user?.username === user?.username ||
                    formData.requesterId.user?._id === user?._id ||
                    formData.requesterId.userId === user?._id
                  );
                  
                  // Check if current user is in the approver position's approvers list
                  // This handles cases where procurement team needs to respond to procurement head's clarification
                  const isUserInApproverPosition = pendingClarificationStep.approverPositionId?.approvers?.some(approver => 
                    approver.email === user?.email || 
                    approver.username === user?.username ||
                    approver._id === user?._id ||
                    approver.userId === user?._id
                  );

                  // For approver-to-approver clarifications (e.g., procurement head to procurement team):
                  // If the user is in the approver position's approvers list AND it's not assigned to "requester",
                  // then they should be able to respond
                  // This handles cases where assignedTo might be the approver position ID or structured differently
                  const approverPositionId = pendingClarificationStep.approverPositionId?._id;
                  const isAssignedToApproverPosition = !isAssignedToRequester && approverPositionId;
                  const canApproverRespond = isAssignedToApproverPosition && isUserInApproverPosition;

                  // Show clarification response section if:
                  // 1. Assigned to requester AND current user is the requester AND not an approver in main flow
                  // 2. Assigned to approver position (not "requester") AND current user is in that approver position's approvers list
                  //    This covers procurement team responding to procurement head's clarification
                  const shouldShowClarificationResponse = 
                    (isAssignedToRequester && isCurrentUserRequester && !assigned) || 
                    canApproverRespond;
                  
                  return shouldShowClarificationResponse ? (
                    <Box
                      sx={{
                        mt: 4,
                        p: 3,
                        backgroundColor: "#e3f2fd",
                        borderRadius: 1,
                        border: "1px solid #90caf9",
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                        Respond to Clarification Request
                      </Typography>
                      
                      <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                        Please provide your response to the clarification request
                      </Typography>

                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Enter your clarification response..."
                        value={clarificationResponse}
                        onChange={(e) => setClarificationResponse(e.target.value)}
                        sx={{ backgroundColor: "#fff", mb: 2 }}
                      />

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRespondToClarification}
                        disabled={respondLoading}
                        startIcon={
                          respondLoading ? <CircularProgress size={20} /> : null
                        }
                        sx={{ minWidth: 200 }}
                      >
                        {respondLoading ? "Submitting..." : "Submit Response"}
                      </Button>
                    </Box>
                  ) : null;
                })()
              )}
            </Box>
          </Paper>
        </Container>
      </LocalizationProvider>
    </>
  );
}

