export function successResponse(data, message = 'Success') {
  return {
    status: 'success',
    message,
    data,
  };
}

export function errorResponse(error, message = 'Error', code = 400) {
  return {
    status: 'error',
    message,
    error,
    code,
  };
} 