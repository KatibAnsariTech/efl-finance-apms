import React from "react";
import Box from "@mui/material/Box";
import loginImage from "../../../../public/assets/loginImage.webp";

export default function LoginLeftPanel() {
  return (
    <Box
      sx={{
        flex: 1,
        backgroundImage: `url(${loginImage})`,
        backgroundSize: { xs: "cover", sm: "contain", md: "contain" },
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#f5faf4",
        borderRadius: { xs: 2, sm: 3, md: 3 },
        backgroundPositionY: { xs: 0, sm: 5, md: 10 },
        height: "100%",
        minHeight: { xs: "200px", sm: "300px", md: "auto" },
      }}
    />
  );
}
