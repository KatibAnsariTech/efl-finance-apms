// eslint-disable-next-line perfectionist/sort-imports
import { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { Outlet, Navigate, useRoutes } from "react-router-dom";

import DashboardLayout from "src/layouts/dashboard";
import UserManagementView from "src/sections/usermanagement/view/usermanagement-view";
import { FormView } from "src/sections/forms/view";
import { ApprovalView } from "src/sections/approvals/view";
import { RaiseTicket } from "src/sections/raise-ticket/view";
import FormDetailsView from "src/sections/approvals/form-details/view/FormDetailsView";
import FormDetailsViewForm from "src/sections/forms/form-details/view/FormDetailsView";
import { MasterView } from "src/sections/master/view";
import IndexPage from "src/features/app/pages/App";
import LoginPage from "src/features/auth/pages/Login";
import OTPVerificationPage from "src/features/auth/pages/OTPVerification";
import ResetPasswordPage from "src/features/auth/pages/ResetPassword";
import Page404 from "src/features/error/pages/PageNotFound";
import { MasterSheetView } from "src/sections/master-sheet/view";
import navConfig from "src/layouts/dashboard/config-navigation";
import HierarchyManagementView from "src/sections/hierarchy-management/view/hierarchy-management-view";
import JVMPage from "src/features/jvm/dashboard/pages/JVM";
import ImportPaymentPage from "src/features/import-payment/dashboard/pages/ImportPayment";
import CustomDutyPage from "src/features/custom-duty/dashboard/pages/CustomDuty";
import PettyCashPage from "src/features/petty-cash/dashboard/pages/PettyCash";
import CreditDeviationPage from "src/features/credit-deviation/pages/CreditDeviation";
import CreditDeviationDashboard from "src/features/credit-deviation/components/CreditDeviationDashboard";
import JVMDashboard from "src/features/jvm/dashboard/components/JVMDashboard";
import ImportPaymentDashboard from "src/features/import-payment/dashboard/components/ImportPaymentDashboard";
import CustomDutyDashboard from "src/features/custom-duty/dashboard/components/CustomDutyDashboard";
import PettyCashDashboard from "src/features/petty-cash/dashboard/components/PettyCashDashboard";
// JVM subpages
import JVStatusPage from "src/features/jvm/jvs-status/pages/JVStatus";
import InitiateJVPage from "src/features/jvm/initiate-jv/pages/InitiateJV";
import JVDetailPage from "src/features/jvm/jvs-status/pages/JVDetails";
// Import Payment subpages
import ImportPaymentUploadPage from "src/features/import-payment/upload/pages/ImportPaymentUpload";
// Custom Duty subpages
// Petty Cash subpages
import PettyCashRequestPage from "src/features/petty-cash/request/pages/PettyCashRequest";
import RaiseRequest from "src/features/custom-duty/raise-request/pages/RaiseRequest.jsx";
import MyRequests from "src/features/custom-duty/my-requests/pages/MyRequests";
import Requests from "src/features/custom-duty/requests/pages/Requests";
import RaiseToBank from "src/features/custom-duty/raise-to-bank/pages/RaiseToBank";
import SubmitDetail from "src/features/custom-duty/raise-to-bank/pages/SubmitDetail";
import CustomDutyMaster from "src/features/custom-duty/master/pages/CustomDutyMaster";
// Master Data subpages
// User Management subpages
// Hierarchy Management subpages
// import { RaiseTicket } from 'src/sections/raise-ticket/view';

// export const IndexPage = lazy(() => import("src/pages/app"));
// export const LoginPage = lazy(() => import("src/pages/login"));
// export const FormView = lazy(() =>
//   import("src/sections/forms/view/forms-view")
// );
// export const ApprovalView = lazy(() =>
//   import("src/sections/approvals/view/approval-view")
// );
// export const FormDetailsView = lazy(() =>
//   import("src/sections/approvals/form-details/view/FormDetailsView")
// );
// export const FormDetailsViewForm = lazy(() =>
//   import("src/sections/forms/form-details/view/FormDetailsView")
// );
// export const RaiseTicket = lazy(() =>
//   import("src/sections/raise-ticket/view/raise-ticket")
// );
// export const MasterView = lazy(() =>
//   import("src/sections/master/view/master-view")
// );
// export const Page404 = lazy(() => import("src/pages/page-not-found"));

export default function Router() {
  const isLoggedIn = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));
  const isSAdmin = user?.userType === "SUPER_ADMIN";

  const AdminRoute = ({ children }) => {
    return isSAdmin ? children : <Navigate to="/" replace />;
  };

  // Helper to get allowed roles for a path from navConfig
  const getAllowedRoles = (path) => {
    const item = navConfig.find((nav) => nav.path === path);
    return item?.roles || [];
  };

  // Wrapper for role-based route protection
  const RoleRoute = ({ path, element }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userRole = user?.userType || "REQUESTER";
    const allowedRoles = getAllowedRoles(path);
    if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
      return element;
    }
    return <Page404 />;
  };

  const RoleBasedRedirect = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userRole = user?.userType || "REQUESTER";
    const firstAvailablePage = navConfig.find((nav) =>
      nav.roles.includes(userRole)
    );
    const redirectPath =
      firstAvailablePage?.path || "/credit-deviation/request";
    return <Navigate to={redirectPath} replace />;
  };

  const routes = useRoutes([
    {
      path: "/",
      element: isLoggedIn ? (
        <DashboardLayout>
          <Suspense>
            <ToastContainer />
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        { element: <IndexPage />, index: true },
        // { index: true, element: <RoleBasedRedirect /> },

        {
          path: "/jvm",
          element: <RoleRoute path="/jvm" element={<JVMPage />} />,
        },
        {
          path: "/import-payment",
          element: (
            <RoleRoute path="/import-payment" element={<ImportPaymentPage />} />
          ),
        },
        {
          path: "/custom-duty",
          element: (
            <RoleRoute path="/custom-duty" element={<CustomDutyPage />} />
          ),
        },
        {
          path: "/petty-cash",
          element: <RoleRoute path="/petty-cash" element={<PettyCashPage />} />,
        },
        {
          path: "/credit-deviation",
          element: (
            <RoleRoute
              path="/credit-deviation"
              element={<CreditDeviationPage />}
            />
          ),
        },
        {
          path: "/credit-deviation/dashboard",
          element: (
            <RoleRoute
              path="/credit-deviation/dashboard"
              element={<CreditDeviationDashboard />}
            />
          ),
        },
        {
          path: "/jvm/dashboard",
          element: (
            <RoleRoute path="/jvm/dashboard" element={<JVMDashboard />} />
          ),
        },
        {
          path: "/import-payment/dashboard",
          element: (
            <RoleRoute
              path="/import-payment/dashboard"
              element={<ImportPaymentDashboard />}
            />
          ),
        },
        {
          path: "/custom-duty/dashboard",
          element: (
            <RoleRoute
              path="/custom-duty/dashboard"
              element={<CustomDutyDashboard />}
            />
          ),
        },
        {
          path: "/petty-cash/dashboard",
          element: (
            <RoleRoute
              path="/petty-cash/dashboard"
              element={<PettyCashDashboard />}
            />
          ),
        },
        // Credit Deviation subpages
        {
          path: "/credit-deviation/request",
          element: (
            <RoleRoute
              path="/credit-deviation/request"
              element={<RaiseTicket />}
            />
          ),
        },
        {
          path: "/credit-deviation/request-status",
          element: (
            <RoleRoute
              path="/credit-deviation/request-status"
              element={<FormView />}
            />
          ),
        },
        {
          path: "/credit-deviation/approvals",
          element: (
            <RoleRoute
              path="/credit-deviation/approvals"
              element={<ApprovalView />}
            />
          ),
        },
        {
          path: "/credit-deviation/master",
          element: (
            <RoleRoute
              path="/credit-deviation/master"
              element={<MasterView />}
            />
          ),
        },
        {
          path: "/credit-deviation/usermanagement",
          element: (
            <RoleRoute
              path="/credit-deviation/usermanagement"
              element={<UserManagementView />}
            />
          ),
        },
        {
          path: "/credit-deviation/master-sheet",
          element: (
            <RoleRoute
              path="/credit-deviation/master-sheet"
              element={<MasterSheetView />}
            />
          ),
        },
        {
          path: "/credit-deviation/hierarchy-management",
          element: (
            <RoleRoute
              path="/credit-deviation/hierarchy-management"
              element={<HierarchyManagementView />}
            />
          ),
        },
        {
          path: "credit-deviation/approvals/view/:id",
          element: (
            <RoleRoute
              path="/credit-deviation/approvals"
              element={<FormDetailsView />}
            />
          ),
        },
        {
          path: "credit-deviation/request-status/view/:id",
          element: (
            <RoleRoute
              path="/credit-deviation/request-status"
              element={<FormDetailsViewForm />}
            />
          ),
        },
        // JVM subpages
        {
          path: "/jvm/initiate-jv",
          element: (
            <RoleRoute path="/jvm/initiate-jv" element={<InitiateJVPage />} />
          ),
        },
        {
          path: "/jvm/jv-status",
          element: (
            <RoleRoute path="/jvm/jv-status" element={<JVStatusPage />} />
          ),
        },
        {
          path: "/jvm/jv-status/jv-detail/:jvId",
          element: <JVDetailPage />,
        },
        // Import Payment subpages
        {
          path: "/import-payment/upload",
          element: (
            <RoleRoute
              path="/import-payment/upload"
              element={<ImportPaymentUploadPage />}
            />
          ),
        },
        // Custom Duty subpages
        {
          path: "/custom-duty/raise-request",
          element: (
            <RoleRoute
              path="/custom-duty/raise-request"
              element={<RaiseRequest />}
            />
          ),
        },
        {
          path: "/custom-duty/my-requests",
          element: (
            <RoleRoute
              path="/custom-duty/my-requests"
              element={<MyRequests />}
            />
          ),
        },
        {
          path: "/custom-duty/requests",
          element: (
            <RoleRoute path="/custom-duty/requests" element={<Requests />} />
          ),
        },
        {
          path: "/custom-duty/raise-to-bank",
          element: (
            <RoleRoute
              path="/custom-duty/raise-to-bank"
              element={<RaiseToBank />}
            />
          ),
        },
        {
          path: "/custom-duty/raise-to-bank/submit-detail/:id",
          element: (
            <RoleRoute
              path="/custom-duty/raise-to-bank/submit-detail/:id"
              element={<SubmitDetail />}
            />
          ),
        },
        {
          path: "/custom-duty/master",
          element: (
            <RoleRoute
              path="/custom-duty/master"
              element={<CustomDutyMaster />}
            />
          ),
        },
        // Petty Cash subpages
        {
          path: "/petty-cash/request",
          element: (
            <RoleRoute
              path="/petty-cash/request"
              element={<PettyCashRequestPage />}
            />
          ),
        },
      ],
    },
    {
      path: "/login",
      element: isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />,
    },
    {
      path: "/otp-verification",
      element: isLoggedIn ? (
        <Navigate to="/" replace />
      ) : (
        <OTPVerificationPage />
      ),
    },
    {
      path: "/reset-password",
      element: isLoggedIn ? <Navigate to="/" replace /> : <ResetPasswordPage />,
    },
    {
      path: "404",
      element: <Page404 />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
