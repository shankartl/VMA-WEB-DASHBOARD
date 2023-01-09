import { Box, Text } from "@chakra-ui/react";
import React from "react";

const UserInfoSideBar = (props) => {
  return (
    <Box
      display="flex"
      onClick={props.onClick}
      color={props.color}
      alignItems="center"
      gap="2"
      py="1"
      _hover={props._hover}
      cursor="pointer"
    >
      {props.icon}
      <Text fontSize="xs" fontWeight="bold">
        {props.name}
      </Text>
    </Box>
  );
};

export default UserInfoSideBar;
UserInfoSideBar.defaultProps = {
  icon: "Icon",
  name: "Name",
};
