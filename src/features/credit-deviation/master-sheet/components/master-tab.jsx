import { Box, Tab, Tabs } from "@mui/material";
import React from "react";

function MasterTabs({ selectedTab, setSelectedTab, menuItems }) {
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
        {menuItems.map((item, index) => (
          <Tab key={index} label={item} />
        ))}
      </Tabs>
    </Box>
  );
}

export default MasterTabs;
