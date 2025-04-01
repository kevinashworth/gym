import { Ionicons } from "@expo/vector-icons";

export type StarIconProps = {
  index: number;
  size: number;
  color: string;
  type: "full" | "half" | "empty";
};

const StarBorder = ({ size, color }: Omit<StarIconProps, "type">) => (
  <Ionicons name="star-outline" size={size} color={color} />
);

const StarFull = ({ size, color }: Omit<StarIconProps, "type">) => (
  <Ionicons name="star" size={size} color={color} />
);

const StarHalf = ({ size, color }: Omit<StarIconProps, "type">) => (
  <Ionicons name="star-half" size={size} color={color} />
);

const StarIcon = ({ index, type, size, color }: StarIconProps) => {
  const Component = type === "full" ? StarFull : type === "half" ? StarHalf : StarBorder;

  return <Component index={index} size={size} color={color} />;
};

export default StarIcon;
