const { z } = require("zod");

const FoodSchema = z.object({
  name: z.string().min(1, { message: "Food name is required" }),
  rating: z.number().min(0).max(5).optional().nullable(),
  food_image: z
    .string()
    .url({ message: "Invalid URL format" })
    .optional()
    .nullable(),
  resturant: z.string().optional().nullable(),
  resturant_image: z
    .string()
    .url({ message: "Invalid URL format" })
    .optional()
    .nullable(),
  resturant_status: z.enum(["open", "closed"]).default("open"),
});
const UpdateFoodSchema = FoodSchema.partial();
const QuerySchema = z.object({
  name: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
});

const ParamsSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive({ message: "ID must be a positive integer" }),
});
module.exports = {
  FoodSchema,
  UpdateFoodSchema,
  QuerySchema,
  ParamsSchema,
};
