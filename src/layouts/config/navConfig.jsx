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
import UndoIcon from "@mui/icons-material/Undo";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReportIcon from '@mui/icons-material/Report';

const projectConfig = {
  JVM: {
    id: "jvm",
    title: "JVM",
    path: "/jvm",
    icon: <BarChartIcon />,
    hasSubItems: true,
    subItems: [
      {
        id: "initiate-jv",
        title: "Initiate JV",
        path: "/jvm/initiate-jv",
        icon: <RequestPageIcon />,
        roles: ["REQUESTER"],
      },
      {
        id: "requested-jvs",
        title: "Requested JV's",
        path: "/jvm/requested-jvs",
        icon: <AssignmentTurnedInIcon />,
        roles: ["REQUESTER"],
      },
      {
        id: "jvm-requests",
        title: "Requests",
        path: "/jvm/requests",
        icon: <ViewListIcon />,
        roles: ["APPROVER"],
      },
      {
        id: "auto-reversal",
        title: "Auto Reversal",
        path: "/jvm/auto-reversal",
        icon: <UndoIcon />,
        roles: ["REQUESTER"],
      },
      {
        id: "jvm-report",
        title: "Report",
        path: "/jvm/report",
        icon: <AssessmentIcon />,
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        id: "jvm-master",
        title: "Master Data",
        path: "/jvm/master",
        icon: <AssignmentIcon />,
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        id: "jvm-user-management",
        title: "User Management",
        path: "/jvm/usermanagement",
        icon: <ManageAccountsIcon />,
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        id: "jvm-hierarchy-management",
        title: "Hierarchy Management",
        path: "/jvm/hierarchy-management",
        icon: <AccountTreeIcon />,
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  IMT: {
    id: "import-payment",
    title: "Import Payment",
    path: "/import-payment",
    icon: <FileUploadIcon />,
    hasSubItems: true,
    subItems: [
      {
        id: "report",
        title: "Report",
        path: "/import-payment/report",
        icon: <ReportIcon />,
        roles: ["APPROVER", "ADMIN", "SUPER_ADMIN"],
      },
      {
        id: "request",
        title: "Request",
        path: "/import-payment/request",
        icon: <RequestPageIcon />,
        roles: ["APPROVER"]
      },
       {
        id: "master",
        title: "Master Data",
        path: "/import-payment/master",
        icon: <AssignmentIcon />,
        roles: ["SUPER_ADMIN"],
      },
       {
        id: "usermanagement",
        title: "User Management",
        path: "/import-payment/usermanagement",
        icon: <ManageAccountsIcon />,
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
       {
        id: "raised-request",
        title: "Raise Request",
        path: "/import-payment/raised-request",
        icon: <RequestPageIcon />,
        roles: ["REQUESTER"],
      },
       {
        id: "my-request",
        title: "My Request",
        path: "/import-payment/my-request",
        icon: <RequestPageIcon />,
        roles: ["REQUESTER"],
      },
      {
        id: "access-point",
        title: "Access Point",
        path: "/import-payment/access-point",
        icon: <AccessTimeIcon />,
        roles: ["SUPER_ADMIN"],
      },
      {
        id: "hierarchy-flow",
        title: "Hierarchy Flow",
        path: "/import-payment/hierarchy-flow",
        icon: <AccountTreeIcon />,
        roles: ["SUPER_ADMIN"],
      },
      {
        id: "import-payment-upload",
        title: "Upload Payment",
        path: "/import-payment/upload",
        icon: <FileUploadIcon />,
        roles: ["APPROVER"],
      },
    ],
  },
  CUSTOM: {
    id: "custom-duty",
    title: "Custom Duty",
    path: "/custom-duty",
    icon: <AccountBalanceIcon />,
    hasSubItems: true,
    subItems: [
      {
        id: "custom-duty-raise-request",
        title: "Raise Request",
        path: "/custom-duty/raise-request",
        icon: <AddCircleIcon />,
        roles: ["REQUESTER"],
      },
      {
        id: "custom-duty-my-requests",
        title: "My Requests",
        path: "/custom-duty/my-requests",
        icon: <ListAltIcon />,
        roles: ["REQUESTER"],
      },
      {
        id: "custom-duty-requests",
        title: "Requests",
        path: "/custom-duty/requests",
        icon: <ViewListIcon />,
        roles: ["APPROVER"],
      },
      {
        id: "custom-duty-raise-to-bank",
        title: "Raise to Bank",
        path: "/custom-duty/raise-to-bank",
        icon: <AccountBalanceWalletIcon />,
        roles: ["REQUESTER"],
      },
      {
        id: "custom-duty-master",
        title: "Master Data",
        path: "/custom-duty/master",
        icon: <SettingsIcon />,
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        id: "custom-duty-user-management",
        title: "User Management",
        path: "/custom-duty/user-management",
        icon: <ManageAccountsIcon />,
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        id: "custom-duty-hierarchy-management",
        title: "Hierarchy Management",
        path: "/custom-duty/hierarchy-management",
        icon: <AccountTreeIcon />,
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  PC: {
    id: "petty-cash",
    title: "Petty Cash",
    path: "/petty-cash",
    icon: <AttachMoneyIcon />,
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
  CPX: {
    id: "capex",
    title: "CAPEX",
    path: "/capex",
    icon: <TrendingUpIcon />,
    hasSubItems: true,
    subItems: [
      {
        id: "capex-raise-request",
        title: "Raise Request",
        path: "/capex/raise-request",
        icon: <RequestPageIcon />,
        roles: ["REQUESTER"],
      },
      {
        id: "capex-my-requests",
        title: "My Requests",
        path: "/capex/my-requests",
        icon: <ListAltIcon />,
        roles: ["REQUESTER"],
      },
      {
        id: "capex-requests",
        title: "Requests",
        path: "/capex/requests",
        icon: <ViewListIcon />,
        roles: ["APPROVER"],
      },
      {
        id: "capex-master",
        title: "Master Data",
        path: "/capex/master",
        icon: <SettingsIcon />,
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
};

export const generateNavigationConfig = (accessibleProjects, userRoles, user = null) => {
  const navItems = [];

  // Helper function to check if userType (array or string) includes any of the required roles
  const hasUserType = (userType, requiredRoles) => {
    const userTypes = Array.isArray(userType) ? userType : [userType];
    return userTypes.some(type => requiredRoles.includes(type));
  };

  // Helper function to check if userType (array or string) includes a specific role
  const includesUserType = (userType, role) => {
    const userTypes = Array.isArray(userType) ? userType : [userType];
    return userTypes.includes(role);
  };

  accessibleProjects.forEach((projectType) => {
    if (projectConfig[projectType]) {
      const project = projectConfig[projectType];
      const userType = userRoles[projectType];
      console.log("project>>>",project)
      const filteredSubItems = project.subItems.filter((subItem) => {
        // Special handling for IMT project type
        if (projectType === "IMT") {
          // Report: Show if report is available in accessPoints, except for SUPER_ADMIN (SUPER_ADMIN uses role-based filtering)
          if (subItem.id === "report") {
            if (includesUserType(userType, "SUPER_ADMIN")) {
              // SUPER_ADMIN uses default role-based filtering
              return hasUserType(userType, subItem.roles);
            }
            // For non-SUPER_ADMIN: check if accessPoints.report exists
            const hasReportAccess = user?.accessPoints?.report !== undefined;
            return hasReportAccess;
          }
          
          // Upload Payment: Show for APPROVER if output_document is available in accessPoints
          if (subItem.id === "import-payment-upload") {
            const hasOutputDocumentAccess = user?.accessPoints?.output_document !== undefined;
            return includesUserType(userType, "APPROVER") && hasOutputDocumentAccess;
          }
        }
        
        // Default role-based filtering
        return hasUserType(userType, subItem.roles);
      });

      if (filteredSubItems.length > 0) {
        navItems.push({
          ...project,
          subItems: filteredSubItems,
          projectType: projectType,
          userType: userType,
        });
      }
    }
  });

  // navItems.push({
  //   id: "settings",
  //   title: "Settings",
  //   path: "/settings",
  //   icon: <SettingsIcon />,
  //   hasSubItems: true,
  //   subItems: [
  //     {
  //       id: "profile",
  //       title: "My Profile",
  //       path: "/settings/profile",
  //       icon: <PersonIcon />,
  //       roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
  //     },
  //     {
  //       id: "change-password",
  //       title: "Change Password",
  //       path: "/settings/change-password",
  //       icon: <LockIcon />,
  //       roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
  //     },
  //     {
  //       id: "add-user",
  //       title: "Add User",
  //       path: "/settings/add-user",
  //       icon: <LockIcon />,
  //       roles: ["SUPER_ADMIN"],
  //     },
  //   ],
  // });

  // Get all unique user roles across all projects
  // Flatten arrays and get unique values
  const allUserRoles = [...new Set(
    Object.values(userRoles).flatMap(userType => 
      Array.isArray(userType) ? userType : [userType]
    )
  )];
  const settingsSubItems = [
    {
      id: "profile",
      title: "My Profile",
      path: "/settings/profile",
      icon: <PersonIcon />,
      roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
    },
    {
      id: "change-password",
      title: "Change Password",
      path: "/settings/change-password",
      icon: <LockIcon />,
      roles: ["REQUESTER", "APPROVER", "ADMIN", "SUPER_ADMIN"],
    },
    {
      id: "add-user",
      title: "Add User",
      path: "/settings/add-user",
      icon: <LockIcon />,
      roles: ["SUPER_ADMIN"],
    },
  ].filter((subItem) =>
    subItem.roles.some((role) => allUserRoles.includes(role))
  );

  if (settingsSubItems.length > 0) {
    navItems.push({
      id: "settings",
      title: "Settings",
      path: "/settings",
      icon: <SettingsIcon />,
      hasSubItems: true,
      subItems: settingsSubItems,
    });
  }
  return navItems;
};

export { projectConfig };
export default generateNavigationConfig;
