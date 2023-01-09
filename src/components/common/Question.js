import { Text } from "@chakra-ui/react";
import React from "react";

const Question = (props) => {
  return <Text fontSize="md">{props.question}</Text>;
};

export default Question;

// Question.defaultProps = {
//   question: "Question",
// };
