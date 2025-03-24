import React from "react";

import { useQueryClient } from "@tanstack/react-query";

import Like from "@/components/like";
import api from "@/lib/api";
import { useFavorites } from "@/queries/useFavorites";

interface FavoriteLocationProps {
  enableText?: boolean;
  referralCode?: string;
  uuid: string;
}

export default function FavoriteLocation({
  enableText = false,
  referralCode,
  uuid,
}: FavoriteLocationProps) {
  const { data: favorites, isLoading } = useFavorites(uuid);
  const isFavorite = favorites?.some((favorite) => favorite === uuid);
  const queryClient = useQueryClient();

  async function add(uuid: string) {
    await api.post(`user/favorite/add/${uuid}`);
    queryClient.invalidateQueries({ queryKey: ["favorites", uuid] });
  }

  async function remove(uuid: string) {
    await api.post("user/favorite/remove", {
      searchParams: { uuid },
    });
    queryClient.invalidateQueries({ queryKey: ["favorites", uuid] });
  }

  function toggleFavorite() {
    if (isFavorite) {
      remove(uuid);
    } else {
      add(uuid);
    }
  }

  return (
    <Like
      enableText={enableText}
      liked={Boolean(isFavorite)}
      loading={isLoading}
      onChange={toggleFavorite}
    />
  );
}
