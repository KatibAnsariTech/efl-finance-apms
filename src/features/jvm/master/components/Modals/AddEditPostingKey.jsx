import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { Autocomplete } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { RxCross2 } from "react-icons/rx";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";
import { showErrorMessage } from "src/utils/errorUtils";

function AddEditPostingKey({
  handleClose,
  open,
  editData: postingKeyData,
  getData,
}) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();
  const [accountTypes, setAccountTypes] = useState([]);
  const [selectedAccountType, setSelectedAccountType] = useState(null);
  const [selectedTransactionType, setSelectedTransactionType] = useState(null);
  
  const transactionTypeOptions = [
    { id: 'C', label: 'C' },
    { id: 'D', label: 'D' }
  ];
  const fetchAccountTypes = async () => {
    try {
      const res = await userRequest.get(
        `/jvm/getMasters?key=AccountType&page=1&limit=1000`
      );
      if (res?.data?.success) {
        const list = res.data.data?.masters || [];
        setAccountTypes(list.map((m) => ({ id: m._id, label: m.value })));
      }
    } catch (error) {
      console.error("Error fetching Account Types:", error);
      showErrorMessage(error, "Error fetching Account Types", swal);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAccountTypes();
    }
  }, [open]);

  useEffect(() => {
    if (postingKeyData) {
      setValue("postingKey", postingKeyData.postingKey);
      let savedId = "";
      if (Array.isArray(postingKeyData.other) && postingKeyData.other[0]) {
        const first = postingKeyData.other[0];
        savedId = typeof first === "object" ? first._id || "" : first;
      }
      setValue("accountTypeId", savedId);
      if (savedId && accountTypes.length > 0) {
        const match = accountTypes.find((a) => a.id === savedId) || null;
        setSelectedAccountType(match);
      }
      
      const transactionType = postingKeyData.label;
      setValue("transactionType", transactionType || "");
      if (transactionType) {
        const match = transactionTypeOptions.find((t) => t.id === transactionType) || null;
        setSelectedTransactionType(match);
      }
    } else {
      reset();
      setSelectedAccountType(null);
      setSelectedTransactionType(null);
      setValue("accountTypeId", "");
      setValue("transactionType", "");
    }
  }, [postingKeyData, setValue, reset, accountTypes]);

  const handleSaveData = async (data) => {
    setLoading(true);
    try {
      const formattedData = {
        key: "PostingKey",
        value: data.postingKey,
        other: data.accountTypeId ? [data.accountTypeId] : [],
        label: data.transactionType || "",
      };
      if (postingKeyData?._id) {
        await userRequest.put(
          `/jvm/updateMaster/${postingKeyData._id}`,
          formattedData
        );
        getData();
        swal("Updated!", "Posting Key data updated successfully!", "success");
      } else {
        await userRequest.post("/jvm/createMasters", formattedData);
        getData();
        swal("Success!", "Posting Key data saved successfully!", "success");
      }

      reset();
      handleClose();
    } catch (error) {
      console.error("Error saving data:", error);
      showErrorMessage(
        error,
        "Error saving data. Please try again later.",
        swal
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          bgcolor: "background.paper",
          borderRadius: 5,
          p: 4,
        }}
      >
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "24px", fontWeight: "bolder" }}>
            {postingKeyData ? "Edit Posting Key" : "Add Posting Key"}
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
            mt: 4,
            width: "100%",
          }}
          onSubmit={handleSubmit(handleSaveData)}
        >
          <TextField
            id="postingKey"
            label="Posting Key"
            {...register("postingKey", { required: true })}
            fullWidth
            required
            disabled={loading}
            placeholder="e.g., 40, 50, 60"
          />
          <input type="hidden" {...register("accountTypeId")} />
          <Autocomplete
            options={accountTypes}
            getOptionLabel={(option) => option?.label || ""}
            value={selectedAccountType}
            onChange={(_, newValue) => {
              setSelectedAccountType(newValue);
              setValue("accountTypeId", newValue?.id || "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Account Type"
                placeholder="Select Account Type"
                fullWidth
                disabled={loading}
              />
            )}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            disabled={loading}
          />
          <input type="hidden" {...register("transactionType")} />
          <Autocomplete
            options={transactionTypeOptions}
            getOptionLabel={(option) => option?.label || ""}
            value={selectedTransactionType}
            onChange={(_, newValue) => {
              setSelectedTransactionType(newValue);
              setValue("transactionType", newValue?.id || "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Transaction Type"
                placeholder="Select Transaction Type"
                fullWidth
                disabled={loading}
                required
              />
            )}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            disabled={loading}
          />
          <Button
            sx={{ marginTop: "20px", height: "50px" }}
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            startIcon={
              loading && <CircularProgress size={20} color="inherit" />
            }
          >
            {loading
              ? postingKeyData
                ? "Updating..."
                : "Saving..."
              : postingKeyData
              ? "Update"
              : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddEditPostingKey;
