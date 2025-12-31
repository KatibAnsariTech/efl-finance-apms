export const headLabel = (selectedTab) => {
  const baseColumns = [
    { id: "sno", label: "S.No.", minWidth: 80, width: 80, align: "center" },
    {
      id: "name",
      name: "username",
      label: "Name",
      minWidth: 200,
      width: 250,
      sortable: true,
    },
    {
      id: "email",
      name: "email",
      label: "Email",
      minWidth: 250,
      width: 300,
      sortable: true,
    },
  ];

  switch (selectedTab) {
    case 0: // Users tab (REQUESTER, APPROVER)
      return [
        ...baseColumns,
        {
          id: "userType",
          name: "userType",
          label: "User Type",
          minWidth: 180,
          width: 200,
          sortable: false,
        },
        {
          id: "company",
          name: "company",
          label: "Company",
          minWidth: 200,
          width: 250,
          sortable: false,
        },
        { id: "action", label: "Actions", minWidth: 120, width: 120 },
      ];
    case 1: // Admin tab
      return [
        ...baseColumns,
        {
          id: "mastersheetPermissions",
          name: "mastersheetPermissions",
          label: "MasterSheet Permissions",
          minWidth: 500,
          sortable: true,
        },
        { id: "action", label: "Action", minWidth: 180 },
      ];
    case 2: // Super Admin tab
      return [
        ...baseColumns,
        { id: "action", label: "Action", minWidth: 180 },
      ];
    default:
      return [
        ...baseColumns,
        {
          id: "userType",
          name: "userType",
          label: "User Type",
          minWidth: 200,
          sortable: false,
        },
        {
          id: "company",
          name: "company",
          label: "Company",
          minWidth: 250,
          sortable: false,
        },
        { id: "action", label: "Action", minWidth: 180 },
      ];
  }
};
