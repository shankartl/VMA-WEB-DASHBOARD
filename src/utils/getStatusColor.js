export const getStatusColor = (status = "") => {
  const primary = "#143037";
  const darkBlue = "#065BAA";
  switch (status) {
    case "SUSPENDED":
      return "red";
    case "ACTIVE":
      return "black";
    default:
      return "black";
  }
};
