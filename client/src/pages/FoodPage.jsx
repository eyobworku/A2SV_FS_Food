import { useState } from "react";
import {
  useFoods,
  useCreateFood,
  useUpdateFood,
  useDeleteFood,
} from "../hooks/useFood";
import { debounce } from "lodash";

export default function FoodsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    rating: "",
    food_image: "",
    resturant: "",
    resturant_image: "",
    resturant_status: "",
  });

  const { data, isLoading, error } = useFoods(page, searchTerm);
  const createFood = useCreateFood();
  const updateFood = useUpdateFood();
  const deleteFood = useDeleteFood();

  // Debounce search input
  const debouncedSearch = debounce((value) => {
    setSearchTerm(value);
    setPage(1);
  }, 500);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      rating: "",
      food_image: "",
      resturant: "",
      resturant_image: "",
      resturant_status: "",
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (food) => {
    setEditingFood(food);
    setFormData(food);
    setShowEditModal(true);
  };

  const handleSubmitAdd = () => {
    createFood.mutate(formData, { onSuccess: () => setShowAddModal(false) });
  };

  const handleSubmitEdit = () => {
    updateFood.mutate(
      { id: editingFood.id, ...formData },
      { onSuccess: () => setShowEditModal(false) }
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this food?")) {
      deleteFood.mutate(id);
    }
  };

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">Error loading foods</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search foods..."
          value={search}
          onChange={handleSearchChange}
          className="border px-3 py-2 rounded w-1/3"
        />
        <button
          onClick={handleOpenAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Food
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Rating</th>
            <th className="border p-2">Restaurant</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((food) => (
            <tr key={food.id}>
              <td className="border p-2">{food.name}</td>
              <td className="border p-2">{food.rating}</td>
              <td className="border p-2">{food.resturant}</td>
              <td className="border p-2">{food.resturant_status}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleOpenEdit(food)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(food.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: data?.meta.totalPages || 1 }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border ${
              page === i + 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <Modal title="Add Food" onClose={() => setShowAddModal(false)}>
          <FoodForm formData={formData} setFormData={setFormData} />
          <button
            onClick={handleSubmitAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Save
          </button>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <Modal title="Edit Food" onClose={() => setShowEditModal(false)}>
          <FoodForm formData={formData} setFormData={setFormData} />
          <button
            onClick={handleSubmitEdit}
            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
          >
            Update
          </button>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-1/3">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose}>✖</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FoodForm({ formData, setFormData }) {
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="space-y-2">
      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="Rating"
        name="rating"
        value={formData.rating}
        onChange={handleChange}
      />
      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="Food Image URL"
        name="food_image"
        value={formData.food_image}
        onChange={handleChange}
      />
      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="Restaurant"
        name="resturant"
        value={formData.resturant}
        onChange={handleChange}
      />
      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="Restaurant Image URL"
        name="resturant_image"
        value={formData.resturant_image}
        onChange={handleChange}
      />
      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="Restaurant Status"
        name="resturant_status"
        value={formData.resturant_status}
        onChange={handleChange}
      />
    </div>
  );
}
