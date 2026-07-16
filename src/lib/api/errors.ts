export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "VALIDATION_ERROR"
  | "INTERNAL_ERROR"
  | "NOT_IMPLEMENTED";

export type ApiErrorBody = {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
};

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly details?: unknown;

  constructor(
    code: ApiErrorCode,
    message: string,
    status: number,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }

  toJSON(): ApiErrorBody {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.details !== undefined ? { details: this.details } : {}),
      },
    };
  }
}

export function badRequest(message: string, details?: unknown): ApiError {
  return new ApiError("BAD_REQUEST", message, 400, details);
}

export function unauthorized(message = "Unauthorized"): ApiError {
  return new ApiError("UNAUTHORIZED", message, 401);
}

export function forbidden(message = "Forbidden"): ApiError {
  return new ApiError("FORBIDDEN", message, 403);
}

export function notFound(message = "Not found"): ApiError {
  return new ApiError("NOT_FOUND", message, 404);
}

export function notImplemented(message = "Not implemented"): ApiError {
  return new ApiError("NOT_IMPLEMENTED", message, 501);
}

export function rateLimited(message = "Too many requests"): ApiError {
  return new ApiError("RATE_LIMITED", message, 429);
}
