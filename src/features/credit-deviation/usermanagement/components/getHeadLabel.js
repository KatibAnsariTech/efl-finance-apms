export const headLabel = (selectedTab) => {
  switch (selectedTab) {
    case 0:
      return [
        { id: "sno", label: "S.No.", minWidth: 90, align: "center" },
        {
          id: "name",
          name: "username",
          label: "Name",
          minWidth: 300,
          sortable: true,
        },
        {
          id: "email",
          name: "email",
          label: "Email",
          minWidth: 300,
          sortable: true,
        },
        { id: "action", label: "Action", minWidth: 180 },
      ];
    case 1:
      return [
        { id: "sno", label: "S.No.", minWidth: 90, align: "center" },
        {
          id: "name",
          name: "username",
          label: "Name",
          minWidth: 300,
          sortable: true,
        },
        {
          id: "email",
          name: "email",
          label: "Email",
          minWidth: 300,
          sortable: true,
        },
        { id: "action", label: "Action", minWidth: 180 },
      ];
    case 2:
      return [
        { id: "sno", label: "S.No.", minWidth: 60, align: "center" },
        {
          id: "name",
          name: "username",
          label: "Name",
          minWidth: 180,
          sortable: true,
        },
        {
          id: "email",
          name: "email",
          label: "Email",
          minWidth: 180,
          sortable: true,
        },
        {
          id: "mastersheetPermissions",
          name: "mastersheetPermissions",
          label: "MasterSheet Permissions",
          minWidth: 500,
          sortable: true,
        },
        { id: "action", label: "Action", minWidth: 150 },
      ];
    case 3:
      return [
        { id: "sno", label: "S.No.", minWidth: 90, align: "center" },
        {
          id: "name",
          name: "username",
          label: "Name",
          minWidth: 300,
          sortable: true,
        },
        {
          id: "email",
          name: "email",
          label: "Email",
          minWidth: 300,
          sortable: true,
        },
        { id: "action", label: "Action", minWidth: 180 },
      ];
  }
};
