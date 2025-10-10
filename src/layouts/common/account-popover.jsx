import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import swal from "sweetalert";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import MenuList from "@mui/material/MenuList";
import MenuItem, { menuItemClasses } from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import { clearTokens } from "src/requestMethod";
import { useAccount } from "src/hooks/use-account";
import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  // {
  //   label: "Home",
  //   href: "/",
  //   icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
  // },
  // {
  //   label: "Profile",
  //   href: "/profile",
  //   icon: <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />,
  // },
  {
    label: "Settings",
    href: "/settings",
    icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover({ data = MENU_OPTIONS, sx, ...other }) {
  const [openPopover, setOpenPopover] = useState(null);
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const initialAccount = useAccount();

  useEffect(() => {
    const getAccountData = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        return {
          ...user,
          photoURL: user.profileImg && user.profileImg.trim() !== "" ? user.profileImg : "/assets/eurekaforbes-icon.png",
          displayName: user.displayName || user.username || "User",
          accessibleProjects: user.accessibleProjects || [],
          projectRoles: user.projectRoles || {},
        };
      }
      return {
        displayName: "",
        email: "",
        photoURL: "/assets/eurekaforbes-icon.png",
        userRoles: [],
        accessibleProjects: [],
        projectRoles: {},
      };
    };

    setAccount(getAccountData());

    const handleStorageChange = () => {
      setAccount(getAccountData());
    };

    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(() => {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser && account && currentUser.profileImg !== account.profileImg) {
        setAccount(getAccountData());
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [account]);

  const handleOpenPopover = useCallback((event) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleClickItem = useCallback(
    (path) => {
      handleClosePopover();
      navigate(path);
    },
    [handleClosePopover, navigate]
  );

  const logout = () => {
    clearTokens();
    swal({
      title: "Logout",
      text: "Logged out successfully",
      icon: "success",
    }).then(() => {
      navigate("/login");
    });
  };

  return (
    <>
      <IconButton
        onClick={handleOpenPopover}
        sx={{
          p: "2px",
          width: 40,
          height: 40,
          // background: (theme) =>
          //   `conic-gradient(${theme.palette.primary.light}, ${theme.palette.warning.light}, ${theme.palette.primary.light})`,
          background: (theme) => theme.palette.background.default,
          ...sx,
        }}
        {...other}
      >
        <Avatar
          src={account?.photoURL}
          alt={account?.displayName}
          sx={{ width: 1, height: 1 }}
        >
          {account?.displayName?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: { width: 200,mt: 1.5, ml: 0.5},
          },
        }}
      >
        {/* Account Info */}
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {account?.username || account?.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {account?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        {/* Menu Options */}
        <MenuList
          disablePadding
          sx={{
            p: 1,
            gap: 0.5,
            display: "flex",
            flexDirection: "column",
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
              [`&.${menuItemClasses.selected}`]: {
                color: "text.primary",
                bgcolor: "action.selected",
                fontWeight: "fontWeightSemiBold",
              },
            },
          }}
        >
          {data.map((option) => (
            <MenuItem
              key={option.label}
              selected={option.href === location.pathname}
              onClick={() => handleClickItem(option.href)}
            >
              {option.icon}
              {option.label}
            </MenuItem>
          ))}
        </MenuList>

        <Divider sx={{ borderStyle: "dashed" }} />

        {/* Logout */}
        <Box sx={{ p: 1 }}>
          <Button fullWidth color="error" size="medium" variant="text" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Popover>
    </>
  );
}
