import React from "react";

import { View } from "react-native";

import PromptWithAlternativesMCMA from "@/components/campaign-actions/survey/question-mcma";
import PromptWithAlternativesMCSA from "@/components/campaign-actions/survey/question-mcsa";

interface QuestionProps {
  alternatives: string[];
  onConfirm?: () => void;
  prompt: string;
  questionType: "mcma" | "mcsa";
  rightButtonLabel?: string;
  leftButtonLabel?: string;
  onLeftButtonPress?: () => void;
  onRightButtonPress?: () => void;
}

const Question: React.FC<QuestionProps> = ({
  alternatives,
  onConfirm,
  prompt,
  questionType,
  rightButtonLabel,
  leftButtonLabel,
  onLeftButtonPress,
  onRightButtonPress,
}) => {
  return (
    <View>
      {questionType === "mcma" ? (
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
};

export default Question;
