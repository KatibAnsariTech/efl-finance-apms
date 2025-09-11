import { Box } from "@mui/material";

const CloseButton = ({ tooltip = "Close", onClick }) => (
  <Box
    sx={{
      display: "flex",
      cursor: "pointer",
      position: "relative",
      ml: 2,
      "&:hover .close-tooltip": { opacity: 1, pointerEvents: "auto" },
    }}
    onClick={onClick}
  >
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="#ff562f"
      stroke="#fff"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ borderRadius: "50%" }}
    >
      <circle cx="12" cy="12" r="12" fill="#ff562f" />
      <line x1="8" y1="8" x2="16" y2="16" />
      <line x1="16" y1="8" x2="8" y2="16" />
    </svg>
    <Box
      className="close-tooltip"
      sx={{
        position: "absolute",
        top: 0,
        right: 35,
        background: "#12368d",
        color: "#fff",
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        fontSize: "0.85rem",
        whiteSpace: "nowrap",
        opacity: 0,
        pointerEvents: "none",
        transition: "opacity 0.2s",
        zIndex: 10,
      }}
    >
      {tooltip}
    </Box>
  </Box>
);

export default CloseButton;
