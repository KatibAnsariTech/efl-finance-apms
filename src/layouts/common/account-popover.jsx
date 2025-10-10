import { useState, useCallback } from "react";
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
import { useAccountContext } from "src/contexts/AccountContext";
import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: "Settings",
    href: "/settings",
    icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover({ data = MENU_OPTIONS, sx, ...other }) {
  const [openPopover, setOpenPopover] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const account = useAccount();
  const { clearAccount } = useAccountContext();

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
    clearAccount();
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
            sx: { width: 200, mt: 1.5, ml: 0.5 },
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {account?.username || account?.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {account?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

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

        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            color="error"
            size="medium"
            variant="text"
            onClick={logout}
          >
            Logout
          </Button>
        </Box>
      </Popover>
    </>
  );
}
