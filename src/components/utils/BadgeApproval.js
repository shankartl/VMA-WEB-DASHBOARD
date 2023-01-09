import { Box } from "@chakra-ui/react";
import React from "react";
import { getStatusColor } from "../../utils/getStatusColor";

function BadgeApproval(props) {
  let { status = "" } = props;
  return (
    <Box
      as="button"
      borderRadius="3.2em"
      fontSize="sm"
      color="white"
      px="3"
      lineHeight="2em"
      textTransform="capitalize"
      bg={getStatusColor(status)}
    >
      {props.approval}
    </Box>
  );
}

BadgeApproval.defaultProps = {
  img: "https://via.placeholder.com/150",
};

export default BadgeApproval;
