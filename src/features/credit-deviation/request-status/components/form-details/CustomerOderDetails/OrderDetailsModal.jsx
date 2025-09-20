import React from "react";
import {
  Box,
  Typography,
  Modal,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Grid,
} from "@mui/material";
import { RxCross2 } from "react-icons/rx";


const OrderDetailsModal = ({ open, handleClose, order }) => {
  // Map order info for API or fallback
  let orderInfo;
  if (order && order.SAPORDER) {
    orderInfo = {
      orderNumber: order.SAPORDER,
      orderDate: order.ORDERDATE,
      orderValue: order.ORDER_VALUE || order.TOTALORDERVALUE,
      creditDays: order.CREDITDAY,
    };
  } else if (!order) {
    orderInfo = {
      orderNumber: "-",
      orderDate: "-",
      orderValue: "-",
      creditDays: "-",
    };
  }

  // Material data: support array or single object
  let materials = [];
  if (order && order.MATERIAL_DATA && order.MATERIAL_DATA.item) {
    if (Array.isArray(order.MATERIAL_DATA.item)) {
      materials = order.MATERIAL_DATA.item;
    } else {
      materials = [order.MATERIAL_DATA.item];
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxHeight: "90vh",
          bgcolor: "background.paper",
          borderRadius: 5,
          p: 4,
          overflow: "auto",
        }}
      >
        {/* Header */}
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <span style={{ fontSize: "24px", fontWeight: "bolder" }}>
            Order Detail: {orderInfo.orderNumber}
          </span>
          <RxCross2
            onClick={handleClose}
            style={{
              color: "#B22222",
              fontWeight: "bolder",
              cursor: "pointer",
              height: "24px",
              width: "24px",
            }}
          />
        </Typography>

        {/* Top Table */}
        <Table sx={{ mb: 4 }}>
          <TableHead>
            <TableRow>
              {["Order Number", "Order Date", "Order Value", "Credit Days"].map((label, idx) => (
                <TableCell
                  key={label}
                  sx={{
                    backgroundColor: "#083389",
                    color: "white",
                    ...(idx === 0 && { borderTopLeftRadius: 8 }),
                    ...(idx === 3 && { borderTopRightRadius: 8 }),
                  }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{orderInfo.orderNumber}</TableCell>
              <TableCell>{orderInfo.orderDate}</TableCell>
              <TableCell>{orderInfo.orderValue}</TableCell>
              <TableCell>{orderInfo.creditDays}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Bottom Table */}
        <Table>
          <TableHead>
            <TableRow>
              {["Material Code", "Material Name", "Quantity", "Value(INR)"].map(
                (label, idx) => (
                  <TableCell
                    key={label}
                    sx={{
                      backgroundColor: "#083389",
                      color: "white",
                      ...(idx === 0 && { borderTopLeftRadius: 8 }),
                      ...(idx === 3 && { borderTopRightRadius: 8 }),
                    }}
                  >
                    {label}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.length > 0 ? (
              materials.map((mat, idx) => (
                <TableRow key={idx}>
                  <TableCell>{mat.MATERIAL}</TableCell>
                  <TableCell>{mat.DESCRIPTION}</TableCell>
                  <TableCell>{mat.ORDERQUANTITY}</TableCell>
                  <TableCell>{mat.NETPRICE}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">No material data</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Modal>
  );
};

export default OrderDetailsModal;
