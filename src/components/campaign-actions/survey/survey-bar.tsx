import { Pressable, StyleSheet, Text, View } from "react-native";

import IconCoins from "@/assets/svg/icon-coins";
import Icon from "@/components/icon";
import { spectrum } from "@/theme";

import type { AvailableSurvey } from "@/types/survey";

interface SurveyBarProps {
  index: number;
  onPress: () => void;
  survey: AvailableSurvey;
}

function AvailableSurveyBar({ index, onPress, survey }: SurveyBarProps) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          styles.container,
          { backgroundColor: survey.responded ? spectrum.gray8 : spectrum.white },
        ]}>
        <View
          style={[
            styles.coloredBorder,
            { backgroundColor: survey.responded ? spectrum.gray9 : spectrum.green9 },
          ]}
        />
        <Text style={{ flex: 1 }} numberOfLines={1}>
          {survey.title || `Survey ${index + 1}`}
        </Text>
        {!survey.responded && (
          <View style={styles.icons}>
            <IconCoins quantity={survey.reward} />
            <Icon name="chevron-right" />
          </View>
        )}
      </View>
    </Pressable>
  );
}

const height = 40;
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderColor: spectrum.gray8,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    height,
    width: "100%",
  },
  coloredBorder: {
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    flexShrink: 0,
    height,
    width: 20,
  },
  titleText: {
    flex: 1,
  },
  icons: {
    alignItems: "center",
    flex: 0,
    flexDirection: "row",
    flexShrink: 0,
    gap: 4,
  },
});

export default AvailableSurveyBar;
