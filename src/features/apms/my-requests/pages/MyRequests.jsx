import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Card,
  Tabs,
  Tab,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Helmet } from "react-helmet-async";
import { FormTableToolbar } from "src/components/table";
import { useRouter } from "src/routes/hooks";
import { MyRequestsColumns } from "../components/MyRequestsColumns";
import RequestStatus from "../components/RequestStatus";

/* 🔹 TEMP APPROVAL DATA */
const TEMP_APPROVAL_DATA = {
  requester: {
    username: "Katib Ansari",
    email: "katib.ansari@company.com",
  },
  createdAt: "2025-01-05T10:30:00Z",
  steps: [
    {
      approvals: [
        {
          approverId: {
            username: "Manager",
            email: "manager@company.com",
          },
          status: "Approved",
          comment: "Approved",
          created: "2025-01-06T09:00:00Z",
          updated: "2025-01-06T09:30:00Z",
        },
      ],
    },
    {
      approvals: [
        {
          approverId: {
            username: "Finance",
            email: "finance@company.com",
          },
          status: "Pending",
          comment: null,
          created: "2025-01-07T10:00:00Z",
          updated: null,
        },
      ],
    },
  ],
};

/* 🔹 DUMMY APMS DATA */
const dummyMyRequests = [
  {
    _id: "1",
    requestNo: "APMS-REQ-002",
    createdAt: "2025-01-08T14:15:00Z",
    advanceType: "Non-PO Expense",
    purpose: "Client meeting travel expenses",
    requestedAmount: 12000,
    approvedAmount: 10000,
    status: "approved",
  },
  {
    _id: "2",
    requestNo: "APMS-REQ-003",
    createdAt: "2025-01-10T09:45:00Z",
    advanceType: "ADHOC Advance",
    purpose: "Emergency vendor payment",
    requestedAmount: 25000,
    approvedAmount: null,
    status: "pending",
  },
];

export default function MyRequests() {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const [openStatus, setOpenStatus] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const tabs = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
  ];

  /* 🔹 FILTER + SEARCH LOGIC */
  useEffect(() => {
    let filtered = [...dummyMyRequests];

    if (selectedTab !== "all") {
      filtered = filtered.filter(
        (item) => item.status === selectedTab
      );
    }

    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.requestNo.toLowerCase().includes(search.toLowerCase()) ||
          item.purpose.toLowerCase().includes(search.toLowerCase())
      );
    }

    setData(filtered);
  }, [selectedTab, search]);

  const handleTabChange = (_, value) => {
    setSelectedTab(value);
  };

  const handleRequestClick = (row) => {
    if (row.status === "draft") {
      router.push(`/apms/my-requests/draft/${row._id}`);
    } else {
      router.push(`/apms/my-requests/${row._id}`);
    }
  };

  /* ✅ STATUS CLICK — TEMP DATA WIRED */
  const handleStatusClick = (row) => {
    setSelectedRow({
      ...row,
      approvalData: {
        ...TEMP_APPROVAL_DATA,
        requestNo: row.requestNo,
      },
    });
    setOpenStatus(true);
  };

  const columns = MyRequestsColumns({
    onRequestClick: handleRequestClick,
    onStatusClick: handleStatusClick,
  });

  return (
    <>
      <Helmet>
        <title>My APMS Requests</title>
      </Helmet>

      <Container maxWidth="xl">
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>

        <Card sx={{ p: 2 }}>
          <FormTableToolbar
            search={search}
            onFilterChange={(_, value) => setSearch(value)}
            placeholder="Search by request no / purpose"
          />

          <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row._id}
            autoHeight
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
          />
        </Card>
      </Container>

      {/* ✅ WORKING TEMP POPUP */}
      <RequestStatus
        open={openStatus}
        rowData={selectedRow}
        onClose={() => setOpenStatus(false)}
      />
    </>
  );
}
