import React, { useState } from "react";

import Like from "@/components/like";

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
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChangeLike() {
    setLoading(true);
    setTimeout(() => {
      setLiked(!liked);
      setLoading(false);
      console.log(uuid, referralCode);
    }, 1000);
  }

  return (
    <Like
      enableText={enableText}
      liked={Boolean(liked)}
      loading={loading}
      onChange={handleChangeLike}
    />
  );
}
