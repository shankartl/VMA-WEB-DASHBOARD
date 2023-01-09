import { Box, Input, Text } from "@chakra-ui/react";
import React from "react";

export const ParagraphQuestion = (props) => {
  return (
    <>
      <Box mb="3">
        <Text fontSize="xs" color="gray">
          {props.question}
        </Text>
        <Input variant="flushed" />
      </Box>
    </>
  );
};
ParagraphQuestion.defaultProps = {
  question: "Question",
};
