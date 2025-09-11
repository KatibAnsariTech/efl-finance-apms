import { useState } from "react";
import PropTypes from "prop-types";

import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";

import Iconify from "src/components/iconify";
import ActionButtons from "./action-table-row";

export default function FormTableRow({
  sno,
  rowData,
  columns,
  onDelete,
  selectedTab,
  onEdit, // <-- add this prop
}) {
  const [open, setOpen] = useState(null);

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow>
        {columns.map((column, index) => {
          const { name, id, align = "left" } = column;

          if (id === "sno") {
            return (
              <TableCell key={id} align="center">
                {sno}
              </TableCell>
            );
          }

          if (id === "action") {
            return (
              <TableCell key={id}>
                <ActionButtons
                  userId={rowData?._id}
                  onDelete={onDelete}
                  onEdit={() => onEdit(rowData)}
                  selectedTab={selectedTab}
                />
              </TableCell>
            );
          }

          return (
            <TableCell key={id} align={align}>
              {name === "other"
                ? Array.isArray(rowData?.[name])
                  ? rowData[name].map((item) => item?.value).join(" , ")
                  : "-"
                : name === "category"
                ? Array.isArray(rowData?.[name])
                  ? rowData[name].map((item) => item?.value).join(" , ")
                  : "-"
                : rowData?.[name] ?? "-"}
            </TableCell>
          );
        })}
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { width: 140 } }}
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
  sno: PropTypes.number,
  rowData: PropTypes.object,
  columns: PropTypes.array,
  onDelete: PropTypes.func,
  selectedTab: PropTypes.number,
  onEdit: PropTypes.func, // <-- add this prop type
};
