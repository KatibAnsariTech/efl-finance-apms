export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator(a, b, orderBy) {
  if (a[orderBy] === null) {
    return 1;
  }
  if (b[orderBy] === null) {
    return -1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applyFilter({ inputData = [], comparator, filterName }) {
  const stabilizedThis = inputData && inputData.map((el, index) => [el, index]);
  if (stabilizedThis.length > 0) {
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    inputData = stabilizedThis.map((el) => el[0]);
  }



  if (filterName) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}


export const getPasswordStrength = (password) => {
  if (!password) return { text: "", color: "" };

  let score = 0;

  // Length-based scoring
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (password.length >= 10) score++;

  // Character diversity scoring
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++; // special characters

  // Decide strength based on score
  if (score <= 2) return { text: "Weak", color: "#f44336" };
  if (score <= 4) return { text: "Fair", color: "#ff9800" };
  if (score <= 6) return { text: "Good", color: "#4caf50" };
  return { text: "Strong", color: "#2e7d32" };
};
