const tabLabelToHead = {
  "Controlled Cheque": [
    {
      id: "sno",
      label: "S.No.",
      minWidth: 90,
      sortable: true,
      align: "center",
    },
    {
      id: "customerCode",
      name: "customerCode",
      label: "Customer Code",
      minWidth: 300,
      sortable: true,
      align: "center",
    },
    {
      id: "chequeAvailability",
      name: "chequeAvailability",
      label: "Cheque Availability",
      minWidth: 300,
      sortable: true,
      align: "center",
    },
  ],
  "CF Master": [
    {
      id: "sno",
      label: "S.No.",
      minWidth: 90,
      sortable: true,
      align: "center",
    },
    {
      id: "customerCode",
      name: "customerCode",
      label: "Customer Code",
      minWidth: 250,
      sortable: true,
      align: "center",
    },
    {
      id: "cfLimit",
      name: "cfLimit",
      label: "CF Limit",
      minWidth: 250,
      sortable: true,
      align: "center",
    },
    {
      id: "outstandingAsOnDate",
      name: "outstandingAsOnDate",
      label: "Outstanding As On Date",
      minWidth: 250,
      sortable: true,
      align: "center",
    },
  ],
  "DSO Benchmark": [
    {
      id: "sno",
      label: "S.No.",
      minWidth: 90,
      sortable: true,
      align: "center",
    },
    {
      id: "channel",
      name: "channel",
      label: "Channel",
      minWidth: 180,
      sortable: true,
      align: "center",
    },
    {
      id: "region",
      name: "region",
      label: "Region",
      minWidth: 200,
      sortable: true,
      align: "center",
    },
    {
      id: "party",
      name: "party",
      label: "Party",
      minWidth: 200,
      sortable: true,
      align: "center",
    },
    {
      id: "dsoDays",
      name: "dsoDays",
      label: "DSO Days",
      minWidth: 200,
      sortable: true,
      align: "center",
    },
  ],
  "DSO Standards": [
    {
      id: "sno",
      label: "S.No.",
      minWidth: 90,
      sortable: true,
      align: "center",
    },
    {
      id: "channel",
      name: "channel",
      label: "Channel",
      minWidth: 250,
      sortable: true,
      align: "center",
    },
    {
      id: "region",
      name: "region",
      label: "Region",
      minWidth: 250,
      sortable: true,
      align: "center",
    },
    {
      id: "dsoDays",
      name: "dsoDays",
      label: "DSO Days",
      minWidth: 250,
      sortable: true,
      align: "center",
    },
  ],
};

export const headLabel = (selectedTab, menuItems) => {
  const tabLabel =
    menuItems && menuItems[selectedTab]
      ? menuItems[selectedTab]
      : "Controlled Cheque";
  return tabLabelToHead[tabLabel] || tabLabelToHead["Controlled Cheque"];
};
