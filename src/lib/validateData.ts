import { z, ZodError, type ZodType } from "zod";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { logger } from "./logger.js";
import { AuthValidator } from "../api/auth/auth.controller.js";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        logger.info(errorMessages);
        res.status(400).json({ error: "Invalid data", details: errorMessages });
      } else {
        logger.info(error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };
}

interface Validators<B = undefined, Q = undefined, S = undefined> {
  body?: ZodType<B>;
  query?: ZodType<Q>;
  params?: ZodType<any>;
  auth?: AuthValidator<S>;
}

type InferOrDefault<T> = T extends ZodType<infer U> ? U : undefined;

type ValidatedRequest<B, Q, S> = Request<any, any, B, Q> &
  (S extends undefined ? {} : { session: S });

/**
 * Creates a type-safe Express request handler with built-in validation and optional authentication.
 *
 * This function allows you to define Zod validators for the request body, query, and params,
 * as well as an optional authentication validator. If provided, each validator will be run in order:
 *   1. The authentication validator (if present) runs first. If it fails, the request is rejected with a 401 error.
 *   2. The params validator (if present) validates `req.params`. If validation fails, a 400 error is returned.
 *   3. The query validator (if present) validates and replaces `req.query` with the parsed, type-safe data.
 *   4. The body validator (if present) validates and replaces `req.body` with the parsed, type-safe data.
 *
 * If all validations pass, your handler is called with a request object where `body` and `query` are strongly typed,
 * and `session` is attached if authentication succeeded.
 *
 * @template B - The expected shape of the request body, inferred from the Zod schema.
 * @template Q - The expected shape of the request query, inferred from the Zod schema.
 * @template S - The expected shape of the session object, inferred from the authentication validator.
 *
 * @param validators - An object containing optional Zod schemas for `body`, `query`, and `params`,
 *   and an optional authentication validator. All fields are optional.
 *   - `body`: Zod schema to validate and type `req.body`.
 *   - `query`: Zod schema to validate and type `req.query`.
 *   - `params`: Zod schema to validate (but not replace) `req.params`.
 *   - `auth`: An async function that authenticates the request and returns a session object if successful.
 *
 * @param handler - Your Express route handler, which receives a request object with validated and typed `body` and `query`,
 *   and a `session` property if authentication is used.
 *
 * @returns An Express middleware function that performs validation and authentication before calling your handler.
 *
 * @example
 * app.post(
 *   '/user/:userId',
 *   useValidate(
 *     {
 *       body: z.object({ username: z.string() }),
 *       query: z.object({ page: z.string().optional() }),
 *       params: z.object({ userId: z.uuid() }),
 *       auth: myAuthValidator,
 *     },
 *     (req, res, next) => {
 *       // req.body, req.query, and req.session are all strongly typed here!
 *       res.json({ user: req.body.username, session: req.session });
 *     }
 *   )
 * );
 */
export function useValidate<B = undefined, Q = undefined, S = undefined>(
  validators: Validators<B, Q, S>,
  handler: (
    req: ValidatedRequest<
      InferOrDefault<typeof validators.body>,
      InferOrDefault<typeof validators.query>,
      S
    >,
    res: Response,
    next: NextFunction
  ) => any
): RequestHandler {
  return async (req, res, next) => {
    try {
      // Auth
      if (validators.auth) {
        const result = await validators.auth(req, res, next);
        if (!result.success) {
          return res.status(401).json({ error: result.error });
        }
        (req as any).session = result.session;
      }

      // Params
      if (validators.params) {
        const parsed = validators.params.safeParse(req.params);
        if (!parsed.success) {
          return res.status(400).json({ error: parsed.error });
        }
      }

      // Query
      if (validators.query) {
        const parsed = validators.query.safeParse(req.query);
        if (!parsed.success) {
          return res.status(400).json({ error: parsed.error });
        }
        (req.query as any) = parsed.data;
      }

      // Body
      if (validators.body) {
        const parsed = validators.body.safeParse(req.body);
        if (!parsed.success) {
          return res.status(400).json({ error: parsed.error });
        }
        req.body = parsed.data;
      }

      await handler(req as any, res, next);
    } catch (error) {
      next(error);
    }
  };
}
