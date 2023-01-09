import { Box, Text } from "@chakra-ui/react";
import React from "react";
const AnswerBox = ({ answer, color, thickness }) => {
  return (
    <Box bg="white" px="5" py="3" mb="3" borderRadius="00.5em">
      <Box display="flex" gap="2" alignItems="center">
        <Text color={color} fontSize="sm" fontWeight={thickness ? thickness : ""}>
          {answer}
        </Text>
      </Box>
    </Box>
  );
};

export default AnswerBox;

AnswerBox.defaultProps = {
  answer: "Answer",
};
