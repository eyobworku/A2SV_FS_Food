import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import foodSchema from "../schema/foodSchema";
import {
  useFoods,
  useAddFood,
  useUpdateFood,
  useDeleteFood,
} from "../hooks/useFood";

export default function FoodsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(foodSchema),
  });

  const { data, isLoading, isError } = useFoods({
    page,
    limit: 10,
    name: search,
  });
  const addFoodMutation = useAddFood();
  const updateFoodMutation = useUpdateFood();
  const deleteFoodMutation = useDeleteFood();

  const foods = data?.data || [];
  const meta = data?.meta || {};

  // 3. Update the submit handler to use react-hook-form's data
  const onSubmit = (foodData) => {
    if (editingFood) {
      updateFoodMutation.mutate(
        { id: editingFood.id, ...foodData },
        {
          onSuccess: () => {
            closeModal();
          },
        }
      );
    } else {
      addFoodMutation.mutate(foodData, {
        onSuccess: () => {
          closeModal();
        },
      });
    }
  };

  const handleDeleteFood = (id) => {
    if (window.confirm("Delete this food?")) {
      deleteFoodMutation.mutate(id);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFood(null);
    reset({
      // Reset form to default values
      name: "",
      rating: 0,
      food_image: "",
      resturant: "",
      resturant_image: "",
      resturant_status: "open",
    });
  };

  const openAddModal = () => {
    setEditingFood(null);
    // Reset form to default values for a new entry
    reset({
      name: "",
      rating: 0,
      food_image: "",
      resturant: "",
      resturant_image: "",
      resturant_status: "open",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (food) => {
    setEditingFood(food);
    // 4. Populate the form with the data of the food being edited
    reset(food);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Foods</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search food..."
          className="border p-2 rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={openAddModal}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Food
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-500">Error loading foods</p>}

      {!isLoading && foods.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Restaurant</th>
                <th className="p-2 border">Rating</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food.id}>
                  <td className="p-2 border">
                    <img
                      src={food.food_image}
                      alt={food.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-2 border">{food.name}</td>
                  <td className="p-2 border ">{food.resturant}</td>
                  <td className="p-2 border">{food.rating}</td>
                  <td className="p-2 border">{food.resturant_status}</td>
                  <td className="p-2 border flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => openEditModal(food)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteFood(food.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {meta.page} of {meta.totalPages || 1}
        </span>
        <button
          disabled={page >= (meta.totalPages || 1)}
          onClick={() => setPage((p) => p + 1)}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded shadow-lg w-full max-w-md"
          >
            <h2 className="text-lg font-bold mb-4">
              {editingFood ? "Edit Food" : "Add New Food"}
            </h2>

            <div className="mb-2">
              <input
                {...register("name")}
                placeholder="Name"
                className="border p-2 rounded w-full"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="mb-2">
              <input
                {...register("rating")}
                placeholder="Rating"
                type="number"
                step="0.1"
                className="border p-2 rounded w-full"
              />
              {errors.rating && (
                <p className="text-red-500 text-sm">{errors.rating.message}</p>
              )}
            </div>

            <div className="mb-2">
              <input
                {...register("food_image")}
                placeholder="Food Image URL"
                className="border p-2 rounded w-full"
              />
              {errors.food_image && (
                <p className="text-red-500 text-sm">
                  {errors.food_image.message}
                </p>
              )}
            </div>

            <div className="mb-2">
              <input
                {...register("resturant")}
                placeholder="Restaurant"
                className="border p-2 rounded w-full"
              />
              {errors.resturant && (
                <p className="text-red-500 text-sm">
                  {errors.resturant.message}
                </p>
              )}
            </div>

            <div className="mb-2">
              <input
                {...register("resturant_image")}
                placeholder="Restaurant Image URL"
                className="border p-2 rounded w-full"
              />
              {errors.resturant_image && (
                <p className="text-red-500 text-sm">
                  {errors.resturant_image.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <select
                {...register("resturant_status")}
                className="border p-2 rounded w-full"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
              {errors.resturant_status && (
                <p className="text-red-500 text-sm">
                  {errors.resturant_status.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                {editingFood ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
