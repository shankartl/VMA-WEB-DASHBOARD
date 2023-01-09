import { Text } from "@chakra-ui/react";
import React from "react";

const SectionHeader = ({ children }) => {
  return (
    <Text fontSize="2xl" fontWeight="medium" color="darkBlue.500" mt="1.5em">
      {children}
    </Text>
  );
};

export default SectionHeader;
