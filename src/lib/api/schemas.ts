import { z } from "zod";

import { fields } from "./form-route.ts";

/** Request bodies for every form route, shared by the handlers and their tests. */
export const contactSchema = z.object({
  name: fields.name,
  email: fields.email,
  topic: z.enum(["feedback", "bug", "copyright", "business"], { message: "Please choose a topic." }),
  message: fields.message,
});

export const waitlistSchema = z.object({
  email: fields.email,
  /** Optional: what they want to build, to help pick beta testers. */
  interest: z.string().trim().max(300).optional().default(""),
  /** Age confirmation; the beta is for adults only, like Plus. */
  adult: z.literal("on", { message: "The beta is for players 18 and older." }),
});

export const newsletterSchema = z.object({
  email: fields.email,
});

export const reportSchema = z.object({
  gameId: z.string().trim().min(1).max(80),
  reason: z.enum(["inappropriate", "copyright", "broken", "spam", "other"], { message: "Please choose a reason." }),
  details: z.string().trim().max(500).optional().default(""),
});

export const parentsSchema = z.object({
  name: fields.name,
  email: fields.email,
  topic: z.enum(["question", "deletion", "game", "classroom"], { message: "Please choose a topic." }),
  message: fields.message,
});
