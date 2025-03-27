import { useQuery } from "@tanstack/react-query";

import api from "@/lib/api";

type FavoriteFromApi = [id: number, name: string, uuid: string];
type FavoritesFromApi = FavoriteFromApi[];

type Favorite = string;
type Favorites = Favorite[];

async function fetchFavorites(): Promise<Favorites> {
  const favorites = await api.get<FavoritesFromApi>("user/favorite/favorites").json();
  const result = favorites.map((favorite: FavoriteFromApi) => favorite[2]);
  return result;
}

export const useFavorites = () =>
  useQuery({
    queryKey: ["favorites"],
    queryFn: () => fetchFavorites(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
