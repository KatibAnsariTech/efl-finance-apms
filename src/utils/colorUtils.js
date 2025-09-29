import { STATUS_COLORS, STATUS_LABELS, COLOR_GROUPS } from '../constants/colors';


export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || '#cccccc';
};


export const getStatusLabel = (status) => {
  return STATUS_LABELS[status] || status;
};


export const getColorGroup = (groupName) => {
  return COLOR_GROUPS[groupName] || { colors: [], labels: [] };
};


export const getGroupStatuses = (groupName) => {
  const group = getColorGroup(groupName);
  return group.colors || [];
};


export const getGroupLabels = (groupName) => {
  const group = getColorGroup(groupName);
  return group.labels || [];
};


export const isValidStatus = (status) => {
  return status in STATUS_COLORS;
};


export const getAllStatuses = () => {
  return Object.keys(STATUS_COLORS);
};


export const getAllGroupNames = () => {
  return Object.keys(COLOR_GROUPS);
};


export const createGroupColorMap = (groupName) => {
  const group = getColorGroup(groupName);
  const colorMap = {};
  
  group.colors.forEach((status) => {
    colorMap[status] = getStatusColor(status);
  });
  
  return colorMap;
};


export const createGroupLabelMap = (groupName) => {
  const group = getColorGroup(groupName);
  const labelMap = {};
  
  group.colors.forEach((status) => {
    labelMap[status] = getStatusLabel(status);
  });
  
  return labelMap;
};
