import { z } from "zod";

export const cacheKeyParamSchema = z.object({
  key: z.string().trim().min(1),
});

export const cacheBaseParamSchema = z.object({
  base: z.string().trim().min(1),
});

export const cacheQuerySchema = z.object({
  metadata: z.stringbool().optional().default(false),
  base: z.string().trim().min(1).optional(),
});

export const cacheClearBodySchema = z.object({
  bases: z.array(z.string().trim().min(1)).optional(),
});

export const cacheClearQuerySchema = z.object({
  bases: z.string().optional(),
});
