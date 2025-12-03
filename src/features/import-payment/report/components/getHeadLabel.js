export const headLabel = (selectedTab) => {
  switch (selectedTab) {
    case 0:
      return [
        { id: "sno", label: "S.No.", minWidth: 90, align: "center" },
        {
          id: "name",
          name: "username",
          label: "Name",
          minWidth: 200,
          sortable: true,
        },
        {
          id: "email",
          name: "email",
          label: "Email",
          minWidth: 220,
          sortable: true,
        },
        {
          id: "Department",
          name: "departmentId",
          label: "Department Name",
          minWidth: 300,
          sortable: true,
        },
        {
          id: "ImportType",
          name: "importType",
          label: "Import Type Name",
          minWidth: 300,
          sortable: true,
        },
        {
          id: "SelectType",
          name: "selectType",
          label: "Type Name",
          minWidth: 300,
          sortable: true,
        },
        {
          id: "Scope",
          name: "scope",
          label: "Scope Name",
          minWidth: 300,
          sortable: true,
        },
        { id: "action", label: "Action", minWidth: 180 },
      ]; 
    default:
      return [];
  }
};
