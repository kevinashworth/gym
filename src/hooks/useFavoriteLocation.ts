import { useState } from "react";

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
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: favorites, refetch } = useQuery({
    queryKey: ["bamboo"],
    queryFn: () => fetchFavorites(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  const isFavorite = favorites?.some((favorite) => favorite === uuid);

  const { mutate: addMutate } = useMutation({
    mutationFn: async () => {
      setIsUpdating(true);
      await addFavorite(uuid);
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["dashboard", "location", "favorites"] });
      setIsUpdating(false);
    },
  });

  const { mutate: removeMutate } = useMutation({
    mutationFn: async () => {
      setIsUpdating(true);
      await removeFavorite(uuid);
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["dashboard", "location", "favorites"] });
      setIsUpdating(false);
    },
  });

  const toggleFavorite = () => {
    if (isFavorite) {
      removeMutate();
    } else {
      addMutate();
    }
  };

  return {
    isFavorite,
    isUpdating,
    toggleFavorite,
  };
};
