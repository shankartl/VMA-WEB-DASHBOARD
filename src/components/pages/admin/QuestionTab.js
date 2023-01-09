import React from "react";
import QuestionBox from "../../common/QuestionBox";

const QuestionType = () => {
  return (
    <>
      <QuestionBox />
    </>
  );
};

export default QuestionType;

QuestionType.defaultProps = {
  questionType: "Question Type",
  question: "Question",
  option1: "Option 1",
};
