import { NextResponse } from "next/server";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";
import { API_VERSION, API_VERSION_HEADER } from "@/lib/api/constants";
import { ApiError } from "@/lib/api/errors";
import { logger } from "@/lib/logger";
import {
  resolveApiContext,
  type ApiContext,
} from "@/lib/api/middleware";

type RouteContext = {
  params?: Promise<Record<string, string>>;
};

type HandlerFn<TBody, TResponse> = (
  ctx: ApiContext,
  body: TBody,
  routeContext: RouteContext,
) => Promise<TResponse>;

type ApiHandlerOptions<TBody, TResponse> = {
  schema?: ZodSchema<TBody>;
  handler: HandlerFn<TBody, TResponse>;
  responseSchema?: ZodSchema<TResponse>;
  status?: number;
};

function validationError(error: ZodError) {
  return new ApiError("VALIDATION_ERROR", "Invalid request", 400, error.flatten());
}

export function apiHandler<TBody = undefined, TResponse = unknown>(
  options: ApiHandlerOptions<TBody, TResponse>,
) {
  const { schema, handler, responseSchema, status = 200 } = options;

  return async (
    request: Request,
    routeContext: RouteContext,
  ): Promise<NextResponse> => {
    try {
      const ctx = await resolveApiContext();

      let body = undefined as TBody;
      if (schema && request.method !== "GET" && request.method !== "DELETE") {
        let json: unknown;
        try {
          json = await request.json();
        } catch {
          throw new ApiError("BAD_REQUEST", "Invalid JSON body", 400);
        }
        const parsed = schema.safeParse(json);
        if (!parsed.success) throw validationError(parsed.error);
        body = parsed.data;
      }

      const result = await handler(ctx, body, routeContext);

      if (responseSchema) {
        const validated = responseSchema.safeParse(result);
        if (!validated.success) {
          logger.error("API response validation failed", {
            error: validated.error.flatten(),
          });
          throw new ApiError("INTERNAL_ERROR", "Invalid response shape", 500);
        }
      }

      return NextResponse.json(result, {
        status,
        headers: {
          [API_VERSION_HEADER]: API_VERSION,
        },
      });
    } catch (err) {
      if (err instanceof ApiError) {
        return NextResponse.json(err.toJSON(), {
          status: err.status,
          headers: { [API_VERSION_HEADER]: API_VERSION },
        });
      }
      logger.error("Unhandled API error", {
        message: err instanceof Error ? err.message : "unknown",
      });
      const internal = new ApiError(
        "INTERNAL_ERROR",
        "Internal server error",
        500,
      );
      return NextResponse.json(internal.toJSON(), {
        status: 500,
        headers: { [API_VERSION_HEADER]: API_VERSION },
      });
    }
  };
}

export function apiGetHandler<TResponse>(
  handler: (
    ctx: ApiContext,
    routeContext: RouteContext,
  ) => Promise<TResponse>,
  responseSchema?: ZodSchema<TResponse>,
) {
  return apiHandler<undefined, TResponse>({
    handler: (ctx, _body, routeContext) => handler(ctx, routeContext),
    responseSchema,
  });
}

export function apiDeleteHandler(
  handler: (
    ctx: ApiContext,
    routeContext: RouteContext,
  ) => Promise<{ ok: true }>,
) {
  return apiHandler({
    handler: (ctx, _body, routeContext) => handler(ctx, routeContext),
    status: 200,
  });
}
