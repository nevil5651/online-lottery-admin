// Currency formatter
export const formatCurrency = (
  amount: number, 
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Date formatter
export const formatDateTime = (
  dateString: string, 
  locale: string = 'en-US'
): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

// Status formatter with colors
export const formatStatus = (status: string): { text: string, color: string } => {
  switch (status) {
    case 'PENDING':
      return { text: 'Pending', color: '#ff9800' };
    case 'COMPLETED':
      return { text: 'Completed', color: '#4caf50' };
    case 'FAILED':
      return { text: 'Failed', color: '#f44336' };
    case 'REVERSED':
      return { text: 'Reversed', color: '#9e9e9e' };
    default:
      return { text: status, color: '#000000' };
  }
};