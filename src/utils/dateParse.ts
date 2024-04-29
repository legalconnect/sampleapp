// Format as a long date string (e.g., "Sunday, April 30, 2022")
export const longDateString = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
// Format as a short date string (e.g., "4/30/2022")
export const shortDateString = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

export const getTime = (dateString: string): string => {
  var date = new Date(dateString);
  var localeTimeString = `${date.toLocaleTimeString(undefined, {
    hour12: true, // Display time in 12-hour format
  })}`;

  // Split time string at colon (:)
const parts = localeTimeString.split(':');

// Extract hours and minutes
const hours = parts[0];
const minutes = parts[1];

// Get AM/PM indicator
const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

// Combine hours, minutes, and AM/PM
return hours + ':' + minutes + ' ' + ampm;
};
