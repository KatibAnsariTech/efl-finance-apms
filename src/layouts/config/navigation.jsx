import DashboardIcon from "@mui/icons-material/Dashboard";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TableChartIcon from "@mui/icons-material/TableChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ViewListIcon from "@mui/icons-material/ViewList";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SettingsIcon from "@mui/icons-material/Settings";

const navConfig = [
  {
    id: "credit-deviation",
    title: "Credit Deviation",
    path: "/credit-deviation",
    icon: <CreditCardIcon />,
    roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
    hasSubItems: true,
    subItems: [
      {
        id: "request",
        title: "Request",
        path: "/credit-deviation/request",
        icon: <RequestPageIcon />,
        // roles: ["REQUESTER"],
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
      },
      {
        id: "request-status",
        title: "Request Status",
        path: "/credit-deviation/request-status",
        icon: <TableChartIcon />,
        // roles: ["REQUESTER"],
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
      },
      {
        id: "approval",
        title: "Approval",
        path: "/credit-deviation/approvals",
        icon: <CheckCircleIcon />,
        //  roles: ["APPROVER"],
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
      },
      {
        id: "master-data",
        title: "Master Data",
        path: "/credit-deviation/master",
        icon: <AssignmentIcon />,
        // roles: ["SUPER_ADMIN"],
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
      },
      {
        id: "user-management",
        title: "User Management",
        path: "/credit-deviation/usermanagement",
        icon: <ManageAccountsIcon />,
        // roles: ["SUPER_ADMIN"],
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
      },
      {
        id: "master-sheet",
        title: "Master Sheet",
        path: "/credit-deviation/master-sheet",
        icon: <TableChartIcon />,
        // roles: ["ADMIN", "SUPER_ADMIN"],
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
      },
      {
        id: "h-management",
        title: "H. Management",
        path: "/credit-deviation/hierarchy-management",
        icon: <AccountTreeIcon />,
        // roles: ["SUPER_ADMIN"],
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  {
    id: "jvm",
    title: "JVM",
    path: "/jvm",
    icon: <BarChartIcon />,
    roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
    hasSubItems: true,
    subItems: [
      {
        id: "initiate-jv",
        title: "Initiate JV",
        path: "/jvm/initiate-jv",
        icon: <RequestPageIcon />,
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
      },
      {
        id: "jv-status",
        title: "JV's Status",
        path: "/jvm/jv-status",
        icon: <AssignmentTurnedInIcon />,
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  {
    id: "import-payment",
    title: "Import Payment",
    path: "/import-payment",
    icon: <FileUploadIcon />,
    roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
    hasSubItems: true,
    subItems: [
      {
        id: "import-payment-upload",
        title: "Upload Payment",
        path: "/import-payment/upload",
        icon: <FileUploadIcon />,
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  {
    id: "custom-duty",
    title: "Custom Duty",
    path: "/custom-duty",
    icon: <AccountBalanceIcon />,
    roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
    hasSubItems: true,
    subItems: [
      // {
      //   id: 'custom-duty-payment',
      //   title: 'Duty Payment',
      //   path: '/custom-duty/payment',
      //   icon: <AccountBalanceIcon />,
      //   roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"]
      // },
      {
        id: "custom-duty-raise-request",
        title: "Raise Request",
        path: "/custom-duty/raise-request",
        icon: <AddCircleIcon />,
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
      },
      {
        id: "custom-duty-my-requests",
        title: "My Requests",
        path: "/custom-duty/my-requests",
        icon: <ListAltIcon />,
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
      },
      {
        id: "custom-duty-requests",
        title: "Requests",
        path: "/custom-duty/requests",
        icon: <ViewListIcon />,
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
      },
      {
        id: "custom-duty-raise-to-bank",
        title: "Raise to Bank",
        path: "/custom-duty/raise-to-bank",
        icon: <AccountBalanceWalletIcon />,
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
      },
      {
        id: "custom-duty-master",
        title: "Master Data",
        path: "/custom-duty/master",
        icon: <SettingsIcon />,
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  {
    id: "petty-cash",
    title: "Petty Cash",
    path: "/petty-cash",
    icon: <AttachMoneyIcon />,
    roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
    hasSubItems: true,
    subItems: [
      {
        id: "petty-cash-request",
        title: "Request Petty Cash",
        path: "/petty-cash/request",
        icon: <AttachMoneyIcon />,
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
];

export default navConfig;
