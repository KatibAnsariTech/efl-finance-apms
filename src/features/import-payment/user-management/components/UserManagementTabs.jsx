import { Box, Tab, Tabs } from "@mui/material";
import React from "react";

function UserManagementTabs({ selectedTab, setSelectedTab, menuItems }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.userRoles?.[0]?.userType;
  console.log('users>>>>',user.accessPoints);

  // Filter menu items based on role
  const filteredMenuItems =
    userRole === "ADMIN"
      ? menuItems.filter((item) => item === "Requester")
      : menuItems;

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
      <Tabs
        value={selectedTab}
        onChange={(e, newValue) => setSelectedTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          "& .MuiTabs-indicator": { backgroundColor: "#1877F2" },
          "& .MuiTab-root": { fontWeight: "bold" },
        }}
      >
        {filteredMenuItems.map((item, index) => (
          <Tab key={index} label={item} />
        ))}
      </Tabs>
    </Box>
  );
}

export default UserManagementTabs;
