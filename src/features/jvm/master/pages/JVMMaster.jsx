import React, { lazy, Suspense, useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import CircularIndeterminate from "src/utils/loader";
import MasterTabs from "../components/MasterTabs";
import AddEditDocumentType from "../components/Modals/AddEditDocumentType";
import AddEditPostingKey from "../components/Modals/AddEditPostingKey";
import AddEditHierarchy from "../components/Modals/AddEditHierarchy";
import AddEditAccountType from "../components/Modals/AddEditAccountType";
import AddEditSpecialGL from "../components/Modals/AddEditSpecialGL";
import { Box } from "@mui/material";
import { DocumentTypeTable, PostingKeyTable, HierarchyTable, AccountTypeTable, SpecialGLTable } from "../components/tables";
import JVMLogTable from "../components/JVMLogTable";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";
import { fDate, fTime } from "src/utils/format-time";

const menuItems = [
  "Document Type",
  "Account Type",
  "Posting Key",
  "Special GL Indication",
  "Hierarchy"
];

export default function JVMMaster() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [editData, setEditData] = useState(null);
  const [open, setOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showLogTable, setShowLogTable] = useState(false);
  const [latestData, setLatestData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const selectedCategory = menuItems[selectedTab];

  const handleEdit = (row) => {
    setEditData(row);
    setOpen(true);
  };

  const handleOpen = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditData(null);
  };

  const handleDelete = async (id) => {
    try {
      const result = await swal({
        title: "Are you sure?",
        text: "You won't be able to revert this action!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });

      if (result) {
        console.log(`Deleting ${selectedCategory} with ID:`, id);
        await userRequest.delete(`/jvm/deleteMaster/${id}`);
        
        // Show success message
        swal("Deleted!", `${selectedCategory} has been deleted successfully.`, "success");
        
        // Refresh data
        getData();
      }
    } catch (error) {
      console.error(`Error deleting ${selectedCategory}:`, error);
      swal("Error!", `Failed to delete ${selectedCategory}. Please try again.`, "error");
    }
  };

  const getData = () => {
    // Trigger table refresh by updating the refresh trigger
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Container maxWidth="xl">
      <MasterTabs
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        menuItems={menuItems}
      />
      <Card sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          {/* Toolbar left: Latest Updated info and Log toggle - Only for Hierarchy tab */}
          {selectedTab === 4 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
              }}
              onClick={() => setShowLogTable(true)}
            >
              <span
                style={{
                  color: "#000",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Latest Updated : {latestData[0]?.createdAt ? fDate(latestData[0].createdAt) : "N/A"}
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
                {latestData[0]?.createdAt ? fTime(latestData[0].createdAt) : "N/A"}
              </span>
              {showLogTable && (
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
                    setShowLogTable(false);
                  }}
                >
                  <circle cx="12" cy="12" r="12" fill="#e53935" />
                  <line x1="8" y1="8" x2="16" y2="16" />
                  <line x1="16" y1="8" x2="8" y2="16" />
                </svg>
              )}
            </Box>
          ) : (
            <Box></Box>
          )}
          {/* Toolbar right: Add button - Always aligned to the right */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 1,
            }}
          >
            <span
              onClick={handleOpen}
              style={{
                color: "#167beb",
                fontSize: "0.8rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Add {menuItems[selectedTab]}
            </span>
          </Box>
        </Box>

        {/* Conditionally render modals based on selected tab */}
        {open && selectedTab === 0 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditDocumentType
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        {open && selectedTab === 1 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditAccountType
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        {open && selectedTab === 2 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditPostingKey
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        {open && selectedTab === 3 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditSpecialGL
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        {open && selectedTab === 4 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditHierarchy
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        <Box sx={{ width: "100%" }}>
          {showLogTable && selectedTab === 4 ? (
            <JVMLogTable
              selectedTab={selectedTab}
              menuItems={menuItems}
            />
          ) : (
            <>
              {selectedTab === 0 && (
                <DocumentTypeTable 
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  refreshTrigger={refreshTrigger}
                />
              )}
              {selectedTab === 1 && (
                <AccountTypeTable 
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  refreshTrigger={refreshTrigger}
                />
              )}
              {selectedTab === 2 && (
                <PostingKeyTable 
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  refreshTrigger={refreshTrigger}
                />
              )}
              {selectedTab === 3 && (
                <SpecialGLTable 
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  refreshTrigger={refreshTrigger}
                />
              )}
              {selectedTab === 4 && (
                <HierarchyTable 
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  refreshTrigger={refreshTrigger}
                  onDataUpdate={setLatestData}
                />
              )}
            </>
          )}
        </Box>
      </Card>
    </Container>
  );
}
