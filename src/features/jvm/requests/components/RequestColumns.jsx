import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { fDateTime } from "src/utils/format-time";

export const RequestColumns = ({ onRequestClick, onSAPStatusClick }) => {
  const router = useRouter();

  const handleStatusClick = (rowData) => {
    if (onRequestClick) {
      onRequestClick(rowData);
    }
  };

  const handleViewDocuments = (documents) => {
    if (documents && documents.length > 0) {
      // Open each document in a new tab
      documents.forEach((url) => {
        window.open(url, '_blank');
      });
    }
  };

  const handleViewDocument = (documentUrl) => {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  };

  const getSAPStatus = (sapStatuses) => {
    // If no SAP statuses array or empty, return "In Progress"
    if (!sapStatuses || !Array.isArray(sapStatuses) || sapStatuses.length === 0) {
      return { label: "In Progress", color: "warning" };
    }

    // Count statuses: S = Success, E = Failure
    let successCount = 0;
    let failureCount = 0;

    sapStatuses.forEach((item) => {
      const sapStatus = item.sapStatus?.toUpperCase() || "";
      if (sapStatus === "S") {
        successCount++;
      } else if (sapStatus === "E") {
        failureCount++;
      }
      // Empty/null/other values are ignored (not counted)
    });

    const totalCount = sapStatuses.length;
    const validStatusCount = successCount + failureCount;

    // Logic:
    // 1. If all E → "Failed"
    // 2. If any E (but not all E) → "Partial Success"
    // 3. If all S → "Success"
    // 4. If no valid statuses → "In Progress"

    if (failureCount === totalCount && totalCount > 0) {
      // All are E
      return { label: "Failed", color: "error" };
    } else if (failureCount > 0) {
      // Any E exists (but not all E)
      return { label: "Partial Success", color: "info" };
    } else if (successCount === totalCount && totalCount > 0) {
      // All are S
      return { label: "Success", color: "success" };
    } else if (validStatusCount === 0) {
      // No valid statuses (all empty/null/other)
      return { label: "In Progress", color: "warning" };
    } else {
      // Fallback (shouldn't reach here, but just in case)
      return { label: "In Progress", color: "warning" };
    }
  };

  const columns = [
    {
      field: "parentId",
      headerName: "P.Id",
      flex: 1,
      minWidth: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            cursor: "pointer",
            color: "#1976d2",
            textDecoration: "underline",
            textDecorationThickness: "2px",
            textUnderlineOffset: "4px",
            fontWeight: 600,
            "&:hover": { color: "#1565c0" },
          }}
          onClick={() => {
            router.push(`/jvm/requests/${params.value}`);
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "companyId",
      headerName: "Company",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const company = params.value;
        const companyName = typeof company === "object" && company?.value 
          ? company.value 
          : typeof company === "string" 
          ? company 
          : "-";
        return (
          <Typography variant="body2">
            {companyName}
          </Typography>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => fDateTime(params.value),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            cursor: "pointer",
            color: "#1976d2",
            textDecoration: "underline",
            textDecorationThickness: "2px",
            textUnderlineOffset: "4px",
            fontWeight: 600,
            "&:hover": { color: "#1565c0" },
          }}
          onClick={() => handleStatusClick(params.row)}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "totalDebit",
      headerName: "Total Debit",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => `₹${params.value?.toLocaleString() || "0"}`,
    },
    {
      field: "totalCredit",
      headerName: "Total Credit",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => `₹${params.value?.toLocaleString() || "0"}`,
    },
    {
      field: "autoReversal",
      headerName: "Auto Reversal",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => `${params.value === true ? "Yes" : "No"}`,
    },
    {
      field: "sapStatus",
      headerName: "SAP Status",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const sapStatuses = params.row.sapStatuses || [];
        const { label, color } = getSAPStatus(sapStatuses);
        
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
            <Chip
              label={label}
              color={color}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                if (onSAPStatusClick && sapStatuses.length > 0) {
                  onSAPStatusClick(sapStatuses);
                }
              }}
              sx={{
                fontWeight: 600,
                cursor: sapStatuses.length > 0 ? "pointer" : "default",
                minWidth: "120px",
                width: "120px",
                justifyContent: "center",
                "&:hover": sapStatuses.length > 0 ? {
                  opacity: 0.8,
                } : {},
              }}
            />
          </Box>
        );
      },
    },
    {
      field: "document",
      headerName: "Document Uploaded",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const documentUrl = params.value || params.row.document;
        const hasDocument = documentUrl && documentUrl.trim() !== "";
        
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
            {hasDocument ? (
              <Typography
                variant="body2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDocument(documentUrl);
                }}
                sx={{
                  color: "#1976d2",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  textDecoration: "underline",
                  textDecorationThickness: "2px",
                  textUnderlineOffset: "4px",
                  "&:hover": {
                    color: "#1565c0",
                  },
                }}
              >
                View
              </Typography>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  color: "#8c959f",
                  fontSize: "0.875rem",
                  fontStyle: "italic",
                }}
              >
                No document
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: "supportingDocuments",
      headerName: "Supporting Documents",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const documents = params.value;
        const hasDocuments = documents && documents.length > 0;
        
        return (
          <Typography
            variant="body2"
            onClick={(e) => {
              e.stopPropagation();
              if (hasDocuments) {
                handleViewDocuments(documents);
              }
            }}
            sx={{
              color: hasDocuments ? "#1976d2" : "#8c959f",
              fontSize: "0.875rem",
              fontWeight: hasDocuments ? 500 : 400,
              fontStyle: hasDocuments ? "normal" : "italic",
              cursor: hasDocuments ? "pointer" : "default",
              textDecoration: hasDocuments ? "underline" : "none",
              textDecorationThickness: hasDocuments ? "2px" : "none",
              textUnderlineOffset: hasDocuments ? "4px" : "none",
              "&:hover": hasDocuments ? {
                color: "#1565c0",
                textDecoration: "underline",
              } : {},
            }}
          >
            {hasDocuments ? "View" : "No documents"}
          </Typography>
        );
      },
    },
  ];

  return columns;
};
