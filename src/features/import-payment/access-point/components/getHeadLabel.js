export const headLabel = (selectedTab) => {
  switch (selectedTab) {
    case 0:
      return [
        { id: "sno", label: "S.No.", minWidth: 90, align: "center" },
        {
          id: "email",
          name: "email",
          label: "Email",
          minWidth: 220,
          sortable: true,
        },
        {
          id: "Date&Time",
          name: "departmentId",
          label: "Date And Time",
          minWidth: 300,
          sortable: true,
        },
        { id: "action", label: "Action", minWidth: 180 },
      ]; 
    case 1:
      return [
        { id: "sno", label: "S.No.", minWidth: 90, align: "center" },
        {
          id: "email",
          name: "email",
          label: "Email",
          minWidth: 220,
          sortable: true,
        },
        {
          id: "Date&Time",
          name: "departmentId",
          label: "Date And Time",
          minWidth: 300,
          sortable: true,
        },
        {
          id: "sub-tab",
          name: "SubTab",
          label: "Sub Tab",
          minWidth: 300,
          sortable: true,
        },
        { id: "action", label: "Action", minWidth: 180 },
      ];  
    default:
      return [];
  }
};
