import { STATUS_COLORS, STATUS_LABELS, COLOR_GROUPS } from '../constants/colors';

// Utility functions for color management

/**
 * Get color value by status key
 * @param {string} status - Status key
 * @returns {string} Color value or default gray
 */
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || '#cccccc';
};

/**
 * Get human-readable label by status key
 * @param {string} status - Status key
 * @returns {string} Label or the key itself
 */
export const getStatusLabel = (status) => {
  return STATUS_LABELS[status] || status;
};

/**
 * Get color group by name
 * @param {string} groupName - Group name (approval, hierarchy, customDuty, alerts)
 * @returns {object} Color group with colors and labels arrays
 */
export const getColorGroup = (groupName) => {
  return COLOR_GROUPS[groupName] || { colors: [], labels: [] };
};

/**
 * Get all statuses for a specific group
 * @param {string} groupName - Group name
 * @returns {array} Array of status keys
 */
export const getGroupStatuses = (groupName) => {
  const group = getColorGroup(groupName);
  return group.colors || [];
};

/**
 * Get all labels for a specific group
 * @param {string} groupName - Group name
 * @returns {array} Array of labels
 */
export const getGroupLabels = (groupName) => {
  const group = getColorGroup(groupName);
  return group.labels || [];
};

/**
 * Check if a status exists in the color constants
 * @param {string} status - Status key
 * @returns {boolean} True if status exists
 */
export const isValidStatus = (status) => {
  return status in STATUS_COLORS;
};

/**
 * Get all available status keys
 * @returns {array} Array of all status keys
 */
export const getAllStatuses = () => {
  return Object.keys(STATUS_COLORS);
};

/**
 * Get all available group names
 * @returns {array} Array of all group names
 */
export const getAllGroupNames = () => {
  return Object.keys(COLOR_GROUPS);
};

/**
 * Create a status-to-color mapping for a specific group
 * @param {string} groupName - Group name
 * @returns {object} Object with status keys and their colors
 */
export const createGroupColorMap = (groupName) => {
  const group = getColorGroup(groupName);
  const colorMap = {};
  
  group.colors.forEach((status) => {
    colorMap[status] = getStatusColor(status);
  });
  
  return colorMap;
};

/**
 * Create a status-to-label mapping for a specific group
 * @param {string} groupName - Group name
 * @returns {object} Object with status keys and their labels
 */
export const createGroupLabelMap = (groupName) => {
  const group = getColorGroup(groupName);
  const labelMap = {};
  
  group.colors.forEach((status) => {
    labelMap[status] = getStatusLabel(status);
  });
  
  return labelMap;
};
