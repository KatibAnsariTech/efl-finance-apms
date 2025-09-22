import React, { lazy, Suspense, useState } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import CircularIndeterminate from "src/utils/loader";
import MasterTabs from "../components/MasterTabs";
import AddEditDocumentType from "../components/Modals/AddEditDocumentType";
import AddEditPostingKey from "../components/Modals/AddEditPostingKey";
import { Box } from "@mui/material";
import { DocumentTypeTable, PostingKeyTable } from "../components/tables";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";

const menuItems = [
  "Document Type",
  "Posting Key"
];

export default function JVMMaster() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [editData, setEditData] = useState(null);
  const [open, setOpen] = useState(false);
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
        // Add actual delete API call here
        // await userRequest.delete(`/admin/deleteMaster/${id}`);
        
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
    // This function is now handled by individual table components
    console.log("Data refresh requested");
    // The table will refresh automatically when needed
  };

  return (
    <Container maxWidth="xl">
      <MasterTabs
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        menuItems={menuItems}
      />
      <Card sx={{ p: 3 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: "20px",
            marginRight: "0.5%",
          }}
        >
          <div
            style={{
              fontSize: "0.8rem",
              fontWeight: "bold",
              cursor: "pointer",
              gap: "8px",
            }}
          >
            <span onClick={handleOpen} style={{ color: "#167beb" }}>
              Add {menuItems[selectedTab]}
            </span>
          </div>
        </div>

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
            <AddEditPostingKey
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        <Box sx={{ width: "100%" }}>
          {selectedTab === 0 && (
            <DocumentTypeTable 
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}
          {selectedTab === 1 && (
            <PostingKeyTable 
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}
        </Box>
      </Card>
    </Container>
  );
}
