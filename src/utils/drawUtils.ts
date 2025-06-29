import type { Draw, DrawStatus, PrizeTier } from '../features/drawManagement/types/drawTypes';

/**
 * Calculates the total prize pool for a draw
 * @param prizes Array of prize tiers
 * @param ticketPrice Price per ticket
 * @param totalTickets Total tickets sold (optional for percentage calculations)
 * @returns Formatted total prize pool string
 */
export const calculateTotalPrizePool = (
  prizes: PrizeTier[],
  ticketPrice: number,
  totalTickets?: number
): string => {
  const total = prizes.reduce((sum, prize) => {
    if (prize.valueType === 'fixed') {
      return sum + prize.value;
    } else if (totalTickets) {
      // For percentage prizes, calculate based on ticket sales
      const percentageValue = (prize.value / 100) * (ticketPrice * totalTickets);
      return sum + percentageValue;
    }
    return sum;
  }, 0);

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(total);
};

/**
 * Determines if a draw can be edited based on its status
 * @param status Current draw status
 * @returns Boolean indicating if editable
 */
export const isDrawEditable = (status: DrawStatus): boolean => {
  return ['scheduled', 'open'].includes(status);
};

/**
 * Validates winning numbers based on draw type
 * @param numbers Array of numbers to validate
 * @param drawType Type of the draw
 * @returns Error message if invalid, null if valid
 */
export const validateWinningNumbers = (
  numbers: number[],
  drawType: string
): string | null => {
  if (!numbers || numbers.length === 0) {
    return 'At least one number is required';
  }

  const numCount = numbers.length;
  const hasDuplicates = new Set(numbers).size !== numCount;
  const hasInvalidNumbers = numbers.some(n => isNaN(n) || n <= 0);

  // Validate based on draw type
  switch (drawType) {
    case 'pick3':
      if (numCount !== 3) return 'Exactly 3 numbers required';
      break;
    case 'pick4':
      if (numCount !== 4) return 'Exactly 4 numbers required';
      break;
    case 'pick6':
      if (numCount !== 6) return 'Exactly 6 numbers required';
      break;
    default:
      if (numCount < 1) return 'At least one number required';
  }

  if (hasDuplicates) return 'Numbers must be unique';
  if (hasInvalidNumbers) return 'Numbers must be positive integers';

  return null;
};

/**
 * Formats draw status for display
 * @param status Raw status value
 * @returns Human-readable status text
 */
export const formatDrawStatus = (status: DrawStatus): string => {
  const statusMap: Record<DrawStatus, string> = {
    scheduled: 'Scheduled',
    open: 'Open for Tickets',
    closed: 'Sales Closed',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };
  return statusMap[status] || status;
};

/**
 * Groups draws by status for dashboard display
 * @param draws Array of draws
 * @returns Object with draws grouped by status
 */
export const groupDrawsByStatus = (draws: Draw[]) => {
  return draws.reduce((acc, draw) => {
    if (!acc[draw.status]) {
      acc[draw.status] = [];
    }
    acc[draw.status].push(draw);
    return acc;
  }, {} as Record<DrawStatus, Draw[]>);
};

/**
 * Filters draws based on admin permissions
 * @param draws Array of draws
 * @param userRole Current user's role
 * @returns Filtered array of draws
 */
export const filterDrawsByPermission = (draws: Draw[], userRole: string) => {
  return draws.filter(draw => {
    if (userRole === 'super-admin') return true;
    if (userRole === 'admin') return draw.status !== 'cancelled';
    return ['open', 'closed', 'completed'].includes(draw.status);
  });
};

/**
 * Generates audit log message for draw actions
 * @param actionType Type of action performed
 * @param drawName Name of the affected draw
 * @returns Formatted audit message
 */
export const generateAuditMessage = (actionType: string, drawName: string) => {
  const actionMessages: Record<string, string> = {
    create: `Created new draw "${drawName}"`,
    update: `Updated draw "${drawName}"`,
    cancel: `Cancelled draw "${drawName}"`,
    complete: `Marked draw "${drawName}" as completed`,
    delete: `Deleted draw "${drawName}"`
  };

  return actionMessages[actionType] || `Performed ${actionType} on draw "${drawName}"`;
};

/**
 * Sorts draws by date (most recent first)
 * @param draws Array of draws
 * @param sortDirection 'asc' or 'desc'
 * @returns Sorted array
 */
export const sortDrawsByDate = (draws: Draw[], sortDirection: 'asc' | 'desc' = 'desc') => {
  return [...draws].sort((a, b) => {
    const dateA = new Date(a.schedule.drawTime).getTime();
    const dateB = new Date(b.schedule.drawTime).getTime();
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Checks if a draw is currently active (open for tickets)
 * @param draw The draw object
 * @returns Boolean indicating active status
 */
export const isDrawActive = (draw: Draw) => {
  const now = new Date();
  const start = new Date(draw.schedule.startDate);
  const end = new Date(draw.schedule.endDate);
  return now >= start && now <= end && draw.status === 'open';
};

/**
 * Calculates time remaining until draw cutoff
 * @param draw The draw object
 * @returns Formatted time string or null
 */
export const getTimeUntilCutoff = (draw: Draw) => {
  if (!isDrawActive(draw)) return null;

  const now = new Date();
  const drawTime = new Date(draw.schedule.drawTime);
  const cutoffTime = new Date(drawTime.getTime() - draw.schedule.cutoffMinutes * 60000);

  if (now >= cutoffTime) return 'Sales closed';

  const diffMs = cutoffTime.getTime() - now.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m remaining`;
};