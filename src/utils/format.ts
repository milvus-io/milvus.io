import { ELLIPSIS, ELLIPSIS_2 } from '@/consts/blog';

// Converts a number to a string with commas separating groups of three digits.
export const convertNumToString = (params: {
  amount: number;
  scale?: number;
  decimal?: number;
  showZeroDecimal?: boolean;
}): string => {
  const { amount, scale, decimal = 0, showZeroDecimal = false } = params;
  const decimalCoefficient = Math.pow(10, decimal);
  const scaleNum = scale || 1;
  const scaledNum =
    Math.round((amount / scaleNum) * decimalCoefficient) / decimalCoefficient;
  const formattedNumber = new Intl.NumberFormat(
    'en-US',
    showZeroDecimal
      ? {
          minimumFractionDigits: decimal,
          maximumFractionDigits: decimal,
        }
      : {}
  ).format(scaledNum);
  return formattedNumber;
};

// Converts a string containing digits to a number.
export const convertStringToNum = (value: string, scale?: number): number => {
  const scaleNum = scale || 1;
  return Number(value.replace(/[^0-9.-]+/g, '')) * scaleNum;
};

export const generatePaginationNavigators = (
  currentPage: number,
  totalPages: number
) => {
  if (totalPages <= 4) {
    // [1,2,3,4]
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 2) {
    // [1,2,3,...,5]
    return [1, 2, 3, ELLIPSIS, totalPages];
  }
  if (currentPage <= 3) {
    // [1,2,3,...,5];
    return [1, 2, 3, 4, ELLIPSIS, totalPages];
  }

  if (currentPage === totalPages - 2) {
    // [1,...,4,5,6,7]
    return [
      1,
      ELLIPSIS,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  if (currentPage > totalPages - 2) {
    // [1,...,3,4,5]
    return [1, ELLIPSIS, totalPages - 2, totalPages - 1, totalPages];
  }
  // [1,...,3,4,5,...,7]
  return [
    1,
    ELLIPSIS,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    ELLIPSIS_2,
    totalPages,
  ];
};
