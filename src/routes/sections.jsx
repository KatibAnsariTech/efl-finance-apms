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
import IndexPage from "src/pages/app";
import LoginPage from "src/pages/login";
import NewLoginPage from "src/pages/new-login";
import OTPVerificationPage from "src/pages/otp-verification";
import ResetPasswordPage from "src/pages/reset-password";
import Page404 from "src/pages/page-not-found";
import { MasterSheetView } from "src/sections/master-sheet/view";
import navConfig from "src/layouts/dashboard/config-navigation";
import HierarchyManagementView from "src/sections/hierarchy-management/view/hierarchy-management-view";
import ExactSidebarDemo from "src/pages/exact-sidebar-demo";
import JVMPage from "src/pages/jvm";
import InitiateJVPage from "src/pages/initiate-jv";
import JVStatusPage from "src/pages/jv-status";
import ImportPaymentPage from "src/pages/import-payment";
import CustomDutyPage from "src/pages/custom-duty";
import PettyCashPage from "src/pages/petty-cash";
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
    const redirectPath = firstAvailablePage?.path || "/request";
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
          path: "dashboard",
          element: <IndexPage />,
        },
        {
          path: "request",
          element: <RoleRoute path="/request" element={<RaiseTicket />} />,
        },
        {
          path: "request-status",
          element: <RoleRoute path="/request-status" element={<FormView />} />,
        },
        {
          path: "approvals",
          element: <RoleRoute path="/approvals" element={<ApprovalView />} />,
        },
        {
          path: "approvals/view/:id",
          element: (
            <RoleRoute path="/approvals" element={<FormDetailsView />} />
          ),
        },
        {
          path: "request-status/view/:id",
          element: (
            <RoleRoute
              path="/request-status"
              element={<FormDetailsViewForm />}
            />
          ),
        },
        {
          path: "usermanagement",
          element: (
            <RoleRoute
              path="/usermanagement"
              element={<UserManagementView />}
            />
          ),
        },
        {
          path: "/master",
          element: <RoleRoute path="/master" element={<MasterView />} />,
        },
        {
          path: "/master-sheet",
          element: (
            <RoleRoute path="/master-sheet" element={<MasterSheetView />} />
          ),
        },
        {
          path: "/hierarchy-management",
          element: (
            <RoleRoute
              path="/hierarchy-management"
              element={<HierarchyManagementView />}
            />
          ),
        },
        {
          path: "/exact-sidebar-demo",
          element: <ExactSidebarDemo />,
        },
        {
          path: "/jvm",
          element: <RoleRoute path="/jvm" element={<JVMPage />} />,
        },
        {
          path: "/initiate-jv",
          element: <RoleRoute path="/initiate-jv" element={<InitiateJVPage />} />,
        },
        {
          path: "/jv-status",
          element: <RoleRoute path="/jv-status" element={<JVStatusPage />} />,
        },
        {
          path: "/import-payment",
          element: <RoleRoute path="/import-payment" element={<ImportPaymentPage />} />,
        },
        {
          path: "/custom-duty",
          element: <RoleRoute path="/custom-duty" element={<CustomDutyPage />} />,
        },
        {
          path: "/petty-cash",
          element: <RoleRoute path="/petty-cash" element={<PettyCashPage />} />,
        },
      ],
    },
    {
      path: "/login",
      element: isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />,
    },
    {
      path: "/new-login",
      element: isLoggedIn ? <Navigate to="/" replace /> : <NewLoginPage />,
    },
    {
      path: "/otp-verification",
      element: isLoggedIn ? <Navigate to="/" replace /> : <OTPVerificationPage />,
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
