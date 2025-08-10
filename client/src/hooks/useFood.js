import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFoods, addFood, updateFood, deleteFood } from "../api/foodApi";

// Fetch foods (with pagination & search)
export const useFoods = ({ page, limit, name }) => {
  return useQuery({
    queryKey: ["foods", page, limit, name],
    queryFn: () => getFoods({ page, limit, name }),
    keepPreviousData: true, // so pagination is smoother
  });
};

// Add new food
export const useAddFood = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addFood,
    onSuccess: () => {
      queryClient.invalidateQueries(["foods"]);
    },
  });
};

// Update food
export const useUpdateFood = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFood,
    onSuccess: () => {
      queryClient.invalidateQueries(["foods"]);
    },
  });
};

// Delete food
export const useDeleteFood = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFood,
    onSuccess: () => {
      queryClient.invalidateQueries(["foods"]);
    },
  });
};
