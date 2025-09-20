import { Box, CircularProgress } from "@mui/material";
import React, { lazy, useState, useCallback, useEffect } from "react";
import { useCounts } from "src/contexts/CountsContext";
import { useForm, FormProvider } from "react-hook-form";
import { useParams } from "react-router-dom";
import { userRequest } from "src/requestMethod";
import AlertDialog from "src/components/AlertDialog";
import { toast } from "react-toastify";
import { useRouter } from "src/routes/hooks";
import CustomerOrderDetails from "./CustomerOderDetails/CustomerOrderDetails";


const FormDetails = lazy(() =>
  import("./FormDetails")
);
const CurrentStatus = lazy(() =>
  import("./CurrentStatus")
);
const ApprovalForm = lazy(() =>
  import("./ApprovalForm")
);

function FormDetailsView() {
  const { refreshCounts } = useCounts();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState("");
  const [alert, setAlert] = useState({
    open: false,
    status: "success",
    message: "",
  });
  const [hideActions, setHideActions] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  const methods = useForm({
    defaultValues: { comment: "" },
    mode: "onChange",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const getFormData = async () => {
    try {
      setLoading(true);
      const res = await userRequest.get(`/admin/getFormById?id=${id}`);
      setData(res?.data?.data || null);
    } catch (err) {
      console.error("Error fetching form data:", err);
      toast.error("Failed to fetch data");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFormData();
  }, [id]);

  const handleTaskAction = useCallback(
    async ({ actionType, comment }) => {
      if (!data || !data.slNo) return;
      setButtonLoading(actionType);
      try {
        await userRequest.post("/admin/acceptForm", {
          id: data.slNo,
          status:
            actionType === "approved"
              ? "Approved"
              : actionType === "declined"
              ? "Declined"
              : actionType === "moreInfo"
              ? "More Info"
              : actionType === "submitResponse"
              ? "Submit Response"
              : actionType,
          comment: comment || "",
        });
        if (actionType === "approved") {
          setHideActions(true);
        }
        if (refreshCounts) await refreshCounts();
        setAlert({
          open: true,
          status: "success",
          message: "Action completed successfully!",
        });
        reset();
        getFormData();
        // setTimeout(() => {
        //   router.push("/approvals");
        // }, 4000);
      } catch (err) {
        console.log("error", err);
        console.log("error", err.response.data.message);
        setAlert({
          open: true,
          status: "fail",
          message: err?.response?.data?.message,
        });
      } finally {
        setButtonLoading("");
      }
    },
    [data, reset, refreshCounts]
  );

  return (
    <Box sx={{ px: 2 }}>
      {loading ? (
        <CircularProgress sx={{ display: "block", mx: "auto", mt: 25 }} />
      ) : (
        <>
          <CustomerOrderDetails data={data}/>
          <CurrentStatus steps={data?.steps || []} data={data}/>
          {data?.isUserAssigned && !hideActions && (
            <FormProvider {...methods}>
              <ApprovalForm
                data={data}
                register={register}
                errors={errors}
                handleTaskAction={({ actionType }) =>
                  handleTaskAction({
                    actionType,
                    comment: methods.getValues("comment"),
                  })
                }
                buttonLoading={buttonLoading}
              />
            </FormProvider>
          )}
          <AlertDialog
            open={alert.open}
            status={alert.status}
            message={alert.message}
            onClose={() => setAlert({ ...alert, open: false })}
          />
        </>
      )}
    </Box>
  );
}

export default FormDetailsView;
