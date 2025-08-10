import { z } from "zod";
const foodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rating: z.coerce
    .number()
    .min(0, "Rating must be at least 0")
    .max(5, "Rating cannot exceed 5"),
  food_image: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Food image URL is required"),
  resturant: z.string().min(1, "Restaurant name is required"),
  resturant_image: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Restaurant image URL is required"),
  resturant_status: z.enum(["open", "closed"]),
});

export default foodSchema;
