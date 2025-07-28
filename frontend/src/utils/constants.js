export const ORDER_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  READY: "ready",
  COMPLETED: "completed",
};

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
};

export const PAYMENT_METHODS = {
  CASH: "cash",
  CARD: "card",
};

export const STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: "bg-error text-error-foreground",
  [ORDER_STATUS.IN_PROGRESS]: "bg-warning text-warning-foreground",
  [ORDER_STATUS.READY]: "bg-primary text-primary-foreground",
  [ORDER_STATUS.COMPLETED]: "bg-success text-success-foreground",
};

export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
};
