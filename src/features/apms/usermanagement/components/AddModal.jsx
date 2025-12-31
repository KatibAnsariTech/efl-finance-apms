import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { RxCross2 } from "react-icons/rx";
import PropTypes from "prop-types";
import { userRequest } from "src/requestMethod";

const masterFieldConfigs = {
  Category: [{ name: "value", label: "Category Name" }],
  Product: [
    { name: "value", label: "Product Code" },
    { name: "label", label: "Product Name" },
  ],
  Reason: [{ name: "value", label: "Reason" }],
};

const AddModal = ({ open, handleClose, selectedTab, getData }) => {
  const [formData, setFormData] = React.useState({});

  const getKeyFromTab = () => {
    switch (selectedTab) {
      case 0:
        return "Category";
      case 1:
        return "Product";
      default:
        return "Reason";
    }
  };

  React.useEffect(() => {
    if (open) {
      const initialData = {};
      masterFieldConfigs[getKeyFromTab()].forEach((field) => {
        initialData[field.name] = "";
      });
      setFormData(initialData);
    }
  }, [open]);

  const handleChange = (e, name) => {
    setFormData({ ...formData, [name]: e.target.value });
  };

  const handleSave = async (formData) => {
    const key = getKeyFromTab();
    try {
      await userRequest.post("/admin/createMasters", {
        key: key === "Product" ? "Product Code" : key,
        ...formData,
      });
      swal("Success!", `${key} added successfully!`, "success");
      handleClose();
      getData();
    } catch (err) {
      console.error(err);
      swal("Error!", `Failed to add ${key}`, "error");
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    bgcolor: "background.paper",
    borderRadius: 5,
    p: 4,
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "24px", fontWeight: "bolder" }}>
            Add {getKeyFromTab()}
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

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
          noValidate
          autoComplete="off"
        >
          {masterFieldConfigs[getKeyFromTab()].map(
            ({ name, label, type = "text" }) => (
              <TextField
                key={name}
                label={label}
                type={type}
                value={formData[name] || ""}
                onChange={(e) => handleChange(e, name)}
                fullWidth
              />
            )
          )}

          <Button
            sx={{ marginTop: "20px", height: "50px" }}
            variant="contained"
            color="primary"
            onClick={() => handleSave(formData)}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

AddModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedTab: PropTypes.string.isRequired,
  getData: PropTypes.func.isRequired,
};

export default AddModal;
