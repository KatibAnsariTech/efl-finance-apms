import React from "react";
import {
    Grid,
    Typography,
    Button,
    Divider,
    CircularProgress,
} from "@mui/material";
import { Controller } from "react-hook-form";
import CustomTextField from "../CustomFields/CustomTextField";
import CustomSelect from "../CustomFields/CustomSelect";

export default function AdhocAdvanceSection({
    control,
    errors,
    onSubmit,
    onSaveDraft,
    loading,
}) {
    return (
        <>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Initiate ADHOC Advance
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <Controller
                        name="initiator"
                        control={control}
                        render={({ field }) => (
                            <CustomTextField {...field} label="Initiator" disabled />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <Controller
                        name="creationDate"
                        control={control}
                        render={({ field }) => (
                            <CustomTextField {...field} label="Creation Date" disabled />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <Controller
                        name="businessArea"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect {...field} label="Business Area" required />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <Controller
                        name="eflLocation"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect {...field} label="EFL Location Name" required />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <Controller
                        name="paidToName"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect {...field} label="Paid To Name" required />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <Controller
                        name="employeeVendorCode"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect {...field} label="Employee / Vendor Code" />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <Controller
                        name="profitCenter"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect {...field} label="Profit Center" required />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <Controller
                        name="costCenter"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect {...field} label="Cost Center" required />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <Controller
                        name="region"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect {...field} label="Region" required />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <Controller
                        name="inrValue"
                        control={control}
                        render={({ field }) => (
                            <CustomTextField {...field} label="INR Value" required />
                        )}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Controller
                        name="reasonForAdvance"
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                label="Reason for ADHOC Advance"
                                multiline
                                rows={3}
                                required
                            />
                        )}
                    />
                </Grid>
            </Grid>

            {/* ACTION BUTTONS – ADDED ONLY */}
            <Divider sx={{ my: 3 }} />

            <Grid container justifyContent="flex-end" spacing={2}>
                <Grid item>
                    <Button variant="outlined" onClick={onSaveDraft}>
                        Save Draft
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        onClick={onSubmit}
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={18} />}
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </>
    );
}
