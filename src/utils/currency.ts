export const formatToCLP = (value: number): string => {
  const rounded = Math.round(value);
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(rounded);
};
