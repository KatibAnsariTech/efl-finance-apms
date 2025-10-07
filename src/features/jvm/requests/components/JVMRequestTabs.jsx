import { Box, Tab, Tabs } from "@mui/material";
import React from "react";

function JVMRequestTabs({ selectedTab, setSelectedTab, menuItems, jvmRequestCounts }) {
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
        {menuItems.map((item, index) => {
          let label = item.label;
          
          if (item.value === "pendingWithMe" && jvmRequestCounts.pending > 0) {
            label = (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {item.label}
                <span style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'red',
                  marginLeft: 4,
                  animation: 'blinker 1s linear infinite',
                }} />
                <style>{`@keyframes blinker { 50% { opacity: 0.2; } }`}</style>
              </span>
            );
          }
          
          return <Tab key={index} label={label} value={item.value} />;
        })}
      </Tabs>
    </Box>
  );
}

export default JVMRequestTabs;
