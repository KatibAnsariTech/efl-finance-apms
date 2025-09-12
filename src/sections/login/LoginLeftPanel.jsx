import React from "react";
import Box from "@mui/material/Box";
import loginImage from "../../../public/assets/loginImage.webp";

export default function LoginLeftPanel() {
  return (
    <Box
      sx={{
        flex: 1,
        backgroundImage: `url(${loginImage})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#f5faf4",
        borderRadius: 3,
        backgroundPositionY: 10,
      }}
    />
  );
}
