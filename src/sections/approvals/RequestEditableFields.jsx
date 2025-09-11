import React, { useEffect, useState } from 'react';
import {
  IconButton,
  TextField,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { userRequest } from 'src/requestMethod';
import { toast } from 'react-toastify';
import CircularIndeterminate from 'src/utils/loader';
import { fDate } from 'src/utils/format-time';
import { format } from 'date-fns';

export default function RequestEditableFields({ getRequestData, data, id }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(data || {});
  const [originalData, setOriginalData] = useState(data || {});
  const [refundDate, setRefundDate] = useState(formData.refundDate || null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (data && !submitted) {
      setFormData(data);
      setOriginalData(data);
      setRefundDate(data.refundDate ? new Date(data.refundDate) : null);
    }
  }, [data, submitted]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData(originalData);
    setRefundDate(formData.refundDate || null);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const requiredFields = [
        'replacementOrderNo',
        // 'refundRemark',
        // 'rfmClearances',
        // 'refundSap',
        // 'utrNo',
        // 'refundDate',
      ];
      const missingFields = requiredFields.filter(
        (field) => !formData[field] || (field === 'refundDate' && !refundDate)
      );

      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }
      const formattedDate = refundDate ? format(new Date(refundDate), 'yyyy-MM-dd') : null;
      const updatedFormData = { ...formData, refundDate: formattedDate };

      const response = await userRequest.put(`/admin/updateFormOnClick?id=${id}`, updatedFormData);
      if (response) {
        toast.success('Record saved successfully!');
        setOriginalData(updatedFormData);
        setRefundDate(new Date(updatedFormData?.refundDate));
        setFormData(updatedFormData);
        getRequestData();
        setSubmitted(true);
      }
    } catch (error) {
      toast.error('Error saving record!');
    } finally {
      setLoading(false);
      setEditMode(false);
    }
  };

  return (
    <Box mt={3} sx={{ padding: '16px' }}>
      {loading ? (
        <CircularIndeterminate />
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: '12px' }}>Rep/Ret-Order No.</TableCell>
                <TableCell sx={{ fontSize: '12px' }}>Refund Remarks</TableCell>
                <TableCell sx={{ fontSize: '12px' }}>RFM Clearance</TableCell>
                <TableCell sx={{ fontSize: '12px' }}>Refund Sap Doc</TableCell>
                <TableCell sx={{ fontSize: '12px' }}>UTR No.</TableCell>
                <TableCell sx={{ fontSize: '12px' }}>Refund Date</TableCell>
                <TableCell sx={{ fontSize: '12px' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell style={{ minWidth: 110, fontSize: 12, textAlign: 'center' }}>
                  {editMode ? (
                    <TextField
                      value={formData.replacementOrderNo || ''}
                      onChange={(e) => handleChange('replacementOrderNo', e.target.value)}
                      size="small"
                      variant="outlined"
                      fullWidth
                      sx={{
                        '& .MuiInputBase-root': {
                          padding: '4px 12px',
                          fontSize: '12px',
                        },
                      }}
                    />
                  ) : (
                    <Box sx={{ padding: '8px', fontWeight: 500 }}>
                      {formData.replacementOrderNo || 'N/A'}
                    </Box>
                  )}
                </TableCell>

                <TableCell style={{ minWidth: 110, fontSize: 12, textAlign: 'center' }}>
                  {editMode ? (
                    <TextField
                      value={formData.refundRemark || ''}
                      onChange={(e) => handleChange('refundRemark', e.target.value)}
                      size="small"
                      variant="outlined"
                      fullWidth
                      sx={{
                        '& .MuiInputBase-root': {
                          padding: '4px 12px',
                          fontSize: '12px',
                        },
                      }}
                    />
                  ) : (
                    <Box sx={{ padding: '8px', fontWeight: 500 }}>
                      {formData.refundRemark || 'N/A'}
                    </Box>
                  )}
                </TableCell>

                <TableCell style={{ minWidth: 110, fontSize: 12, textAlign: 'center' }}>
                  {editMode ? (
                    <TextField
                      value={formData.rfmClearances || ''}
                      onChange={(e) => handleChange('rfmClearances', e.target.value)}
                      size="small"
                      variant="outlined"
                      fullWidth
                      sx={{
                        '& .MuiInputBase-root': {
                          padding: '4px 12px',
                          fontSize: '12px',
                        },
                      }}
                    />
                  ) : (
                    <Box sx={{ padding: '8px', fontWeight: 500 }}>
                      {formData.rfmClearances || 'N/A'}
                    </Box>
                  )}
                </TableCell>

                <TableCell style={{ minWidth: 110, fontSize: 12, textAlign: 'center' }}>
                  {editMode ? (
                    <TextField
                      value={formData.refundSap || ''}
                      onChange={(e) => handleChange('refundSap', e.target.value)}
                      size="small"
                      variant="outlined"
                      fullWidth
                      sx={{
                        '& .MuiInputBase-root': {
                          padding: '4px 12px',
                          fontSize: '12px',
                        },
                      }}
                    />
                  ) : (
                    <Box sx={{ padding: '8px', fontWeight: 500 }}>
                      {formData.refundSap || 'N/A'}
                    </Box>
                  )}
                </TableCell>

                <TableCell style={{ minWidth: 110, fontSize: 12, textAlign: 'center' }}>
                  {editMode ? (
                    <TextField
                      value={formData.utrNo || ''}
                      onChange={(e) => handleChange('utrNo', e.target.value)}
                      size="small"
                      variant="outlined"
                      fullWidth
                      sx={{
                        '& .MuiInputBase-root': {
                          padding: '4px 12px',
                          fontSize: '12px',
                        },
                      }}
                    />
                  ) : (
                    <Box sx={{ padding: '8px', fontWeight: 500 }}>{formData.utrNo || 'N/A'}</Box>
                  )}
                </TableCell>

                <TableCell style={{ minWidth: 110, fontSize: 12, textAlign: 'center' }}>
                  {editMode ? (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        value={refundDate}
                        onChange={(newValue) => {
                          setRefundDate(newValue);
                          handleChange('refundDate', newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            variant="outlined"
                            fullWidth
                            sx={{
                              '& .MuiInputBase-root': {
                                padding: '8px 12px',
                                fontSize: '12px',
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  ) : (
                    <Box sx={{ padding: '8px', fontWeight: 500 }}>
                      {formData.refundDate ? fDate(refundDate) : 'N/A'}
                    </Box>
                  )}
                </TableCell>

                <TableCell style={{ minWidth: 100 }}>
                  {!editMode ? (
                    <IconButton size="small" onClick={handleEdit}>
                      <EditIcon />
                    </IconButton>
                  ) : (
                    <>
                      <IconButton size="small" onClick={handleSubmit} color="success">
                        <CheckIcon />
                      </IconButton>
                      <IconButton size="small" onClick={handleCancel} color="error">
                        <CloseIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
