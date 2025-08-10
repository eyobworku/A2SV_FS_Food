import { useState } from "react";
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
  const [editingFood, setEditingFood] = useState(null); // store food being edited

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

  const handleSubmitFood = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const foodData = Object.fromEntries(formData.entries());
    foodData.rating = parseFloat(foodData.rating);

    if (editingFood) {
      updateFoodMutation.mutate(
        { id: editingFood.id, ...foodData },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingFood(null);
            e.target.reset();
          },
        }
      );
    } else {
      addFoodMutation.mutate(foodData, {
        onSuccess: () => {
          setIsModalOpen(false);
          e.target.reset();
        },
      });
    }
  };

  const handleDeleteFood = (id) => {
    if (window.confirm("Delete this food?")) {
      deleteFoodMutation.mutate(id);
    }
  };

  const openAddModal = () => {
    setEditingFood(null);
    setIsModalOpen(true);
  };

  const openEditModal = (food) => {
    setEditingFood(food);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Foods</h1>

      {/* Search */}
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

      {/* Loading / Error */}
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-500">Error loading foods</p>}

      {/* Table */}
      {!isLoading && foods.length > 0 && (
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
                <td className="p-2 border flex gap-2">
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
      )}

      {/* Pagination */}
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <form
            onSubmit={handleSubmitFood}
            className="bg-white p-6 rounded shadow-lg w-96"
          >
            <h2 className="text-lg font-bold mb-4">
              {editingFood ? "Edit Food" : "Add New Food"}
            </h2>
            <input
              name="name"
              defaultValue={editingFood?.name || ""}
              placeholder="Name"
              className="border p-2 rounded w-full mb-2"
              required
            />
            <input
              name="rating"
              defaultValue={editingFood?.rating || ""}
              placeholder="Rating"
              type="number"
              step="0.1"
              className="border p-2 rounded w-full mb-2"
              required
            />
            <input
              name="food_image"
              defaultValue={editingFood?.food_image || ""}
              placeholder="Food Image URL"
              className="border p-2 rounded w-full mb-2"
              required
            />
            <input
              name="resturant"
              defaultValue={editingFood?.resturant || ""}
              placeholder="Restaurant"
              className="border p-2 rounded w-full mb-2"
              required
            />
            <input
              name="resturant_image"
              defaultValue={editingFood?.resturant_image || ""}
              placeholder="Restaurant Image URL"
              className="border p-2 rounded w-full mb-2"
              required
            />
            <select
              name="resturant_status"
              defaultValue={editingFood?.resturant_status || "open"}
              className="border p-2 rounded w-full mb-4"
              required
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingFood(null);
                }}
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
