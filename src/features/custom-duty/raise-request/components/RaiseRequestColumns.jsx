import { formatDate } from "src/utils/format-time";

export const RaiseRequestColumns = () => {
  const columns = [
    {
      field: "IECNo",
      headerName: "IEC",
      width: 120,
      resizable: true,
    },
    {
      field: "locationCode",
      headerName: "Location Code",
      width: 150,
      resizable: true,
    },
    {
      field: "docType",
      headerName: "Doc type",
      width: 120,
      resizable: true,
    },
    {
      field: "docNumber",
      headerName: "Doc no.",
      width: 150,
      resizable: true,
    },
    {
      field: "docDate",
      headerName: "Doc date",
      width: 150,
      resizable: true,
      renderCell: (params) => {
        if (!params.value) return "";
        return formatDate(params.value, 'dd MMM yyyy');
      },
    },
    {
      field: "challanNo",
      headerName: "Challan no.",
      width: 150,
      resizable: true,
    },
    {
      field: "dueAmount",
      headerName: "Due Amount",
      width: 150,
      resizable: true,
      renderCell: (params) => `₹${params.value?.toLocaleString() || "0"}`,
    },
  ];

  return columns;
};
