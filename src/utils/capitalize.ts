// github.com/you-dont-need/You-Dont-Need-Lodash-Underscore?tab=readme-ov-file#_capitalize

const capitalize = (string: string) => {
  return string ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase() : "";
};

export default capitalize;
