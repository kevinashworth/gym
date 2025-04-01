import React from "react";

import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, Text, View } from "react-native";

import PromptWithAlternativesMCMA from "@/components/campaign-actions/survey/question-mcma";
import PromptWithAlternativesMCSA from "@/components/campaign-actions/survey/question-mcsa";
import ErrorMessage from "@/components/error-message";
import api from "@/lib/api";

import type { AvailableSurvey, SurveyQuestions } from "@/types/survey";

interface QandAProps {
  survey: AvailableSurvey;
  onConfirm?: () => void;
  rightButtonLabel?: string;
  leftButtonLabel?: string;
  onLeftButtonPress?: () => void;
  onRightButtonPress?: () => void;
}

function QandA({
  survey,
  onConfirm,
  rightButtonLabel,
  leftButtonLabel,
  onLeftButtonPress,
  onRightButtonPress,
}: QandAProps) {
  const uuid = survey.uuid;

  const { data, error, isError, isLoading } = useQuery({
    queryFn: () => api.get<SurveyQuestions>(`campaign/${uuid}/survey-questions`).json(),
    queryKey: ["survey-questions", uuid],
  });

  if (isError) {
    return <ErrorMessage error={error} />;
  }
  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (!data || data.length === 0) {
    return <Text>No survey questions available</Text>;
  }

  const { alternatives, prompt, question_type = "mcsa" } = data[0];

  return (
    <View>
      {question_type === "mcsa" ? (
        <PromptWithAlternativesMCMA
          alternatives={alternatives}
          onConfirm={onConfirm}
          prompt={prompt}
          rightButtonLabel={rightButtonLabel}
          leftButtonLabel={leftButtonLabel}
          onLeftButtonPress={onLeftButtonPress}
          onRightButtonPress={onRightButtonPress}
        />
      ) : (
        <PromptWithAlternativesMCSA
          alternatives={alternatives}
          onConfirm={onConfirm}
          prompt={prompt}
          rightButtonLabel={rightButtonLabel}
          leftButtonLabel={leftButtonLabel}
          onLeftButtonPress={onLeftButtonPress}
          onRightButtonPress={onRightButtonPress}
        />
      )}
    </View>
  );
}

export default QandA;
