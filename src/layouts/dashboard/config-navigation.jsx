import DashboardIcon from '@mui/icons-material/Dashboard';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TableChartIcon from '@mui/icons-material/TableChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const navConfig = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/',
    icon: <DashboardIcon />,
    roles: ["SUPER_ADMIN"],
    hasSubItems: false,
  },
  {
    id: 'jvm',
    title: 'JVM',
    path: '/jvm',
    icon: <BarChartIcon />,
    roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
    hasSubItems: true,
    subItems: [
      { 
        id: 'jvm-overview', 
        title: 'JVM Overview', 
        path: '/jvm/overview',
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"]
      },
      { 
        id: 'initiate-jv', 
        title: 'Initiate JV', 
        path: '/initiate-jv',
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"]
      },
      { 
        id: 'jv-status', 
        title: "JV's Status", 
        path: '/jv-status',
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"]
      },
      { 
        id: 'jvm-reports', 
        title: 'JVM Reports', 
        path: '/jvm/reports',
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"]
      },
    ],
  },
  {
    id: 'import-payment',
    title: 'Import Payment',
    path: '/import-payment',
    icon: <FileUploadIcon />,
    roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
    hasSubItems: true,
    subItems: [
      { 
        id: 'import-payment-upload', 
        title: 'Upload Payment', 
        path: '/import-payment/upload',
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"]
      },
      { 
        id: 'import-payment-history', 
        title: 'Payment History', 
        path: '/import-payment/history',
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"]
      },
    ],
  },
  {
    id: 'custom-duty',
    title: 'Custom Duty',
    path: '/custom-duty',
    icon: <AccountBalanceIcon />,
    roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
    hasSubItems: true,
    subItems: [
      { 
        id: 'custom-duty-calculate', 
        title: 'Calculate Duty', 
        path: '/custom-duty/calculate',
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"]
      },
      { 
        id: 'custom-duty-payment', 
        title: 'Duty Payment', 
        path: '/custom-duty/payment',
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"]
      },
    ],
  },
  {
    id: 'petty-cash',
    title: 'Petty Cash',
    path: '/petty-cash',
    icon: <AttachMoneyIcon />,
    roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
    hasSubItems: true,
    subItems: [
      { 
        id: 'petty-cash-request', 
        title: 'Request Petty Cash', 
        path: '/petty-cash/request',
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"]
      },
      { 
        id: 'petty-cash-approval', 
        title: 'Approve Petty Cash', 
        path: '/petty-cash/approval',
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"]
      },
      { 
        id: 'petty-cash-reports', 
        title: 'Petty Cash Reports', 
        path: '/petty-cash/reports',
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"]
      },
    ],
  },
  {
    id: 'request',
    title: 'Request',
    path: '/request',
    icon: <RequestPageIcon />,
    roles: ["REQUESTER"],
    hasSubItems: false,
  },
  {
    id: 'request-status',
    title: 'Request Status',
    path: '/request-status',
    icon: <AssignmentIcon />,
    roles: ["REQUESTER"],
    hasSubItems: false,
  },
  {
    id: 'approval',
    title: 'Approval',
    path: '/approvals',
    icon: <CheckCircleIcon />,
    roles: ["APPROVER"],
    hasSubItems: false,
  },
  {
    id: 'master-data',
    title: 'Master Data',
    path: '/master',
    icon: <LockIcon />,
    roles: ["SUPER_ADMIN"],
    hasSubItems: true,
    subItems: [
      { 
        id: 'master-data-management', 
        title: 'Data Management', 
        path: '/master/data',
        roles: ["SUPER_ADMIN"]
      },
      { 
        id: 'master-data-config', 
        title: 'Configuration', 
        path: '/master/config',
        roles: ["SUPER_ADMIN"]
      },
      { 
        id: 'master-data-settings', 
        title: 'Settings', 
        path: '/master/settings',
        roles: ["SUPER_ADMIN"]
      },
    ],
  },
  {
    id: 'user-management',
    title: 'User Management',
    path: '/usermanagement',
    icon: <PersonIcon />,
    roles: ["SUPER_ADMIN"],
    hasSubItems: true,
    subItems: [
      { 
        id: 'user-management-users', 
        title: 'Users', 
        path: '/usermanagement/users',
        roles: ["SUPER_ADMIN"]
      },
      { 
        id: 'user-management-roles', 
        title: 'Roles', 
        path: '/usermanagement/roles',
        roles: ["SUPER_ADMIN"]
      },
      { 
        id: 'user-management-permissions', 
        title: 'Permissions', 
        path: '/usermanagement/permissions',
        roles: ["SUPER_ADMIN"]
      },
    ],
  },
  {
    id: 'master-sheet',
    title: 'Master Sheet',
    path: '/master-sheet',
    icon: <TableChartIcon />,
    roles: ["ADMIN", "SUPER_ADMIN"],
    hasSubItems: false,
  },
  {
    id: 'h-management',
    title: 'H. Management',
    path: '/hierarchy-management',
    icon: <AccountTreeIcon />,
    roles: ["SUPER_ADMIN"],
    hasSubItems: true,
    subItems: [
      { 
        id: 'h-management-org', 
        title: 'Organization', 
        path: '/hierarchy-management/org',
        roles: ["SUPER_ADMIN"]
      },
      { 
        id: 'h-management-structure', 
        title: 'Structure', 
        path: '/hierarchy-management/structure',
        roles: ["SUPER_ADMIN"]
      },
      { 
        id: 'h-management-reports', 
        title: 'Reports', 
        path: '/hierarchy-management/reports',
        roles: ["SUPER_ADMIN"]
      },
    ],
  },
];

export default navConfig;