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
import CreditCardIcon from '@mui/icons-material/CreditCard';

const navConfig = [
  {
    id: 'credit-deviation',
    title: 'Credit Deviation',
    path: '/credit-deviation',
    icon: <CreditCardIcon />,
    roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
    hasSubItems: true,
    subItems: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        path: '/credit-deviation/dashboard',
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
      },
      {
        id: 'request',
        title: 'Request',
        path: '/credit-deviation/request',
        roles: ["REQUESTER"],
      },
      {
        id: 'request-status',
        title: 'Request Status',
        path: '/credit-deviation/request-status',
        roles: ["REQUESTER"],
      },
      {
        id: 'approval',
        title: 'Approval',
        path: '/credit-deviation/approvals',
        roles: ["APPROVER"],
      },
      {
        id: 'master-data',
        title: 'Master Data',
        path: '/credit-deviation/master',
        roles: ["SUPER_ADMIN"],
      },
      {
        id: 'user-management',
        title: 'User Management',
        path: '/credit-deviation/usermanagement',
        roles: ["SUPER_ADMIN"],
      },
      {
        id: 'master-sheet',
        title: 'Master Sheet',
        path: '/credit-deviation/master-sheet',
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        id: 'h-management',
        title: 'H. Management',
        path: '/credit-deviation/hierarchy-management',
        roles: ["SUPER_ADMIN"],
      },
    ],
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
        id: 'jvm-dashboard', 
        title: 'Dashboard', 
        path: '/jvm/dashboard',
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"]
      },
      { 
        id: 'jvm-overview', 
        title: 'JVM Overview', 
        path: '/jvm/overview',
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"]
      }
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
        id: 'import-payment-dashboard', 
        title: 'Dashboard', 
        path: '/import-payment/dashboard',
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"]
      },
      { 
        id: 'import-payment-upload', 
        title: 'Upload Payment', 
        path: '/import-payment/upload',
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"]
      }
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
        id: 'custom-duty-dashboard', 
        title: 'Dashboard', 
        path: '/custom-duty/dashboard',
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
        id: 'petty-cash-dashboard', 
        title: 'Dashboard', 
        path: '/petty-cash/dashboard',
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"]
      },
      { 
        id: 'petty-cash-request', 
        title: 'Request Petty Cash', 
        path: '/petty-cash/request',
        roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"]
      }
    ],
  },
];

export default navConfig;