import { Box, Tab, Tabs } from "@mui/material";
import React, { useMemo } from "react";

function UserManagementTabs({ selectedTab, setSelectedTab, menuItems }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const accessPoints = user?.accessPoints || {};
  const userManagementAccess = accessPoints?.usermanagement;

  // Decide tabs to show
  const filteredMenuItems = useMemo(() => {
    // If usermanagement access exists → show only allowed tabs
    if (userManagementAccess?.tabs?.length) {
      return menuItems.filter((item) =>
        userManagementAccess.tabs.includes(item)
      );
    }

    // Otherwise show all tabs
    return menuItems;
  }, [menuItems, userManagementAccess]);

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
