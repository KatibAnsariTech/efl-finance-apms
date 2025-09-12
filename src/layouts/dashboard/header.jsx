/* eslint-disable perfectionist/sort-imports */
/* eslint-disable import/order */
// eslint-disable-line react-hooks/exhaustive-deps
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { useResponsive } from "src/hooks/use-responsive";

import { bgBlur } from "src/theme/css";

import Iconify from "src/components/iconify";

// import Searchbar from './common/searchbar';
import { NAV, HEADER } from "./config-layout";
import AccountPopover from "./common/account-popover";
// import LanguagePopover from './common/language-popover';
// import NotificationsPopover from './common/notifications-popover';
import { useLocation } from "react-router-dom";
import { BACKEND_URL } from "src/config/config";
import NotificationsPopover from "./common/notifications-popover";
import { userRequest } from "src/requestMethod";
import { Button } from "@mui/material";
import { useRouter } from "src/routes/hooks";

// ----------------------------------------------------------------------

export default function Header({ onOpenNav, collapsed }) {
  const theme = useTheme();
  const location = useLocation();
  const [notificationData, setNotificationData] = useState(false);
  const [page, setPage] = useState(1);
  const lgUp = useResponsive("up", "lg");
  const router = useRouter();
  const getAllUserNotificationData = async (page = 1) => {
    try {
      const data = await userRequest.get("/admin/getAllNotifications", {
        params: { page },
      });
      setNotificationData(data.data);
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    setPage(1);

    // getAllUserNotificationData();
  }, []);

  // useEffect(() => {
  //   const socket = io(BACKEND_URL);
  //   socket.on('connect', () => {
  //     console.log('Connected to socket');
  //     socket.emit('setup', 'Admin');
  //   });

  //   socket.on('New_Data_Emit', (data) => {
  //     const newData = JSON.parse(data);
  //     toast(`New ticket request added for ${newData.type}`);
  //     getAllUserNotificationData();
  //   });

  //   socket.on('New_Data_Update_Emit', (data) => {
  //     const newData = JSON.parse(data);
  //     toast(`Ticket Status Updated`);
  //     getAllUserNotificationData();
  //   });
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  const getCurrentTitle = (path) => {
    if (path === "/") return "Dashboard";
    // if (path.startsWith("/request-status")) return "My Requests";
    // if (path.startsWith("/request")) return "Request";
    if (/^\/request-status/.test(path)) return "My Requests";
    if (/^\/request(\/|$)/.test(path)) return "Request";
    if (path.startsWith("/approvals/view/")) return "Request Details";
    if (path.startsWith("/request-status/view/")) return "Request Details";
    if (path.startsWith("/approvals")) return "Approvals Requests";
    if (path.startsWith("/usermanagement")) return "User Management";
    if (path.startsWith("/master")) return "Master Data";
    if (path.startsWith("/hierarchy-management")) return "Hierarchy Management";
    return "Welcome back 👋";
  };

  const currentTitle = getCurrentTitle(location.pathname);

  const renderContent = (
    <>
      {!lgUp && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1 }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )}

      {/* <Searchbar /> */}

      <Typography variant="h4" sx={{ mb: 5, color: "black", mt: 5 }}>
        {currentTitle}
      </Typography>

      <Box sx={{ flexGrow: 1 }} />

      <Stack
        style={{ display: "flex", alignItems: "center", gap: "10px" }}
        direction="row"
        alignItems="center"
        spacing={1}
      >
        {/* <LanguagePopover /> */}
        {/* <NotificationsPopover
          notificationData={notificationData}
          // setPage={setPage}
          // getAllUserNotificationData={getAllUserNotificationData}
          // setNotificationData={setNotificationData}
        /> */}
        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow:
          location.pathname.startsWith("/approvals/view/") ||
          location.pathname.startsWith("/request-status/view/")
            ? "1px 1px 1px rgba(0, 0, 0, 0.1)"
            : "none",
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(["height"], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: collapsed
            ? `calc(100% - ${80 + 1}px)`
            : `calc(100% - ${NAV.WIDTH + 1}px)`,
          height: HEADER.H_DESKTOP,
          marginLeft: collapsed ? '80px' : `${NAV.WIDTH}px`,
          transition: 'all 0.3s ease',
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
