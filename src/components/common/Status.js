import { Box, Text } from "@chakra-ui/react";
import React from "react";

const Status = (props) => {
  return (
    <>
      <Box w="10em" p="3" bg="#FDEFEC" borderRadius="10px" mt="0.5em">
        <Text fontWeight="bold" color="#EB5A3C" fontSize="2em">
          {props.hours}
        </Text>
        <Box display="flex" alignItems="center" gap="2">
          {props.icon}
          <Text fontSize="0.8em" fontWeight="bold">
            {props.hoursSpent}
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default Status;
