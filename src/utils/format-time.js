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

export const parseDate = (dateInput) => {
  if (!dateInput) return "";
  
  if (dateInput instanceof Date) {
    return isNaN(dateInput.getTime()) ? "" : dateInput.toISOString().split('T')[0];
  }
  
  const dateStr = String(dateInput).trim();
  if (!dateStr) return "";
  const formats = [
    /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/,
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
    /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/,
    /^(\d{1,2})\.(\d{1,2})\.(\d{2})$/,
  ];
  
  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      let day, month, year;
      
      if (format.source.includes('(\\d{4})')) {
        if (format.source.includes('^(\\d{4})')) {
          [, year, month, day] = match;
        } else {
          [, day, month, year] = match;
        }
      } else {
        [, day, month, year] = match;
        const currentYear = new Date().getFullYear();
        const century = Math.floor(currentYear / 100) * 100;
        const twoDigitYear = parseInt(year);
        year = century + twoDigitYear;
      }
      
      const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
      
      if (
        date.getUTCFullYear() == year &&
        date.getUTCMonth() == month - 1 &&
        date.getUTCDate() == day
      ) {
        const yearStr = String(year).padStart(4, '0');
        const monthStr = String(month).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        return `${yearStr}-${monthStr}-${dayStr}`;
      }
    }
  }
  
  const nativeDate = new Date(dateStr);
  if (!isNaN(nativeDate.getTime())) {
    const year = nativeDate.getUTCFullYear();
    const month = String(nativeDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(nativeDate.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  return "";
};

export const formatDate = (dateInput, format = 'dd.mm.yyyy') => {
  if (!dateInput) return "";
  
  let date;
  if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    const isoDate = parseDate(dateInput);
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split('-').map(Number);
    date = new Date(Date.UTC(year, month - 1, day));
  }
  
  if (isNaN(date.getTime())) return "";
  
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  switch (format.toLowerCase()) {
    case 'dd.mm.yyyy':
      return `${day}.${month}.${year}`;
    case 'dd/mm/yyyy':
      return `${day}/${month}/${year}`;
    case 'dd-mm-yyyy':
      return `${day}-${month}-${year}`;
    case 'dd mmm yyyy':
      return `${day} ${monthNames[parseInt(month) - 1]} ${year}`;
    case 'iso':
      return date.toISOString().split('T')[0];
    default:
      return `${day}.${month}.${year}`;
  }
};

export const isValidDate = (dateStr) => {
  return parseDate(dateStr) !== "";
};

export const getCurrentDateISO = () => {
  return new Date().toISOString().split('T')[0];
};

export const parseExcelDate = (excelDate) => {
  if (typeof excelDate !== 'number') return "";
  
  const excelEpoch = new Date(Date.UTC(1900, 0, 1));
  const date = new Date(excelEpoch.getTime() + (excelDate - 2) * 24 * 60 * 60 * 1000);
  
  if (isNaN(date.getTime())) return "";
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};