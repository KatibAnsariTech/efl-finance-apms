import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Autocomplete, CircularProgress } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";
import { showErrorMessage } from "src/utils/errorUtils";

function AddEditApproverPosition({ handleClose, open, editData: positionData, getData }) {
  const { register, handleSubmit, reset, setValue, control } = useForm();
  const [loading, setLoading] = useState(false);
  const [majorPositions, setMajorPositions] = useState([]);
  const [positionsLoading, setPositionsLoading] = useState(false);

  // Fetch major positions
  useEffect(() => {
    const fetchMajorPositions = async () => {
      setPositionsLoading(true);
      try {
        const response = await userRequest.get("cpx/getMajorPositions", {
          params: {
            page: 1,
            limit: 100,
          },
        });

        const positions = response.data.data?.items || response.data.data || [];
        setMajorPositions(positions);
      } catch (error) {
        console.error("Error fetching Major Positions:", error);
        showErrorMessage(error, "Error fetching Major Positions", swal);
        setMajorPositions([]);
      } finally {
        setPositionsLoading(false);
      }
    };

    if (open) {
      fetchMajorPositions();
    }
  }, [open]);

  useEffect(() => {
    if (positionData && majorPositions.length > 0 && !positionsLoading) {
      setValue("ranking", positionData.ranking || "");
      // Handle majorPosition - it can be an object with _id and name, or just an _id
      if (positionData.majorPosition) {
        if (typeof positionData.majorPosition === 'object' && positionData.majorPosition._id) {
          // It's already an object, find the matching position
          const foundPosition = majorPositions.find(
            (pos) => pos._id === positionData.majorPosition._id
          );
          setValue("majorPosition", foundPosition || null);
        } else if (typeof positionData.majorPosition === 'string') {
          // It's an ID string, find the matching position
          const foundPosition = majorPositions.find(
            (pos) => pos._id === positionData.majorPosition || pos.name === positionData.majorPosition
          );
          setValue("majorPosition", foundPosition || null);
        }
      } else {
        setValue("majorPosition", null);
      }
    } else if (!positionData) {
      reset();
    }
  }, [positionData, majorPositions, positionsLoading, setValue, reset]);

  const handleSaveData = async (data) => {
    setLoading(true);
    try {
      // Get the major position _id from the selected object
      const formattedData = {
        ranking: data.ranking,
        majorPosition: data.majorPosition?._id || data.majorPosition || "",
      };
      
      if (positionData?._id) {
        await userRequest.put(`cpx/updateApproverPosition/${positionData._id}`, formattedData);
        swal("Updated!", "Approver Position data updated successfully!", "success");
      } else {
        await userRequest.post("cpx/createApproverPosition", formattedData);
        swal("Success!", "Approver Position data saved successfully!", "success");
      }

      reset();
      handleClose();
      getData();
    } catch (error) {
      console.error("Error saving data:", error);
      showErrorMessage(error, "Error saving data. Please try again later.", swal);
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
            {positionData ? "Edit Approver Position" : "Add Approver Position"}
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
            id="ranking"
            label="Ranking"
            {...register("ranking", { required: true })}
            fullWidth
            required
          />
          <Controller
            name="majorPosition"
            control={control}
            rules={{ required: "Major Position is required" }}
            render={({ field: { onChange, value, ...field } }) => (
              <Autocomplete
                {...field}
                options={majorPositions}
                getOptionLabel={(option) => option?.name || ""}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                value={value || null}
                onChange={(event, newValue) => {
                  onChange(newValue);
                }}
                loading={positionsLoading}
                disabled={loading || positionsLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Major Position"
                    required
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {positionsLoading ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            )}
          />
          <Button
            sx={{ marginTop: "20px", height: "50px" }}
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading || positionsLoading}
          >
            {loading ? "Saving..." : positionData ? "Update" : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddEditApproverPosition;

