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
