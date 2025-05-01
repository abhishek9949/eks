export default function dateFormat(dateInput: Date | string): string {
  // Ensure the input is converted to a Date object if it's a string
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

  if (isNaN(date.getTime())) {
    throw new TypeError("Invalid date input");
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}
