import React, { useState } from "react";

// import { useStoreState, useStoreActions } from "easy-peasy";

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
  // const {
  //   status: { [uuid]: { loading } = { loading: false } },
  //   byIds: { [uuid]: liked },
  // } = useStoreState((state) => state.favorite);
  // const { remove, add } = useStoreActions((state) => state.favorite);

  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // const handleChangeLike = () =>
  //   liked ? remove({ uuid }) : add({ uuid, referralCode });

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
