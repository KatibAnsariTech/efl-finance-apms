import React, { lazy, Suspense, useState } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import CircularIndeterminate from "src/utils/loader";
import MasterTabs from "../components/MasterTabs";
import AddEditMeasurementUnit from "../components/Modals/AddEditMeasurementUnit";
import AddEditApproverPosition from "../components/Modals/AddEditApproverPosition";
import AddEditApprovalAuthority from "../components/Modals/AddEditApprovalAuthority";
import AddEditBusinessVertical from "../components/Modals/AddEditBusinessVertical";
import AddEditFunction from "../components/Modals/AddEditFunction";
import AddEditMajorPosition from "../components/Modals/AddEditMajorPosition";
import AddEditDepartment from "../components/Modals/AddEditDepartment";
import { Box } from "@mui/material";
import {
  MeasurementUnitTable,
  ApproverPositionTable,
  ApprovalAuthorityTable,
  BusinessVerticalTable,
  FunctionTable,
  MajorPositionTable,
  DepartmentTable,
} from "../components/tables";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";

const menuItems = [
  "Department",
  "Major Position",
  "Approver Position",
  "Approval Authority",
  "Business Vertical",
  "Function",
  "Measurement Units",
];

export default function CAPEXMaster() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [editData, setEditData] = useState(null);
  const [open, setOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [tabChangeTrigger, setTabChangeTrigger] = useState(0);
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
        const itemType = selectedCategory.toLowerCase();
        const endpoint =
          selectedTab === 0
            ? `cpx/deleteDepartment/${id}`
            : selectedTab === 1
            ? `cpx/deleteMajorPosition/${id}`
            : selectedTab === 2
            ? `cpx/deleteApproverPosition/${id}`
            : selectedTab === 3
            ? `cpx/deleteApprovalAuthority/${id}`
            : selectedTab === 4
            ? `cpx/deleteBusinessVertical/${id}`
            : selectedTab === 5
            ? `cpx/deleteBusinessFunction/${id}`
            : `cpx/deleteMeasurementUnit/${id}`;

        await userRequest.delete(endpoint);

        swal(
          "Deleted!",
          `${selectedCategory} has been deleted successfully.`,
          "success"
        );

        getData();
      }
    } catch (error) {
      console.error(`Error deleting ${selectedCategory.toLowerCase()}:`, error);
      swal(
        "Error!",
        `Failed to delete ${selectedCategory.toLowerCase()}. Please try again.`,
        "error"
      );
    }
  };

  const getData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleTabChange = (newTab) => {
    setSelectedTab(newTab);
    setTabChangeTrigger((prev) => prev + 1);
  };

  return (
    <Container maxWidth="xl">
      <MasterTabs
        selectedTab={selectedTab}
        setSelectedTab={handleTabChange}
        menuItems={menuItems}
      />
      <Card sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            mb: 2.5,
          }}
        >
          <Box
            component="span"
            onClick={handleOpen}
            sx={{
              fontSize: "0.8rem",
              fontWeight: "bold",
              cursor: "pointer",
              color: "#167beb",
            }}
          >
            Add {menuItems[selectedTab]}
          </Box>
        </Box>

        {open && selectedTab === 0 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditDepartment
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        {open && selectedTab === 1 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditMajorPosition
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        {open && selectedTab === 2 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditApproverPosition
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        {open && selectedTab === 3 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditApprovalAuthority
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        {open && selectedTab === 4 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditBusinessVertical
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        {open && selectedTab === 5 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditFunction
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        {open && selectedTab === 6 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditMeasurementUnit
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        <Box sx={{ width: "100%" }}>
          {selectedTab === 0 && (
            <DepartmentTable
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              refreshTrigger={refreshTrigger}
              tabChangeTrigger={tabChangeTrigger}
            />
          )}

          {selectedTab === 1 && (
            <MajorPositionTable
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              refreshTrigger={refreshTrigger}
              tabChangeTrigger={tabChangeTrigger}
            />
          )}

          {selectedTab === 2 && (
            <ApproverPositionTable
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              refreshTrigger={refreshTrigger}
              tabChangeTrigger={tabChangeTrigger}
            />
          )}

          {selectedTab === 3 && (
            <ApprovalAuthorityTable
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              refreshTrigger={refreshTrigger}
              tabChangeTrigger={tabChangeTrigger}
            />
          )}

          {selectedTab === 4 && (
            <BusinessVerticalTable
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              refreshTrigger={refreshTrigger}
              tabChangeTrigger={tabChangeTrigger}
            />
          )}

          {selectedTab === 5 && (
            <FunctionTable
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              refreshTrigger={refreshTrigger}
              tabChangeTrigger={tabChangeTrigger}
            />
          )}

          {selectedTab === 6 && (
            <MeasurementUnitTable
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              refreshTrigger={refreshTrigger}
              tabChangeTrigger={tabChangeTrigger}
            />
          )}
        </Box>
      </Card>
    </Container>
  );
}
