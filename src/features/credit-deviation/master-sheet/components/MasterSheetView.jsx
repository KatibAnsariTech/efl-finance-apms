import { DataGrid } from "@mui/x-data-grid";
import { Box, Container, Card } from "@mui/material";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { userRequest } from "src/requestMethod";
import excel from "/assets/excel.svg";
import UploadFileModal from "./UploadFileModal";
import { headLabel } from "./getHeadLabel";
import MasterTabs from "./master-tab";
import { FormTableToolbar } from "src/components/table";
import { fDate, fTime } from "src/utils/format-time";
import LatestDataTable from "./LatestDataTable";
import UploadLogTable from "./UploadLogTable";
import { useAccount } from "src/hooks/use-account";


// Permission value to tab label mapping
const permissionToTabLabel = {
  controlledCheque: "Controlled Cheque",
  cfMaster: "CF Master",
  dsobenchmark: "DSO Benchmark",
  dsostandard: "DSO Standards",
};
const tabLabelToPermission = Object.fromEntries(
  Object.entries(permissionToTabLabel).map(([k, v]) => [v, k])
);

export default function MasterSheetView() {
  const user = useAccount();
  // If SUPER_ADMIN, show all tabs; else filter by permissions
  const allTabs = [
    "Controlled Cheque",
    "CF Master",
    "DSO Benchmark",
    "DSO Standards",
  ];
  let menuItems = [];
  // Check if user has SUPER_ADMIN role in any project
  const isSuperAdmin = Object.values(user?.projectRoles || {}).includes("SUPER_ADMIN");
  if (isSuperAdmin) {
    menuItems = allTabs;
  } else {
    menuItems = Array.isArray(user?.mastersheetPermissions)
      ? user.mastersheetPermissions.map((perm) => permissionToTabLabel[perm]).filter(Boolean)
      : [];
  }

  // Tab state
  const [selectedTab, setSelectedTab] = useState(0);
  useEffect(() => {
    // Always reset to first allowed tab if permissions change
    if (menuItems.length > 0) setSelectedTab(0);
  }, [menuItems.length]);

  // Data state
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [totalCount, setTotalCount] = useState(0);
  const [editData, setEditData] = useState(null);
  const [open, setOpen] = useState(false);
  const [showUploadLog, setShowUploadLog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // --- API URL helpers ---
  const getAPIURL = () => {
    if (!menuItems.length) return null;
    const tabLabel = menuItems[selectedTab];
    const permission = tabLabelToPermission[tabLabel];
    if (!permission) return null;
    if (permission === "controlledCheque") return "/admin/getLatestControlledCheques";
    if (permission === "cfMaster") return "/admin/getLatestCFMasters";
    if (permission === "dsobenchmark") return "/admin/getLatestDSOBenchmarks";
    if (permission === "dsostandard") return "/admin/getLatestDSOStandards";
    return null;
  };
  const getUploadLogAPIURL = () => {
    if (!menuItems.length) return null;
    const tabLabel = menuItems[selectedTab];
    const permission = tabLabelToPermission[tabLabel];
    if (!permission) return null;
    if (permission === "controlledCheque") return "/admin/getAllControlledCheques";
    if (permission === "cfMaster") return "/admin/getAllCFMasters";
    if (permission === "dsobenchmark") return "/admin/getAllDSOBenchmarks";
    if (permission === "dsostandard") return "/admin/getAllDSOStandards";
    return null;
  };

  // --- Data Fetching ---
  const getData = async () => {
    if (!menuItems.length) {
      setData([]);
      setTotalCount(0);
      return;
    }
    const url = showUploadLog ? getUploadLogAPIURL() : getAPIURL();
    if (!url) {
      setData([]);
      setTotalCount(0);
      return;
    }
    setLoading(true);
    try {
      const res = await userRequest.get(url, {
        params: {
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
          search: debouncedSearch,
        },
      });
      const result = res?.data?.data?.data || [];
      const startIndex = paginationModel.page * paginationModel.pageSize;
      const dataWithSno = result.map((item, index) => ({
        ...item,
        sno: startIndex + index + 1,
      }));
      setData(dataWithSno);
      setTotalCount(res?.data?.data?.total || 0);
    } catch (err) {
      setData([]);
      setTotalCount(0);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Effects ---
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (menuItems.length) getData();
  }, [debouncedSearch, paginationModel.page, paginationModel.pageSize, selectedTab, showUploadLog, menuItems.length]);

  // --- UI Handlers ---
  const handleEdit = (row) => {
    setEditData(row);
    setOpen(true);
  };
  const handlePaginationModelChange = (model) => setPaginationModel(model);
  const handleFilterChange = (field, value) => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setSearch(value);
  };
  const handleUploadSuccess = () => {
    setOpen(false);
    setEditData(null);
    getData();
    setRefreshKey((prev) => prev + 1);
  };

  // --- Render ---
  if (!menuItems.length) {
    return <Container><Card sx={{ mt: 2, p: 4, textAlign: 'center' }}>No permissions to view any master sheet.</Card></Container>;
  }

  return (
    <Container>
      <MasterTabs
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        menuItems={menuItems}
      />


      <Card sx={{ mt: 2, p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          {/* Toolbar left: Latest Updated info and Upload Log toggle */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
            onClick={() => setShowUploadLog(true)}
          >
            <span
              style={{
                color: "#000",
                fontSize: "0.8rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Latest Updated : {fDate(data[0]?.createdAt)}
            </span>
            |
            <span
              style={{
                color: "#000",
                fontSize: "0.8rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {fTime(data[0]?.createdAt)}
            </span>
            {showUploadLog && (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#e53935"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ borderRadius: "50%", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUploadLog(!showUploadLog);
                }}
              >
                <circle cx="12" cy="12" r="12" fill="#e53935" />
                <line x1="8" y1="8" x2="16" y2="16" />
                <line x1="16" y1="8" x2="8" y2="16" />
              </svg>
            )}
          </Box>
          {/* Toolbar right: Upload File and Export */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <span
              onClick={() => setOpen(true)}
              style={{
                color: "#167beb",
                fontSize: "0.8rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Upload File
            </span>
            |
            <span
              // onClick={handleExport}
              onClick={() => console.log("Exported")}
              style={{
                color: "#167beb",
                fontSize: "0.8rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Export{" "}
              <img src={excel} style={{ width: "1.2rem", marginLeft: "5px" }} />
            </span>
          </Box>
        </Box>

        {showUploadLog ? (
          <UploadLogTable
            apiUrl={getUploadLogAPIURL()}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            selectedTab={selectedTab}
            menuItems={menuItems}
          />
        ) : (
          <LatestDataTable
            selectedTab={selectedTab}
            apiUrl={getAPIURL()}
            headLabel={headLabel}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            onDataUpdate={(updatedData) => setData(updatedData)}
            refreshKey={refreshKey}
            menuItems={menuItems}
          />
        )}

        <UploadFileModal
          open={open}
          onClose={() => setOpen(false)}
          selectedTab={selectedTab}
          onSuccess={handleUploadSuccess}
          menuItems={menuItems}
        />
      </Card>
    </Container>
  );
}

