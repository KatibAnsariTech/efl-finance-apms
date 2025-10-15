import React, { useState } from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { fDateTime } from "src/utils/format-time";
import { userRequest } from "src/requestMethod";

export const SubmittedColumns = () => {
  const router = useRouter();
  const [loadingStates, setLoadingStates] = useState({});

  const handleDownload = async (finalReqNo, endpoint, filename, type) => {
    const loadingKey = `${type}-${finalReqNo}`;
    
    try {
      setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));
      
      const response = await userRequest.get(endpoint, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  return [
    {
      field: "FinalReqNo",
      headerName: "Final Request No.",
      flex: 1,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          sx={{
            color: "#1976d2",
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: 600,
            "&:hover": { color: "#1565c0" },
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
          onClick={() => router.push(`/custom-duty/raise-to-bank/submit-detail/${params.row.FinalReqNo}`)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Submitted At",
      flex: 1,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {fDateTime(params.value)}
        </Typography>
      ),
    },
    {
      field: "totalItems",
      headerName: "Total Records",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography 
          sx={{ 
            fontWeight: 600,
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "approvedRecords",
      headerName: "Approved Records",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const loadingKey = `approved-${params.row.FinalReqNo}`;
        const isLoading = loadingStates[loadingKey];
        
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              gap: 1,
            }}
          >
            {isLoading && <CircularProgress size={16} />}
            <Typography
              sx={{
                color: isLoading ? "#666" : "#1976d2",
                textDecoration: "underline",
                cursor: isLoading ? "not-allowed" : "pointer",
                fontWeight: 600,
                "&:hover": { color: isLoading ? "#666" : "#1565c0" },
                fontSize: "0.875rem",
                opacity: isLoading ? 0.7 : 1,
              }}
              onClick={() => {
                if (!isLoading) {
                  handleDownload(
                    params.row.FinalReqNo,
                    `/custom/exportItemsByFinalReqNo/${params.row.FinalReqNo}`,
                    `approved-records-${params.row.FinalReqNo}.xlsx`,
                    'approved'
                  );
                }
              }}
            >
              {isLoading ? "Downloading..." : "Download File"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "downloadLink",
      headerName: "Submit to Bank",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const loadingKey = `bank-${params.row.FinalReqNo}`;
        const isLoading = loadingStates[loadingKey];
        
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              gap: 1,
            }}
          >
            {isLoading && <CircularProgress size={16} />}
            <Typography
              sx={{
                color: isLoading ? "#666" : "#1976d2",
                textDecoration: "underline",
                cursor: isLoading ? "not-allowed" : "pointer",
                fontWeight: 600,
                "&:hover": { color: isLoading ? "#666" : "#1565c0" },
                fontSize: "0.875rem",
                opacity: isLoading ? 0.7 : 1,
              }}
              onClick={() => {
                if (!isLoading) {
                  handleDownload(
                    params.row.FinalReqNo,
                    `/custom/exportItemsByFinalReqNoWithBankDetails/${params.row.FinalReqNo}`,
                    `raised-to-bank-${params.row.FinalReqNo}.xlsx`,
                    'bank'
                  );
                }
              }}
            >
              {isLoading ? "Downloading..." : "Download File"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "requestor",
      headerName: "Submitted by",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value?.name || "-"}
        </Typography>
      ),
    },
  ];
};
