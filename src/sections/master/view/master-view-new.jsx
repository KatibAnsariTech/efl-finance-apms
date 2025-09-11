import React, { lazy, Suspense, useState } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import CircularIndeterminate from "src/utils/loader";
import MasterTabs from "../master-tab";
import AddEditSalesOffice from "../Modals/AddEditSalesOffice";
import AddEditSalesGroup from "../Modals/AddEditSalesGroup";
import AddEditSBU from "../Modals/AddEditSBU";
import { Box } from "@mui/material";
import {
  RegionTable,
  SBUTable,
  ChannelTable,
  RequesterTypeTable,
  SalesOfficeTable,
  SalesGroupTable,
  HierarchyTable,
  ApproverTable,
} from '../tables';

const AddEditRegion = lazy(() => import("../Modals/AddEditRegion"));
const AddEditChannel = lazy(() => import("../Modals/AddEditChannel"));
const AddEditRequestType = lazy(() => import("../Modals/AddEditRequestType"));
const AddEditApproverType = lazy(() => import("../Modals/AddEditApproverType"));
const AddEditApprover = lazy(() => import("../Modals/AddEditApprover"));

const menuItems = [
  "Region",
  "SBU",
  "Channel",
  "Requester Type",
  "Sales Office",
  "Sales Group",
  "Hierarchy",
  "Approver",
];

export default function MasterView() {
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

  const handleDelete = (id) => {
    console.log('Delete:', id);
    // Add delete logic here
  };

  const getData = () => {
    // This function is now handled by individual table components
    console.log('Data refresh requested');
  };

  return (
    <Container maxWidth="xl">
      <Card sx={{ p: 3 }}>
        <MasterTabs
          value={selectedTab}
          onChange={(event, newValue) => setSelectedTab(newValue)}
          menuItems={menuItems}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            marginTop: "20px",
          }}
        >
          <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            {menuItems[selectedTab]} Management
          </div>
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
            <AddEditRegion
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        {open && selectedTab === 1 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditSBU
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        {open && selectedTab === 2 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditChannel
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        {open && selectedTab === 3 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditRequestType
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        {open && selectedTab === 4 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditSalesOffice
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        {open && selectedTab === 5 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditSalesGroup
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        {open && selectedTab === 6 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditApproverType
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        {open && selectedTab === 7 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditApprover
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        <Box sx={{ width: "100%" }}>
          {selectedTab === 0 && <RegionTable />}
          {selectedTab === 1 && <SBUTable />}
          {selectedTab === 2 && <ChannelTable />}
          {selectedTab === 3 && <RequesterTypeTable />}
          {selectedTab === 4 && <SalesOfficeTable />}
          {selectedTab === 5 && <SalesGroupTable />}
          {selectedTab === 6 && <HierarchyTable />}
          {selectedTab === 7 && <ApproverTable />}
        </Box>
      </Card>
    </Container>
  );
}
