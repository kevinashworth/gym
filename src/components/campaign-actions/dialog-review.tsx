import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { View, Text, StyleSheet } from "react-native";
import StarRating from "react-native-star-rating-widget";

import ButtonLinearGradient from "@/components/campaign-actions/review/button-linear-gradient";
import StarIcon from "@/components/campaign-actions/review/star-icon";
import ErrorMessage from "@/components/error-message";
import MainImage from "@/components/main-image";
import api from "@/lib/api";
import { spectrum } from "@/theme";

import type { Campaign } from "@/types/campaign";
import type { Location } from "@/types/location";

interface ReviewDialogProps {
  campaign: Campaign;
  location: Location;
  onSubmit: () => void;
}

function ReviewDialogContents({ campaign, location, onSubmit }: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hasChanged, setHasChanged] = useState(false);

  const reviewFnProps = {
    uuid: campaign.uuid,
  };
  const review = async ({ rating }: { rating: number }) => {
    await api.post(`merchant/action/review/${reviewFnProps.uuid}`, {
      json: { rating },
    });
  };

  const { error, isError, isPending, mutate } = useMutation({
    mutationFn: async ({ rating }: { rating: number }) => {
      await review({
        rating,
      });
    },
    onSuccess: () => {
      onSubmit();
    },
  });

  const handleRatingChange = (newRating: number) => {
    if (isPending) return;
    setRating(newRating);
    if (newRating !== 0) {
      setHasChanged(true);
    }
  };

  const handleReview = async () => {
    if (!hasChanged && rating === 0) return null;
    mutate({
      rating,
    });
  };

  return (
    <View style={styles.container}>
      <MainImage location={location} />
      <Text style={styles.text}>Your opinion counts.</Text>
      <Text style={styles.text}>
        Please rate your experience with <Text style={styles.locationName}>{location.name}</Text>.
      </Text>
      {isError ? (
        <View
          style={{
            justifyContent: "center",
            height: 116, // a visual approximation
          }}>
          <ErrorMessage error={error} />
        </View>
      ) : (
        <>
          <View style={styles.starContainer}>
            <StarRating
              color={spectrum.primary}
              emptyColor={hasChanged ? spectrum.secondary : spectrum.base2Content}
              onChange={handleRatingChange}
              rating={rating}
              StarIconComponent={StarIcon}
            />
          </View>
          <ButtonLinearGradient
            disabled={isPending || (!hasChanged && rating === 0)}
            end={rating / 5}
            size="md"
            label={isPending ? "Submitting..." : "Submit"}
            onPress={handleReview}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    marginTop: 8,
  },
  starContainer: {
    marginVertical: 24,
  },
  text: {
    fontSize: 16,
    fontWeight: 400,
    textAlign: "center",
  },
  locationName: {
    fontSize: 16,
    fontWeight: 500,
  },
});

export default ReviewDialogContents;
