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

  // Temporary dummy data for testing
  const getDummyData = () => {
    return {
      _id: requestNo,
      requestNo: requestNo,
      proposedSpoc: "John Doe",
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      businessVertical: { _id: "bv1", name: "Manufacturing" },
      location: { _id: "loc1", location: "Mumbai", deliveryAddress: "123 Main St", postalCode: "400001", state: "Maharashtra" },
      function: { _id: "func1", name: "Operations" },
      plantCode: { _id: "pc1", plantCode: "PLT001" },
      contactPersonName: "Jane Smith",
      contactPersonNumber: "9876543210",
      deliveryAddress: "123 Main Street",
      state: "Maharashtra",
      postalCode: "400001",
      country: "INDIA",
      technicalAspect: {
        items: [
          {
            capexDescription: "Machinery Equipment",
            quantity: 5,
            uom: { _id: "uom1", unit: "Units", abbr: "U" },
            specificationDetails: "Heavy duty machinery",
            cpu: 100000,
            totalItemCost: 500000,
          },
          {
            capexDescription: "IT Infrastructure",
            quantity: 10,
            uom: { _id: "uom2", unit: "Units", abbr: "U" },
            specificationDetails: "Servers and networking equipment",
            cpu: 50000,
            totalItemCost: 500000,
          },
        ],
        totalCost: 1000000,
        applicationDetails: "For production line expansion",
        acceptanceCriteria: "Must meet quality standards",
        currentScenario: "Current equipment is outdated",
        proposedScenario: "New equipment will increase efficiency by 30%",
        dateOfImplementation: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        capacityAlignment: "Aligned with business goals",
        technologyEvaluation: "Latest technology available",
      },
      modification: {
        modification: true,
        challenges: "Current system has frequent breakdowns",
        vendorOEM: "ABC Manufacturing",
        previousHistory: "Previous upgrade done in 2020",
        oldPO: "PO-2020-001",
        oldAssetCode: "AST-001",
      },
      financeAspect: {
        reason: "Business expansion requirement",
        benefits: "Increased productivity and reduced downtime",
        budget: 1200000,
        impact: "Positive impact on revenue",
        newAssetCode: "AST-002",
        roiPayback: "Expected ROI in 2 years",
      },
      supportingDocuments: {
        rfq: ["https://example.com/rfq1.pdf"],
        drawings: ["https://example.com/drawing1.pdf"],
        layout: ["https://example.com/layout1.pdf"],
        catalogue: ["https://example.com/catalogue1.pdf"],
        offer1: ["https://example.com/offer1.pdf"],
        offer2: ["https://example.com/offer2.pdf"],
        offer3: ["https://example.com/offer3.pdf"],
        previousHistoryPresentStatus: ["https://example.com/history1.pdf"],
      },
      projectStatus: true,
      submitCheckBox: true,
      status: "Pending",
    };
  };

  const fetchFormData = async () => {
    try {
      setLoading(true);
      
      // TEMPORARY: Use dummy data for testing
      // Uncomment the API call below when ready
      /*
      const response = await userRequest.get(`/cpx/getFormById`, {
        params: { id: requestNo },
      });

      if (response.data?.success || response.data?.statusCode === 200) {
        const data = response.data.data || response.data;
        setFormData(data);
      */
      
      // TEMPORARY: Using dummy data
      const data = getDummyData();
      setFormData(data);
        
        // Map API data to form structure
        const formValues = {
          proposedSpoc: data.proposedSpoc || "",
          date: formatDateTimeLocal(data.date || data.createdAt),
          businessVertical: data.businessVertical?._id || data.businessVertical || "",
          location: data.location?._id || data.location || "",
          function: data.function?._id || data.function || "",
          businessPlantCode: data.plantCode?._id || data.plantCode || data.businessPlantCode || "",
          contactPersonName: data.contactPersonName || "",
          contactPersonNumber: data.contactPersonNumber || "",
          deliveryAddress: data.deliveryAddress || "",
          state: data.state || "",
          postalCode: data.postalCode || "",
          country: data.country || "INDIA",
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
          expectedImplementationDate: data.technicalAspect?.dateOfImplementation || null,
          capacityAlignment: data.technicalAspect?.capacityAlignment || "",
          alternateMakeTechnology: data.technicalAspect?.technologyEvaluation || "",
          modificationOrUpgrade: data.modification?.modification ? "Modification" : "",
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
      /* TEMPORARY: Uncomment when API is ready
      } else {
        throw new Error(response.data.message || "Failed to fetch form data");
      }
      */
    } catch (error) {
      console.error("Error fetching form data:", error);
      // TEMPORARY: Fallback to dummy data on error
      const dummyData = getDummyData();
      setFormData(dummyData);
      const formValues = {
        proposedSpoc: dummyData.proposedSpoc || "",
        date: formatDateTimeLocal(dummyData.date || dummyData.createdAt),
        businessVertical: dummyData.businessVertical?._id || dummyData.businessVertical || "",
        location: dummyData.location?._id || dummyData.location || "",
        function: dummyData.function?._id || dummyData.function || "",
        businessPlantCode: dummyData.plantCode?._id || dummyData.plantCode || dummyData.businessPlantCode || "",
        contactPersonName: dummyData.contactPersonName || "",
        contactPersonNumber: dummyData.contactPersonNumber || "",
        deliveryAddress: dummyData.deliveryAddress || "",
        state: dummyData.state || "",
        postalCode: dummyData.postalCode || "",
        country: dummyData.country || "INDIA",
        capexItems: dummyData.technicalAspect?.items?.map((item) => ({
          description: item.capexDescription || "",
          quantity: item.quantity || 0,
          uom: item.uom?._id || item.uom || "",
          specification: item.specificationDetails || "",
          costPerUnit: item.cpu || 0,
          totalCost: item.totalItemCost || 0,
        })) || [],
        totalCost: dummyData.technicalAspect?.totalCost || 0,
        applicationDetails: dummyData.technicalAspect?.applicationDetails || "",
        acceptanceCriteria: dummyData.technicalAspect?.acceptanceCriteria || "",
        currentScenario: dummyData.technicalAspect?.currentScenario || "",
        proposedAfterScenario: dummyData.technicalAspect?.proposedScenario || "",
        expectedImplementationDate: dummyData.technicalAspect?.dateOfImplementation || null,
        capacityAlignment: dummyData.technicalAspect?.capacityAlignment || "",
        alternateMakeTechnology: dummyData.technicalAspect?.technologyEvaluation || "",
        modificationOrUpgrade: dummyData.modification?.modification ? "Modification" : "",
        previousModificationHistory: dummyData.modification?.previousHistory || "",
        challengesInPresentSystem: dummyData.modification?.challenges || "",
        vendorOEM: dummyData.modification?.vendorOEM || "",
        oldPOReference: dummyData.modification?.oldPO || "",
        oldAssetCode: dummyData.modification?.oldAssetCode || "",
        reasonForNeed: dummyData.financeAspect?.reason || "",
        benefitsOnInvestment: dummyData.financeAspect?.benefits || "",
        budgetBasicCost: dummyData.financeAspect?.budget || "",
        impactOnBusiness: dummyData.financeAspect?.impact || "",
        newAssetCode: dummyData.financeAspect?.newAssetCode || "",
        businessCaseROI: dummyData.financeAspect?.roiPayback || "",
        projectStatus: dummyData.projectStatus ? "Active" : "Inactive",
        submitCheckBox: dummyData.submitCheckBox || false,
        documents: {
          rfq: dummyData.supportingDocuments?.rfq || [],
          drawings: dummyData.supportingDocuments?.drawings || [],
          layout: dummyData.supportingDocuments?.layout || [],
          catalogue: dummyData.supportingDocuments?.catalogue || [],
          offer1: dummyData.supportingDocuments?.offer1 || [],
          offer2: dummyData.supportingDocuments?.offer2 || [],
          offer3: dummyData.supportingDocuments?.offer3 || [],
          previousHistory: dummyData.supportingDocuments?.previousHistoryPresentStatus || [],
        },
      };
      reset(formValues);
      // showErrorMessage(error, "Failed to fetch request details", swal);
    } finally {
      setLoading(false);
    }
  };

  // Temporary dummy approval data
  const getDummyApprovalData = () => {
    return {
      requester: {
        username: "john.doe",
        email: "john.doe@example.com",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      steps: [
        {
          approverId: {
            username: "manager1",
            email: "manager1@example.com",
          },
          position: 1,
          status: "Approved",
          comment: "Looks good, approved for next step",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          approverId: {
            username: "finance.head",
            email: "finance.head@example.com",
          },
          position: 2,
          status: "Pending",
          comment: "",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: null,
        },
      ],
    };
  };

  const fetchApprovalInfo = async () => {
    try {
      // TEMPORARY: Use dummy data for testing
      // Uncomment the API call below when ready
      /*
      const response = await userRequest.get(`/cpx/getFormSteps`, {
        params: { formId: requestNo },
      });

      if (response.data?.statusCode === 200 && response.data?.data) {
        setApprovalData(response.data.data);
        // Check if current user is assigned
        const steps = response.data.data.steps || [];
        const currentUser = JSON.parse(localStorage.getItem("user"))?.username || 
                          JSON.parse(localStorage.getItem("user"))?.email;
        const isAssigned = steps.some(
          (step) =>
            step.approverId?.username === currentUser ||
            step.approverId?.email === currentUser ||
            (Array.isArray(step.approverId) &&
              step.approverId.some(
                (approver) =>
                  approver?.username === currentUser ||
                  approver?.email === currentUser
              ))
        );
        setAssigned(isAssigned && steps.some((step) => step.status === "Pending"));
      }
      */
      
      // TEMPORARY: Using dummy approval data
      const dummyApprovalData = getDummyApprovalData();
      setApprovalData(dummyApprovalData);
      
      // TEMPORARY: Set assigned to true for testing (you can change this)
      setAssigned(true);
    } catch (error) {
      console.error("Error fetching approval info:", error);
      // TEMPORARY: Fallback to dummy data on error
      const dummyApprovalData = getDummyApprovalData();
      setApprovalData(dummyApprovalData);
      setAssigned(true);
    }
  };

  useEffect(() => {
    if (requestNo) {
      fetchFormData();
      fetchApprovalInfo();
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
        await fetchApprovalInfo();
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
              <BasicInformationSection control={control} errors={errors} />

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

