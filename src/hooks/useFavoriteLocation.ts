import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import api from "@/lib/api";

type FavoriteFromApi = [id: number, name: string, uuid: string];

async function fetchFavorites(): Promise<string[]> {
  const favorites = await api.get<FavoriteFromApi[]>("user/favorite/favorites").json();
  return favorites.map((favorite) => favorite[2]);
}

const addFavorite = async (uuid: string) => {
  await api.post(`user/favorite/add/${uuid}`);
};

const removeFavorite = async (uuid: string) => {
  await api.post(`user/favorite/remove/${uuid}`);
};

export const useFavoriteLocation = (uuid: string) => {
  const queryClient = useQueryClient();

  const { data: favorites, refetch } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => fetchFavorites(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  const isFavorite = favorites?.some((favorite) => favorite === uuid);

  const { mutate: addMutate, isPending: isAdding } = useMutation({
    mutationFn: () => addFavorite(uuid),
    onSettled: async () => {
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["dashboard", "location", "favorites"] });
    },
  });

  const { mutate: removeMutate, isPending: isRemoving } = useMutation({
    mutationFn: () => removeFavorite(uuid),
    onSettled: async () => {
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["dashboard", "location", "favorites"] });
    },
  });

  const toggleFavorite = () => {
    if (isFavorite) {
      removeMutate();
    } else {
      addMutate();
    }
  };

  const isUpdating = isAdding || isRemoving;

  return {
    isFavorite,
    isUpdating,
    toggleFavorite,
  };
};
