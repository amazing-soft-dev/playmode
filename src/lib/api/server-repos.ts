import { readFile } from "node:fs/promises";
import { join } from "node:path";

import type { TemplateId } from "../domain/types.ts";
import { createMockAi, createMockCatalog } from "../repos/mock/providers.ts";

/**
 * Server-side AI and catalog providers for the route handlers. Templates are read from
 * public/games on disk. Swapping the mock for a real LLM provider or RAWG happens here only;
 * the client keeps calling the same endpoints.
 */
const loadTemplate = (template: TemplateId) =>
  readFile(join(process.cwd(), "public", "games", `${template}.html`), "utf8");

export const serverAi = createMockAi(loadTemplate);
export const serverCatalog = createMockCatalog();
