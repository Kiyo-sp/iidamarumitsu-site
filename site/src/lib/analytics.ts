export const GA4_MEASUREMENT_ID = "G-HC0PR2FYVD";

export const isValidGa4MeasurementId = (value: string) => /^G-[A-Z0-9]+$/.test(value);
