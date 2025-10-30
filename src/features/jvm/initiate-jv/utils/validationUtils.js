import { fNormalizeDate } from "src/utils/format-time";

export const validateSlNoEntryLimit = (data, maxEntries = 950) => {
  const slNoGroups = {};
  
  data.forEach(entry => {
    const slNo = entry.slNo?.toString().trim();
    if (slNo) {
      if (!slNoGroups[slNo]) {
        slNoGroups[slNo] = [];
      }
      slNoGroups[slNo].push(entry);
    }
  });

  const exceededGroups = [];
  Object.keys(slNoGroups).forEach(slNo => {
    const group = slNoGroups[slNo];
    if (group.length > maxEntries) {
      exceededGroups.push({
        slNo,
        count: group.length,
        limit: maxEntries
      });
    }
  });

  return exceededGroups;
};

export const validateSlNoBalance = (data) => {
  const slNoGroups = {};
  
  data.forEach(entry => {
    const slNo = entry.slNo?.toString().trim();
    if (slNo) {
      if (!slNoGroups[slNo]) {
        slNoGroups[slNo] = { debit: 0, credit: 0, entries: [] };
      }
      
      const amount = parseFloat(entry.amount) || 0;
      if (entry.type === 'Debit') {
        slNoGroups[slNo].debit += amount;
      } else if (entry.type === 'Credit') {
        slNoGroups[slNo].credit += amount;
      }
      slNoGroups[slNo].entries.push(entry);
    }
  });

  const unbalancedGroups = [];
  Object.keys(slNoGroups).forEach(slNo => {
    const group = slNoGroups[slNo];
    if (Math.abs(group.debit - group.credit) > 0.01) {
      unbalancedGroups.push({
        slNo,
        debit: group.debit,
        credit: group.credit,
        difference: Math.abs(group.debit - group.credit)
      });
    }
  });

  return unbalancedGroups;
};

export const validateSlNoDateConsistency = (data) => {
  const slNoGroups = {};
  
  data.forEach(entry => {
    const slNo = entry.slNo?.toString().trim();
    if (slNo) {
      if (!slNoGroups[slNo]) {
        slNoGroups[slNo] = [];
      }
      slNoGroups[slNo].push(entry);
    }
  });

  const inconsistentGroups = [];
  Object.keys(slNoGroups).forEach(slNo => {
    const group = slNoGroups[slNo];
    if (group.length > 1) {
      const firstEntry = group[0];
      const referenceDocumentDate = fNormalizeDate(firstEntry.documentDate);
      const referencePostingDate = fNormalizeDate(firstEntry.postingDate);
      
      const hasInconsistentDocumentDate = group.some(entry => 
        fNormalizeDate(entry.documentDate) !== referenceDocumentDate
      );
      const hasInconsistentPostingDate = group.some(entry => 
        fNormalizeDate(entry.postingDate) !== referencePostingDate
      );
      
      if (hasInconsistentDocumentDate || hasInconsistentPostingDate) {
        inconsistentGroups.push({
          slNo,
          documentDate: referenceDocumentDate,
          postingDate: referencePostingDate,
          inconsistentDocumentDate: hasInconsistentDocumentDate,
          inconsistentPostingDate: hasInconsistentPostingDate,
          entries: group.map(entry => ({
            id: entry._id,
            documentDate: fNormalizeDate(entry.documentDate),
            postingDate: fNormalizeDate(entry.postingDate),
            originalDocumentDate: entry.documentDate,
            originalPostingDate: entry.postingDate
          }))
        });
      }
    }
  });

  return inconsistentGroups;
};

const normalizeTransactionType = (type) => {
  if (!type) return null;
  const normalized = String(type).trim();
  if (
    normalized.toLowerCase() === "credit" ||
    normalized === "C" ||
    normalized === "c"
  ) {
    return "C";
  } else if (
    normalized.toLowerCase() === "debit" ||
    normalized === "D" ||
    normalized === "d"
  ) {
    return "D";
  }
  return null;
};

export const validatePostingKeyMatchesEntryType = (postingKey, entryType, postingKeyMasters) => {
  if (!postingKey || !entryType) {
    return {
      isValid: true,
      error: null
    };
  }

  const normalize = (v) => (v ?? "").toString().trim();
  const normalizedPostingKey = normalize(postingKey);
  
  const entryTransactionType = normalizeTransactionType(entryType);

  if (!entryTransactionType) {
    return {
      isValid: true,
      error: null
    };
  }

  const matchingMaster = postingKeyMasters.find(
    (m) => normalize(m.value) === normalizedPostingKey && m.label === entryTransactionType
  );

  if (!matchingMaster) {
    const existingTypesForThisKey = postingKeyMasters
      .filter(m => normalize(m.value) === normalizedPostingKey)
      .map(m => m.label)
      .filter(Boolean);

    if (existingTypesForThisKey.length === 0) {
      return {
        isValid: true,
        error: null
      };
    }

    const allowedTypesText = existingTypesForThisKey
      .map(t => t === 'C' ? 'Credit' : 'Debit')
      .join(' or ');
    const actualType = entryTransactionType === 'C' ? 'Credit' : 'Debit';
    
    return {
      isValid: false,
      error: `Posting Key '${postingKey}' is configured for ${allowedTypesText} transactions, but entry has '${actualType}' type`
    };
  }

  return {
    isValid: true,
    error: null
  };
};

export const validateAllJVEntries = (data, options = {}) => {
  const {
    maxEntries = 950,
    checkEntryLimit = true,
    checkBalance = true,
    checkDateConsistency = true
  } = options;

  const results = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (checkEntryLimit) {
    const exceededGroups = validateSlNoEntryLimit(data, maxEntries);
    if (exceededGroups.length > 0) {
      results.isValid = false;
      results.errors.push({
        type: 'entryLimit',
        message: 'Serial numbers exceed maximum entry limit',
        details: exceededGroups
      });
    }
  }

  if (checkBalance) {
    const unbalancedGroups = validateSlNoBalance(data);
    if (unbalancedGroups.length > 0) {
      results.isValid = false;
      results.errors.push({
        type: 'balance',
        message: 'Serial numbers have unbalanced debit and credit amounts',
        details: unbalancedGroups
      });
    }
  }

  if (checkDateConsistency) {
    const inconsistentDateGroups = validateSlNoDateConsistency(data);
    if (inconsistentDateGroups.length > 0) {
      results.isValid = false;
      results.errors.push({
        type: 'dateConsistency',
        message: 'Serial numbers have inconsistent Document and Posting dates',
        details: inconsistentDateGroups
      });
    }
  }

  return results;
};