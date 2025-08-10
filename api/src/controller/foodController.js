const AppDataSource = require("../data-source"); // Assuming you have this configured
const {
  FoodSchema,
  QuerySchema,
  ParamsSchema,
  UpdateFoodSchema,
} = require("../validators/foodValidator");
const { ILike } = require("typeorm");

/**
 * @description Get all food items with search and pagination
 * @route GET /api/foods
 * @route GET /api/foods?name=[searchTerm]&page=[pageNumber]&limit=[itemsPerPage]
 */
async function getFoods(req, res) {
  try {
    // 1. Validate query parameters
    const validation = QuerySchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid query parameters",
        details: JSON.parse(validation.error.message)[0].message,
      });
    }

    const { name, page, limit } = validation.data;

    // 2. Prepare find options for TypeORM
    const skip = (page - 1) * limit;
    const whereClause = name ? { name: ILike(`%${name}%`) } : {};

    // 3. Fetch data from the database
    const repo = AppDataSource.getRepository("Food");
    const [items, total] = await repo.findAndCount({
      where: whereClause,
      take: limit,
      skip: skip,
    });

    // 4. Send response with pagination metadata
    res.json({
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching foods:", error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
}

/**
 * @description Add a new food item
 * @route POST /api/foods
 */
async function addFood(req, res) {
  try {
    // 1. Validate request body
    const validation = FoodSchema.safeParse(req.body);
    if (!validation.success) {
      //   console.log(JSON.parse(validation.error.message)[0].message);

      return res.status(400).json({
        error: "Invalid request body",
        details: JSON.parse(validation.error.message)[0].message,
      });
    }

    // 2. Create and save the new item
    const repo = AppDataSource.getRepository("Food");
    const newItem = repo.create(validation.data);
    await repo.save(newItem);

    // 3. Send the newly created item as response
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
}

/**
 * @description Update an existing food item
 * @route PUT /api/foods/:id
 */
async function updateFood(req, res) {
  try {
    // 1. Validate URL parameter 'id'
    const paramsValidation = ParamsSchema.safeParse(req.params);
    if (!paramsValidation.success) {
      return res.status(400).json({
        error: "Invalid ID parameter",
        details: paramsValidation.error.errors,
      });
    }
    const { id } = paramsValidation.data;

    // 2. Validate request body
    const bodyValidation = UpdateFoodSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        error: "Invalid request body",
        details: JSON.parse(bodyValidation.error.message)[0].message,
      });
    }

    // 3. Find the existing item
    const repo = AppDataSource.getRepository("Food");
    const foodToUpdate = await repo.findOneBy({ id });

    if (!foodToUpdate) {
      return res.status(404).json({ error: "Food item not found" });
    }

    // 4. Merge changes and save
    repo.merge(foodToUpdate, bodyValidation.data);
    const updatedFood = await repo.save(foodToUpdate);

    // 5. Send the updated item as response
    res.json(updatedFood);
  } catch (error) {
    console.error("Error updating food:", error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
}

/**
 * @description Delete a food item
 * @route DELETE /api/foods/:id
 */
async function deleteFood(req, res) {
  try {
    // 1. Validate URL parameter 'id'
    const paramsValidation = ParamsSchema.safeParse(req.params);
    if (!paramsValidation.success) {
      return res.status(400).json({
        error: "Invalid ID parameter",
        details: JSON.parse(paramsValidation.error.message)[0].message,
      });
    }
    const { id } = paramsValidation.data;

    // 2. Attempt to delete the item
    const repo = AppDataSource.getRepository("Food");
    const deleteResult = await repo.delete(id);

    // 3. Check if any rows were affected
    if (deleteResult.affected === 0) {
      return res.status(404).json({ error: "Food item not found" });
    }

    // 4. Send success response
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting food:", error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
}

module.exports = {
  getFoods,
  addFood,
  updateFood,
  deleteFood,
};
