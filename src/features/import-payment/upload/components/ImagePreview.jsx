import { Box, Tooltip } from "@mui/material";

const ImagePreviewCell = ({ src }) => {
  if (!src) return "-";

  const imageUrl =
    typeof src === "string"
      ? src
      : src?.url || src?.path || "";

  if (!imageUrl) return "-";

  return (
    <Tooltip
      arrow
      placement="right"
      title={
        <Box
          component="img"
          src={imageUrl}
          alt="preview"
          sx={{
            maxWidth: 300,
            maxHeight: 300,
            objectFit: "contain",
            borderRadius: 1,
          }}
        />
      }
    >
      <Box
        component="img"
        src={imageUrl}
        alt="thumbnail"
        sx={{
          width: 40,
          height: 40,
          objectFit: "cover",
          cursor: "pointer",
          borderRadius: 1,
          border: "1px solid #ddd",
        }}
        onClick={(e) => {
          e.stopPropagation();
          window.open(imageUrl, "_blank", "noopener,noreferrer");
        }}
      />
    </Tooltip>
  );
};

export default ImagePreviewCell;
