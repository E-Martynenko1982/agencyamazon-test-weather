export const formatTime = (dt: number): string => {
  if (isNaN(dt)) {
    return 'Invalid date';
  }
  try {
    const date = new Date(dt * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Error';
  }
};
