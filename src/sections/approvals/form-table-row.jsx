import { useState } from "react";
import PropTypes from "prop-types";

import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";

import Iconify from "src/components/iconify";
import { fDateTime } from "src/utils/format-time";

export default function FormTableRow({
  createdAt,
  slNo,
  status,
  customerCode,
  channel,
  region,
  salesOffice,
  salesGroup,
  onClick,
  onSLClick,
  selectedTab,
}) {
  const [open, setOpen] = useState(null);

  const handleCloseMenu = () => {
    setOpen(null);
  };

  // Map status to color (same as ColorIndicator)
  const statusColorMap = {
    Approved: "#baf5c2",
    Pending: "#f4f5ba",
    "Clarification Needed": "#9be7fa",
    Declined: "#e6b2aa",
  };

  // Normalize status for mapping
  const normalizedStatus = (status || "").toLowerCase();
  let rowColor = "white";
  if (normalizedStatus === "pending") rowColor = statusColorMap["Pending"];
  else if (normalizedStatus === "declined")
    rowColor = statusColorMap["Declined"];
  else if (normalizedStatus === "approved")
    rowColor = statusColorMap["Approved"];
  else if (normalizedStatus === "clarification needed")
    rowColor = statusColorMap["Clarification Needed"];
  // fallback: if status is not recognized, use white

  return (
    <>
      <TableRow tabIndex={-1} sx={{ backgroundColor: rowColor }}>
        <TableCell>{fDateTime(createdAt)}</TableCell>
        <TableCell
          onClick={onSLClick}
          sx={{
            cursor: "pointer",
            color: "#1976d2",
            textDecoration: "underline",
            textDecorationThickness: "2px",
            textUnderlineOffset: "4px",
            fontWeight: 600,
            "&:hover": { color: "#1565c0" },
          }}
        >
          {slNo}
        </TableCell>
        <TableCell
          onClick={onClick}
          sx={{
            cursor: "pointer",
            color: "#1976d2",
            textDecoration: "underline",
            textDecorationThickness: "2px",
            textUnderlineOffset: "4px",
            fontWeight: 600,
            "&:hover": { color: "#1565c0" },
          }}
        >
          {status}
        </TableCell>
        <TableCell>{customerCode}</TableCell>
        <TableCell>{channel}</TableCell>
        <TableCell>{region}</TableCell>
        <TableCell>{salesOffice}</TableCell>
        <TableCell>{salesGroup}</TableCell>
      </TableRow>
      {/* Popover Menu */}
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: "error.main" }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

FormTableRow.propTypes = {
  createdAt: PropTypes.string,
  slNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  channel: PropTypes.string,
  financialYear: PropTypes.string,
  month: PropTypes.string,
  region: PropTypes.string,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  requester: PropTypes.string,
  pendingWith: PropTypes.string,
  status: PropTypes.string,
  onClick: PropTypes.func,
};
