import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";

import QandA from "@/components/campaign-actions/survey/q-and-a";
import Question from "@/components/campaign-actions/survey/question";
import AvailableSurveyBar from "@/components/campaign-actions/survey/survey-bar";
import ErrorMessage from "@/components/error-message";
import api from "@/lib/api";
import { spectrum } from "@/theme";

import type { AvailableSurveys, AvailableSurvey } from "@/types/survey";

const QA_DIALOG_WIDTH = (Dimensions.get("window").width * 19) / 20;

interface SurveyProps {
  isMutating?: boolean;
  campaign_uuid: string;
  location_uuid: string;
  handleSurvey: () => void;
}

function SurveyComponent({
  isMutating = false,
  campaign_uuid,
  location_uuid,
  handleSurvey,
}: SurveyProps) {
  const [show, setShow] = useState(0);
  const [currentSurvey, setCurrentSurvey] = useState<AvailableSurvey | null>(null);

  const { data, error, isLoading } = useQuery({
    queryFn: () =>
      api.get<AvailableSurveys>(`campaign/location/${location_uuid}/my-surveys`).json(),
    queryKey: [campaign_uuid, location_uuid],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <View style={{ height: 48 }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ alignItems: "center", gap: 16 }}>
        <ErrorMessage error={error} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={{ alignItems: "center", gap: 16 }}>
        <Text style={{ color: spectrum.gray8 }}>No surveys available</Text>
      </View>
    );
  }

  return (
    <>
      <View style={{ gap: 16, width: QA_DIALOG_WIDTH - 64 }}>
        {show === 0 && (
          <View style={{ gap: 8 }}>
            <Text style={styles.text}>Available Surveys</Text>
            <View style={{ gap: 8 }}>
              {data.map((survey, index) => (
                <AvailableSurveyBar
                  index={index}
                  key={survey.uuid}
                  onPress={() => {
                    setCurrentSurvey(survey);
                    // setShow(1);
                  }}
                  survey={survey}
                />
              ))}
              {data.map((survey, index) => (
                <AvailableSurveyBar
                  index={index}
                  key={survey.uuid}
                  onPress={() => console.log("dummy")}
                  survey={{ ...survey, responded: true }}
                />
              ))}
            </View>
          </View>
        )}
        {currentSurvey && (
          <View>
            <QandA
              survey={currentSurvey}
              leftButtonLabel="Back"
              rightButtonLabel="Next"
              onLeftButtonPress={() => setShow(0)}
              onRightButtonPress={() => setShow(2)}
            />
          </View>
        )}
        {show === 1 && (
          <View>
            <Question
              prompt="What flavor of cookie should we make more of?"
              alternatives={["Chocolate Chip", "Oatmeal Raisin", "Peanut Butter", "Jalapeño Fire"]}
              questionType="mcsa"
              leftButtonLabel="Back"
              rightButtonLabel="Next"
              onLeftButtonPress={() => setShow(0)}
              onRightButtonPress={() => setShow(2)}
            />
          </View>
        )}
        {show === 2 && (
          <View>
            <Question
              prompt="Which flavors of cookie should we destroy?"
              alternatives={["Chocolate Chip", "Oatmeal Raisin", "Peanut Butter", "Jalapeño Fire"]}
              questionType="mcma"
              leftButtonLabel="Back"
              rightButtonLabel="Submit Survey"
              onLeftButtonPress={() => setShow(1)}
              onRightButtonPress={() => setShow(3)}
            />
          </View>
        )}
        {show === 3 && (
          <View>
            <Text style={styles.text}>Survey Submitted</Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    color: spectrum.base2Content,
    fontSize: 16,
    fontWeight: 500,
  },
});

export default SurveyComponent;
