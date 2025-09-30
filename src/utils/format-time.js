import { format, getTime, formatDistanceToNow } from "date-fns";

export function fDate(date, newFormat) {
  const fm = newFormat || "dd MMM yyyy";

  return date ? format(new Date(date), fm) : "";
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || "dd MMM yyyy p";

  return date ? format(new Date(date), fm) : "";
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : "";
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : "";
}

export function fTime(date) {
  return date ? format(new Date(date), "hh:mm a") : "";
}

export function fExcelDate(excelSerialDate) {
  if (!excelSerialDate || typeof excelSerialDate !== 'number' || excelSerialDate < 1) {
    return null;
  }
  
  const excelEpoch = new Date(1899, 11, 30);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const date = new Date(excelEpoch.getTime() + excelSerialDate * millisecondsPerDay);
  
  return isNaN(date.getTime()) ? null : date;
}

export function fNormalizeDate(dateValue) {
  if (!dateValue) return '';
  
  if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }
  
  if (typeof dateValue === 'number') {
    const excelDate = fExcelDate(dateValue);
    return excelDate ? excelDate.toISOString().split('T')[0] : String(dateValue);
  }
  
  const date = new Date(dateValue);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }
  
  return String(dateValue);
}

export function fDateDisplay(dateValue) {
  if (!dateValue) return "";
  
  if (typeof dateValue === 'number') {
    const excelDate = fExcelDate(dateValue);
    return excelDate ? excelDate.toLocaleDateString("en-GB") : String(dateValue);
  }
  
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? String(dateValue) : date.toLocaleDateString("en-GB");
}