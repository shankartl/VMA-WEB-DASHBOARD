import { Box, Button, Input, InputGroup, InputRightElement, Text } from "@chakra-ui/react";
import React from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { ParagraphQuestion } from "./ParagraphQuestion";

export const MultipleChoiceQuestion = (props) => {
  return (
    <Box>
      <ParagraphQuestion />
      <Box mb="3">
        <Text fontSize="xs" color="gray">
          {props.option1}
        </Text>
        <InputGroup>
          <Input variant="flushed" />
          <InputRightElement>{<AiOutlineClose />}</InputRightElement>
        </InputGroup>
      </Box>
      <Box>
        <Button fontSize="xs" leftIcon={<AiOutlinePlus />} bg="white" color="black" w="100%" border="0.5px solid lightGrey">
          ADD OPTION
        </Button>
      </Box>
    </Box>
  );
};

MultipleChoiceQuestion.defaultProps = {
  question: "Question",
  option1: "Option 1",
};
