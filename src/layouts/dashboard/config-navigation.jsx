import SvgColor from "src/components/svg-color";

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const navConfig = [
  {
    title: "Request",
    path: "/request",
    icon: icon("ic_raise_ticket"),
    roles: ["REQUESTER"],
  },
  {
    title: "Request Status",
    path: "/request-status",
    icon: icon("ic_my_request"),
    roles: ["REQUESTER"],
  },
  {
    title: "Approval",
    path: "/approvals",
    icon: icon("ic_approval"),
    roles: ["APPROVER"],
  },
  {
    title: "Master Data",
    path: "/master",
    icon: icon("ic_lock"),
    roles: ["SUPER_ADMIN"],
  },
  {
    title: "User Management",
    path: "/usermanagement",
    icon: icon("ic_user"),
    roles: ["SUPER_ADMIN"],
  },
  {
    title: "Master Sheet",
    path: "/master-sheet",
    icon: icon("ic_user"),
    roles: ["ADMIN","SUPER_ADMIN"],
  },
  {
    title: "H. Management",
    path: "/hierarchy-management",
    icon: icon("ic_user"),
    roles: ["SUPER_ADMIN"],
  },
];

export default navConfig;
