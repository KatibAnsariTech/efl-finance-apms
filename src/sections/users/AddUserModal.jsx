import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { RxCross2 } from "react-icons/rx";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";
import UploadFile from "src/components/UploadFile";

function AddUserModal({ handleClose, open, getData, selectedTab }) {
  const [username, setusername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [profileImg, setProfileImg] = React.useState("");

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

  const handleFileUpload = (fileUrl) => {
    setProfileImg(fileUrl);
  };

  const handleSaveData = async () => {
    try {
      const userData = {
        username,
        email,
        userType: selectedTab === 0 ? "SUPER_ADMIN" : "ADMIN",
        // password,
        // profileImg,
      };
      await userRequest.post(`/admin/createAdmin`, userData);

      swal("Success!", "User data saved successfully!", "success");

      setusername("");
      setEmail("");
      // setPassword('');
      // setProfileImg('');
      handleClose();
      getData(); // Refresh the data after saving
    } catch (error) {
      console.error("Error saving data:", error);
      // swal("Error", "Error saving data. Please try again later.", "error");
      swal(
        "Error",
        error?.response?.data?.message ||
          error?.response?.data?.errors ||
          "Error saving data. Please try again later.",
        "error"
      );
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "24px", fontWeight: "bolder" }}>
              User Details
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
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 2,
              width: "100%",
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="user-name"
              label="User Name"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              fullWidth
            />
            <TextField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            {/* <TextField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            /> */}
            {/* <Button
              variant="contained"
              component="label"
              sx={{ width: '30%' }}
            >
              Upload Profile Image
              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {profileImg && (
              <img
                src={profileImg}
                alt="Profile Preview"
                style={{ marginTop: '10px', width: '100px', height: '100px', borderRadius: '50%' }}
              />
            )} */}

            {/* <UploadFile onFileUpload={handleFileUpload}/> */}
            <Button
              sx={{ marginTop: "20px", height: "50px" }}
              variant="contained"
              color="primary"
              onClick={handleSaveData}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default AddUserModal;
