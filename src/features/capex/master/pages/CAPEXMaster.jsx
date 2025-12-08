import React, { lazy, Suspense, useState, useEffect } from "react";
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
import AddEditLocation from "../components/Modals/AddEditLocation";
import AddEditPlantCode from "../components/Modals/AddEditPlantCode";
import { Box, Autocomplete, TextField, CircularProgress, Paper } from "@mui/material";
import { userRequest } from "src/requestMethod";
import {
  MeasurementUnitTable,
  ApproverPositionTable,
  ApprovalAuthorityTable,
  BusinessVerticalTable,
  FunctionTable,
  MajorPositionTable,
  DepartmentTable,
  LocationTable,
  PlantCodeTable,
} from "../components/tables";
import swal from "sweetalert";

const menuItems = [
  "Department",
  "Position",
  "Position Ranking",
  "Approval Authority",
  "Business Vertical",
  "Function",
  "Measurement Units",
  "Location",
  "Plant Code",
];

export default function CAPEXMaster() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [editData, setEditData] = useState(null);
  const [open, setOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [tabChangeTrigger, setTabChangeTrigger] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const selectedCategory = menuItems[selectedTab];

  // Reset state when tab changes
  useEffect(() => {
    setSelectedDepartment(null);
    setEditData(null);
    setOpen(false);
  }, [selectedTab]);

  // Fetch departments when Position, Position Ranking, or Approval Authority tab is selected
  useEffect(() => {
    const fetchDepartments = async () => {
      if (selectedTab === 1 || selectedTab === 2 || selectedTab === 3) {
        // Position (1), Position Ranking (2), or Approval Authority (3) tab
        setDepartmentsLoading(true);
        try {
          const response = await userRequest.get("cpx/getDepartments", {
            params: {
              page: 1,
              limit: 100,
            },
          });

          const depts = response.data.data?.items || response.data.data || [];
          setDepartments(depts);
        } catch (error) {
          console.error("Error fetching Departments:", error);
          setDepartments([]);
        } finally {
          setDepartmentsLoading(false);
        }
      }
    };

    fetchDepartments();
  }, [selectedTab]);

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
            ? `cpx/deleteApproverAuthority/${id}`
            : selectedTab === 4
            ? `cpx/deleteBusinessVertical/${id}`
            : selectedTab === 5
            ? `cpx/deleteBusinessFunction/${id}`
            : selectedTab === 6
            ? `cpx/deleteMeasurementUnit/${id}`
            : selectedTab === 7
            ? `cpx/deleteLocation/${id}`
            : `cpx/deletePlantCode/${id}`;

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
            justifyContent: (selectedTab === 1 || selectedTab === 2 || selectedTab === 3) ? "space-between" : "flex-end",
            alignItems: "center",
            mb: 2.5,
          }}
        >
          {(selectedTab === 1 || selectedTab === 2 || selectedTab === 3) && (
            <Autocomplete
              options={departments}
              getOptionLabel={(option) => option?.name || ""}
              isOptionEqualToValue={(option, value) =>
                option?._id === value?._id
              }
              value={selectedDepartment || null}
              onChange={(event, newValue) => {
                setSelectedDepartment(newValue);
              }}
              loading={departmentsLoading}
              sx={{ width: 300 }}
              ListboxProps={{
                sx: {
                  "& .MuiAutocomplete-option": {
                    backgroundColor: "#ffffff !important",
                    "&:hover": {
                      backgroundColor: "#e3f2fd !important",
                    },
                    "&[aria-selected='true']": {
                      backgroundColor: "#bbdefb !important",
                      "&:hover": {
                        backgroundColor: "#90caf9 !important",
                      },
                    },
                  },
                },
              }}
              PaperComponent={({ children, ...other }) => (
                <Paper
                  {...other}
                  sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "4px",
                    mt: 0.5,
                  }}
                >
                  {children}
                </Paper>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Department"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {departmentsLoading ? (
                          <CircularProgress size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}
          <Box
            component="span"
            onClick={handleOpen}
            sx={{
              fontSize: "0.8rem",
              fontWeight: "bold",
              cursor: "pointer",
              color: "#167beb",
              ml: (selectedTab === 1 || selectedTab === 2 || selectedTab === 3) ? "auto" : 0,
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
              departments={departments}
              departmentsLoading={departmentsLoading}
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
              departments={departments}
              departmentsLoading={departmentsLoading}
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
              selectedDepartment={selectedDepartment}
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

        {open && selectedTab === 7 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditLocation
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        {open && selectedTab === 8 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditPlantCode
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
              selectedDepartment={selectedDepartment}
            />
          )}

          {selectedTab === 2 && (
            <ApproverPositionTable
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              refreshTrigger={refreshTrigger}
              tabChangeTrigger={tabChangeTrigger}
              selectedDepartment={selectedDepartment}
            />
          )}

          {selectedTab === 3 && (
            <Box sx={{ mt: 3 }}>
              <ApprovalAuthorityTable
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                refreshTrigger={refreshTrigger}
                tabChangeTrigger={tabChangeTrigger}
                selectedDepartment={selectedDepartment}
              />
            </Box>
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

          {selectedTab === 7 && (
            <LocationTable
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              refreshTrigger={refreshTrigger}
              tabChangeTrigger={tabChangeTrigger}
            />
          )}

          {selectedTab === 8 && (
            <PlantCodeTable
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
