import React from "react";
import { Box, Typography } from "@mui/material";
import { fDateTime } from "src/utils/format-time";

export const MyRequestsColumns = ({ onRequestClick }) => {
  const columns = [
    {
      field: "slNo",
      headerName: "Request No.",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              color: "#1976d2",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "0.87rem",
              fontWeight: 600,
              "&:hover": { color: "#1565c0" },
            }}
            onClick={() => onRequestClick && onRequestClick(params.row)}
          >
            {params.value || params.row.requestNo || params.row._id || "-"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const dateValue = params.value || params.row.createdAt;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {dateValue ? fDateTime(dateValue) : "-"}
          </Box>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const status = params.value || "";
        const displayStatus =
          status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {displayStatus || "-"}
          </Box>
        );
      },
    },
    {
      field: "proposedSpoc",
      headerName: "Proposed SPOC",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value || "-"}
        </Box>
      ),
    },
    {
      field: "businessVertical",
      headerName: "Business Vertical",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value;
        let displayValue = "-";
        if (typeof value === "object" && value?.name) {
          displayValue = value.name;
        } else if (value) {
          displayValue = value;
        }
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {displayValue}
          </Box>
        );
      },
    },
    {
      field: "location",
      headerName: "Location",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value;
        let displayValue = "-";
        if (typeof value === "object" && value?.location) {
          displayValue = `${value.location}${
            value.deliveryAddress ? `, ${value.deliveryAddress}` : ""
          }`;
        } else if (value) {
          displayValue = value;
        }
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {displayValue}
          </Box>
        );
      },
    },
    {
      field: "function",
      headerName: "Function",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value;
        let displayValue = "-";
        if (typeof value === "object" && value?.name) {
          displayValue = value.name;
        } else if (value) {
          displayValue = value;
        }
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {displayValue}
          </Box>
        );
      },
    },
    {
      field: "businessPlantCode",
      headerName: "Plant Code",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value || params.row.plantCode;
        let displayValue = "-";
        if (typeof value === "object" && value?.plantCode) {
          displayValue = value.plantCode;
        } else if (value) {
          displayValue = value;
        }
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {displayValue}
          </Box>
        );
      },
    },
    {
      field: "contactPersonName",
      headerName: "Contact Person",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value || "-"}
        </Box>
      ),
    },
    {
      field: "contactPersonNumber",
      headerName: "Contact Number",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value || "-"}
        </Box>
      ),
    },
    {
      field: "deliveryAddress",
      headerName: "Delivery Address",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value || "-"}
        </Box>
      ),
    },
    {
      field: "state",
      headerName: "State",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value || "-"}
        </Box>
      ),
    },
    {
      field: "postalCode",
      headerName: "Postal Code",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value || "-"}
        </Box>
      ),
    },
    {
      field: "country",
      headerName: "Country",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value || "-"}
        </Box>
      ),
    },
    {
      field: "totalCost",
      headerName: "Total Cost",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value || params.row.technicalAspect?.totalCost;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {value !== null && value !== undefined
              ? `₹${Number(value).toLocaleString()}`
              : "-"}
          </Box>
        );
      },
    },
    {
      field: "expectedImplementationDate",
      headerName: "Expected Implementation Date",
      width: 220,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const dateValue =
          params.value || params.row.technicalAspect?.dateOfImplementation;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {dateValue ? fDateTime(dateValue) : "-"}
          </Box>
        );
      },
    },
    // Technical Aspect Fields
    {
      field: "applicationDetails",
      headerName: "Application Details",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value =
          params.value || params.row.technicalAspect?.applicationDetails;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={value || ""}
          >
            {value || "-"}
          </Box>
        );
      },
    },
    {
      field: "acceptanceCriteria",
      headerName: "Acceptance Criteria",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value =
          params.value || params.row.technicalAspect?.acceptanceCriteria;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={value || ""}
          >
            {value || "-"}
          </Box>
        );
      },
    },
    {
      field: "currentScenario",
      headerName: "Current Scenario",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value =
          params.value || params.row.technicalAspect?.currentScenario;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={value || ""}
          >
            {value || "-"}
          </Box>
        );
      },
    },
    {
      field: "proposedAfterScenario",
      headerName: "Proposed After Scenario",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value =
          params.value || params.row.technicalAspect?.proposedScenario;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={value || ""}
          >
            {value || "-"}
          </Box>
        );
      },
    },
    {
      field: "capacityAlignment",
      headerName: "Capacity Alignment",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value =
          params.value || params.row.technicalAspect?.capacityAlignment;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              maxWidth: 180,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={value || ""}
          >
            {value || "-"}
          </Box>
        );
      },
    },
    {
      field: "alternateMakeTechnology",
      headerName: "Technology Evaluation",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value =
          params.value || params.row.technicalAspect?.technologyEvaluation;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={value || ""}
          >
            {value || "-"}
          </Box>
        );
      },
    },
    // Modification Fields
    {
      field: "modificationOrUpgrade",
      headerName: "Modification/Upgrade",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value || params.row.modification?.modification;
        let displayValue = "-";
        if (
          value === true ||
          value === "Yes" ||
          value === "Modification" ||
          value === "Upgrade"
        ) {
          displayValue = "Yes";
        } else if (value === false || value === "No") {
          displayValue = "No";
        } else if (value) {
          displayValue = value;
        }
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {displayValue}
          </Box>
        );
      },
    },
    {
      field: "challengesInPresentSystem",
      headerName: "Challenges in Present System",
      width: 220,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value || params.row.modification?.challenges;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              maxWidth: 220,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={value || ""}
          >
            {value || "-"}
          </Box>
        );
      },
    },
    {
      field: "vendorOEM",
      headerName: "Vendor/OEM",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value || params.row.modification?.vendorOEM;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {value || "-"}
          </Box>
        );
      },
    },
    {
      field: "previousModificationHistory",
      headerName: "Previous Modification History",
      width: 220,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value || params.row.modification?.previousHistory;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              maxWidth: 220,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={value || ""}
          >
            {value || "-"}
          </Box>
        );
      },
    },
    {
      field: "oldPOReference",
      headerName: "Old PO Reference",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value || params.row.modification?.oldPO;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {value || "-"}
          </Box>
        );
      },
    },
    {
      field: "oldAssetCode",
      headerName: "Old Asset Code",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value || params.row.modification?.oldAssetCode;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {value || "-"}
          </Box>
        );
      },
    },
    // Finance Aspect Fields
    {
      field: "reasonForNeed",
      headerName: "Reason for Need",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value || params.row.financeAspect?.reason;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={value || ""}
          >
            {value || "-"}
          </Box>
        );
      },
    },
    {
      field: "benefitsOnInvestment",
      headerName: "Benefits on Investment",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value || params.row.financeAspect?.benefits;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={value || ""}
          >
            {value || "-"}
          </Box>
        );
      },
    },
    {
      field: "budgetBasicCost",
      headerName: "Budget Basic Cost",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value || params.row.financeAspect?.budget;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {value !== null && value !== undefined && value !== ""
              ? `₹${Number(value).toLocaleString()}`
              : "-"}
          </Box>
        );
      },
    },
    {
      field: "impactOnBusiness",
      headerName: "Impact on Business",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value || params.row.financeAspect?.impact;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={value || ""}
          >
            {value || "-"}
          </Box>
        );
      },
    },
    {
      field: "newAssetCode",
      headerName: "New Asset Code",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value || params.row.financeAspect?.newAssetCode;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {value || "-"}
          </Box>
        );
      },
    },
    {
      field: "businessCaseROI",
      headerName: "Business Case ROI",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value || params.row.financeAspect?.roiPayback;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {value || "-"}
          </Box>
        );
      },
    },
    // Supporting Documents Fields
    {
      field: "rfq",
      headerName: "RFQ Documents",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const documents =
          params.value || params.row.supportingDocuments?.rfq || [];
        const count = Array.isArray(documents)
          ? documents.length
          : documents
          ? 1
          : 0;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {count > 0 ? `${count} file(s)` : "-"}
          </Box>
        );
      },
    },
    {
      field: "drawings",
      headerName: "Drawings",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const documents =
          params.value || params.row.supportingDocuments?.drawings || [];
        const count = Array.isArray(documents)
          ? documents.length
          : documents
          ? 1
          : 0;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {count > 0 ? `${count} file(s)` : "-"}
          </Box>
        );
      },
    },
    {
      field: "layout",
      headerName: "Layout",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const documents =
          params.value || params.row.supportingDocuments?.layout || [];
        const count = Array.isArray(documents)
          ? documents.length
          : documents
          ? 1
          : 0;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {count > 0 ? `${count} file(s)` : "-"}
          </Box>
        );
      },
    },
    {
      field: "catalogue",
      headerName: "Catalogue",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const documents =
          params.value || params.row.supportingDocuments?.catalogue || [];
        const count = Array.isArray(documents)
          ? documents.length
          : documents
          ? 1
          : 0;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {count > 0 ? `${count} file(s)` : "-"}
          </Box>
        );
      },
    },
    {
      field: "offer1",
      headerName: "Offer 1",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const documents =
          params.value || params.row.supportingDocuments?.offer1 || [];
        const count = Array.isArray(documents)
          ? documents.length
          : documents
          ? 1
          : 0;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {count > 0 ? `${count} file(s)` : "-"}
          </Box>
        );
      },
    },
    {
      field: "offer2",
      headerName: "Offer 2",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const documents =
          params.value || params.row.supportingDocuments?.offer2 || [];
        const count = Array.isArray(documents)
          ? documents.length
          : documents
          ? 1
          : 0;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {count > 0 ? `${count} file(s)` : "-"}
          </Box>
        );
      },
    },
    {
      field: "offer3",
      headerName: "Offer 3",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const documents =
          params.value || params.row.supportingDocuments?.offer3 || [];
        const count = Array.isArray(documents)
          ? documents.length
          : documents
          ? 1
          : 0;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {count > 0 ? `${count} file(s)` : "-"}
          </Box>
        );
      },
    },
    {
      field: "previousHistory",
      headerName: "Previous History",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const documents =
          params.value ||
          params.row.supportingDocuments?.previousHistoryPresentStatus ||
          [];
        const count = Array.isArray(documents)
          ? documents.length
          : documents
          ? 1
          : 0;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {count > 0 ? `${count} file(s)` : "-"}
          </Box>
        );
      },
    },
    {
      field: "projectStatus",
      headerName: "Project Status",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value;
        let displayValue = "-";
        if (value === true || value === "Active") {
          displayValue = "Active";
        } else if (value === false || value === "Inactive") {
          displayValue = "Inactive";
        } else if (value) {
          displayValue = value;
        }
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {displayValue}
          </Box>
        );
      },
    },
  ];

  return columns;
};
