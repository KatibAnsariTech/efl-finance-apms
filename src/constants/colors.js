import { colors } from "@mui/material";

  export const STATUS_COLORS = {
  // Approval Status Colors
  approved: '#baf5c2',
  pending: '#f4f5ba', 
  clarificationNeeded: '#9be7fa',
  declined: '#e6b2aa',
  rejected: '#e6b2aa', // Alias for declined
  
  // Hierarchy Status Colors
  notAssigned: 'white',
  acknowledge: '#DFEDFF',
  assigned: '#FFF4D3',
  complete: '#EAFFEF',
  
  // Alert Status Colors
  success: '#22c55e',
  warning: '#f59e42',
  fail: '#ef4444',
  error: '#ef4444', // Alias for fail
  
  // Custom Duty Status Colors
  customDutyPending: '#f4f5ba',
  customDutyApproved: '#baf5c2',
  customDutyRejected: '#e6b2aa',

   // Import Payment Status Colors
  importPaymentInProcess: '#f4f5ba',
  importPaymentApproved: '#baf5c2',
  importPaymentRejected: '#e6b2aa',
  
  // Auto Reversal Status Colors
  active: '#bbdefb',
  completed: '#baf5c2',
};

// Status Labels - Human readable labels for each status
export const STATUS_LABELS = {
  // Approval Status Labels
  approved: 'Approved',
  pending: 'Pending',
  clarificationNeeded: 'Clarification Needed',
  declined: 'Declined',
  rejected: 'Rejected',
  
  // Hierarchy Status Labels
  notAssigned: 'Not assigned',
  acknowledge: 'Acknowledge',
  assigned: 'Assigned',
  complete: 'Complete',
  
  // Alert Status Labels
  success: 'Success',
  warning: 'Warning',
  fail: 'Failed',
  error: 'Error',
  
  // Custom Duty Status Labels
  customDutyPending: 'Pending',
  customDutyApproved: 'Approved',
  customDutyRejected: 'Rejected',

  // Import Payment Status Labels
  importPaymentInProcess: 'InProcess',
  importPaymentApproved: 'Approved',
  importPaymentRejected: 'Rejected',

  
  // Auto Reversal Status Labels
  active: 'Active',
  completed: 'Completed',
};

// Color Groups - Organized by feature/context
export const COLOR_GROUPS = {
  approval: {
    colors: ['approved', 'pending', 'clarificationNeeded', 'declined'],
    labels: ['Approved', 'Pending', 'Clarification Needed', 'Declined']
  },
  hierarchy: {
    colors: ['notAssigned', 'acknowledge', 'assigned', 'complete'],
    labels: ['Not assigned', 'Acknowledge', 'Assigned', 'Complete']
  },
  customDuty: {
    colors: ['customDutyPending', 'customDutyApproved', 'customDutyRejected'],
    labels: ['Pending', 'Approved', 'Rejected']
  },
  importPayment: {
    colors: ['importPaymentInProcess', 'importPaymentApproved', 'importPaymentRejected'],
    labels: ['InProcess', 'Approved', 'Rejected']
  },
  alerts: {
    colors: ['success', 'warning', 'fail'],
    labels: ['Success', 'Warning', 'Failed']
  }
};

// Utility function to get color by status key
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || '#cccccc'; // Default gray for unknown status
};

// Utility function to get label by status key
export const getStatusLabel = (status) => {
  return STATUS_LABELS[status] || status; // Return the key itself if no label found
};

// Utility function to get color group
export const getColorGroup = (groupName) => {
  return COLOR_GROUPS[groupName] || { colors: [], labels: [] };
};
