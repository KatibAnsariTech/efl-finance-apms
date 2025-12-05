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
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);

  // Fetch major positions and departments
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
        console.error("Error fetching Positions:", error);
        showErrorMessage(error, "Error fetching Positions", swal);
        setMajorPositions([]);
      } finally {
        setPositionsLoading(false);
      }
    };

    const fetchDepartments = async () => {
      setDepartmentsLoading(true);
      try {
        const response = await userRequest.get("cpx/getDepartments", {
          params: {
            page: 1,
            limit: 100,
          },
        });

        const depts = response.data.data?.items || response.data.data || [];
        setDepartments(depts);
      } catch (error) {
        console.error("Error fetching Departments:", error);
        showErrorMessage(error, "Error fetching Departments", swal);
        setDepartments([]);
      } finally {
        setDepartmentsLoading(false);
      }
    };

    if (open) {
      fetchMajorPositions();
      fetchDepartments();
    }
  }, [open]);

  useEffect(() => {
    if (positionData && majorPositions.length > 0 && departments.length > 0 && !positionsLoading && !departmentsLoading) {
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
      // Handle department - it can be an object with _id and name, or just an _id
      if (positionData.department) {
        if (typeof positionData.department === 'object' && positionData.department._id) {
          // It's already an object, find the matching department
          const foundDepartment = departments.find(
            (dept) => dept._id === positionData.department._id
          );
          setValue("department", foundDepartment || null);
        } else if (typeof positionData.department === 'string') {
          // It's an ID string, find the matching department
          const foundDepartment = departments.find(
            (dept) => dept._id === positionData.department || dept.name === positionData.department
          );
          setValue("department", foundDepartment || null);
        }
      } else {
        setValue("department", null);
      }
    } else if (!positionData) {
      reset();
    }
  }, [positionData, majorPositions, departments, positionsLoading, departmentsLoading, setValue, reset]);

  const handleSaveData = async (data) => {
    setLoading(true);
    try {
      // Get the major position and department _id from the selected objects
      const formattedData = {
        ranking: data.ranking,
        majorPosition: data.majorPosition?._id || data.majorPosition || "",
        department: data.department?._id || data.department || "",
      };
      
      if (positionData?._id) {
        await userRequest.put(`cpx/updateApproverPosition/${positionData._id}`, formattedData);
        swal("Updated!", "Position Ranking data updated successfully!", "success");
      } else {
        await userRequest.post("cpx/createApproverPosition", formattedData);
        swal("Success!", "Position Ranking data saved successfully!", "success");
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
            {positionData ? "Edit Position Ranking" : "Add Position Ranking"}
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
            rules={{ required: "Position is required" }}
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
                    label="Position"
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
          <Controller
            name="department"
            control={control}
            rules={{ required: "Department is required" }}
            render={({ field: { onChange, value, ...field } }) => (
              <Autocomplete
                {...field}
                options={departments}
                getOptionLabel={(option) => option?.name || ""}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                value={value || null}
                onChange={(event, newValue) => {
                  onChange(newValue);
                }}
                loading={departmentsLoading}
                disabled={loading || departmentsLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Department"
                    required
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {departmentsLoading ? <CircularProgress size={20} /> : null}
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

