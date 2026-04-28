// enums/query.enum.js

// Pagination defaults
export const QUERY_DEFAULTS = Object.freeze({
  PAGE: 1,
  LIMIT: 50,
  MAX_LIMIT: 1000,
});

// Order directions
export const ORDER_DIR = Object.freeze({
  ASC: 'ASC',
  DESC: 'DESC',
});

// Strict identifier regex (table/column names)
export const IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;

// Preferred default order columns (priority)
export const DEFAULT_ORDER_CANDIDATES = Object.freeze([
  'updated_at', 'created_at',
  'updatedAt', 'createdAt',
  'id',
]);
