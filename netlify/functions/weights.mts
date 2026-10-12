import type { Config } from "@netlify/functions";
import { crudHandler } from "../lib/crud.ts";
import {
  WeightInputSchema,
  WeightPatchSchema,
  createWeight,
  deleteWeight,
  getWeight,
  listWeights,
  updateWeight,
} from "../lib/weights.ts";

export default crudHandler(
  "weights",
  { input: WeightInputSchema, patch: WeightPatchSchema },
  { list: listWeights, get: getWeight, create: createWeight, update: updateWeight, remove: deleteWeight },
);

export const config: Config = {
  path: ["/api/weights", "/api/weights/:id"],
};
