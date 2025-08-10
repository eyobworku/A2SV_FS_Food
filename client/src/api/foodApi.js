import API from "./api";

// GET all foods with optional search & pagination
export const getFoods = async ({ page = 1, limit = 10, name = "" }) => {
  const params = { page, limit };
  if (name) params.name = name;
  const res = await API.get("/foods", { params });
  return res.data; // returns { data: [...], meta: {...} }
};

// POST new food
export const addFood = async (food) => {
  const res = await API.post("/foods", food);
  return res.data;
};

// PUT update food
export const updateFood = async ({ id, ...food }) => {
  const res = await API.put(`/foods/${id}`, food);
  return res.data;
};

// DELETE food
export const deleteFood = async (id) => {
  const res = await API.delete(`/foods/${id}`);
  return res.data;
};
