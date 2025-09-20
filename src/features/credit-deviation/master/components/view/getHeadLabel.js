export const headLabel = (selectedTab) => {
  switch (selectedTab) {
    case 0:
      return [
        { id: "sno", label: "S.No.", minWidth: 90, align: "center" },
        { id: "region", name:"value", label: "Region",minWidth: 150, sortable: true },
        { id: "action", label: "Action", minWidth: 180 },
      ];
    case 1:
      return [
        { id: "sno", label: "S.No.", minWidth: 90, align: "center" },
        { id: "sbu", name:"value", label: "SBU",minWidth: 150, sortable: true },
        { id: "region", name:"other", label: "Region",minWidth: 150, sortable: true },
        { id: "action", label: "Action", minWidth: 180 },
      ];
    case 2:
      return [
        { id: "sno", label: "S.No.", minWidth: 90, align: "center" },
        { id: "channel", name:"value", label: "Channel",minWidth: 150, sortable: true },
        { id: "action", label: "Action", minWidth: 180 },
      ];
    case 3:
      return [
        { id: "sno", label: "S.No.", minWidth: 90, align: "center" },
        { id: "type", name:"value", label: "Type",minWidth: 150, sortable: true },
        { id: "channel", name:"other", label: "Channel",minWidth: 150, sortable: true },
        { id: "action", label: "Action", minWidth: 180 },
      ];
    case 4:
      return [
        { id: "sno", label: "S.No.", minWidth: 90, align: "center" },
        { id: "salesOffice", name:"value", label: "Sales Office",minWidth: 150, sortable: true },
        { id: "region", name:"other", label: "Region",minWidth: 150, sortable: true },
        { id: "category", name:"category", label: "Channel",minWidth: 150, sortable: true },
        { id: "action", label: "Action", minWidth: 180 },
      ];
    case 5:
      return [
        { id: "sno", label: "S.No.", minWidth: 90, align: "center" },
        { id: "salesGroup", name:"value", label: "Sales Group",minWidth: 150, sortable: true },
        { id: "salesOffice", name:"other", label: "Sales Office",minWidth: 150, sortable: true },
        { id: "action", label: "Action", minWidth: 180 },
      ];
    case 6:
      return [
        { id: "sno", label: "S.No.", minWidth: 90, align: "center" },
        { id: "channel", name:"channel", label: "Channel",minWidth: 150, sortable: true },
        { id: "region", name:"region", label: "Region",minWidth: 150, sortable: true },
        { id: "level", name:"level", label: "Level",minWidth: 150, sortable: true },
        { id: "Position", name:"position", label: "Position",minWidth: 150, sortable: true },
        { id: "action", label: "Action", minWidth: 180 },
      ];
    case 7:
      return [
        { id: "sno", label: "S.No.", minWidth: 90, align: "center" },
        { id: "approverType", name:"value", label: "Approver Type",minWidth: 150, sortable: true },
        { id: "name", name:"other", label: "Name",minWidth: 150, sortable: true },
        { id: "email", name:"other", label: "Email",minWidth: 150, sortable: true },
        { id: "action", label: "Action", minWidth: 180 },
      ];
  }
};
