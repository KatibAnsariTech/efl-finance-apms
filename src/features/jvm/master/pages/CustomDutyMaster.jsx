import React, { lazy, Suspense, useState } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import CircularIndeterminate from "src/utils/loader";
import MasterTabs from "../components/MasterTabs";
import AddEditCompany from "../components/Modals/AddEditCompany";
import { Box } from "@mui/material";
import { CompanyTable } from "../components/tables";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";

const menuItems = [
  "Company"
];

export default function CustomDutyMaster() {
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
        console.log("Deleting company with ID:", id);
        // Add actual delete API call here
        // await userRequest.delete(`/admin/deleteMaster/${id}`);
        
        // Show success message
        swal("Deleted!", "Company has been deleted successfully.", "success");
        
        // Refresh data
        getData();
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      swal("Error!", "Failed to delete company. Please try again.", "error");
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
            <AddEditCompany
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        <Box sx={{ width: "100%" }}>
          {selectedTab === 0 && (
            <CompanyTable 
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}
        </Box>
      </Card>
    </Container>
  );
}
