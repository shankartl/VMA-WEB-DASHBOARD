import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import React from "react";
import AnswerBox from "../../common/AnswerBox";
import ChartProgress from "../../common/ChartProgress";
import Question from "../../common/Question";

const correctUserOptionStyle = {
  color: "green",
  thickness: "bold",
};

const inCorrectUserOptionStyle = {
  color: "red",
  thickness: "bold",
};

const questionOptionStyle = {
  color: "inherit",
};

const ResponseSummary = ({ assessmentAnswers = [] }) => {
  function renderQuestionOptions(qOption, index, userAnswer) {
    let styleProps = questionOptionStyle;

    const givenAnswerOptionIds = userAnswer.metadata.givenAnswers.map((g) => g.id);

    const isUserCorrect = givenAnswerOptionIds.includes(qOption.id);

    if (isUserCorrect) {
      styleProps = correctUserOptionStyle;
    } else if (qOption.is_correct) {
      if (userAnswer.question.type === "MCQ") {
        styleProps = inCorrectUserOptionStyle;
      }
    }

    return (
      <Box key={`user-question-option-${index}`}>
        <AnswerBox answer={qOption.label} {...styleProps} />
      </Box>
    );
  }

  function renderAssessmentAnswers(answer, index) {
    return (
      <Grid key={`assessment-answer-${index}`} templateColumns="repeat(12, 1fr)" bg="greyBox" p="5" mt="3" mb="5" borderRadius="5px">
        <GridItem colSpan={12}>
          <Question question={answer.question.question} />

          <Box mt={5} />
          {answer?.question.options && answer?.question.options.map((o, i) => renderQuestionOptions(o, i, answer))}
          <Text>{answer?.answer ? answer?.answer : ""}</Text>
        </GridItem>
      </Grid>
    );
  }

  return (
    <Box>
      {assessmentAnswers.map((aa) => (
        <Box key={`assessment-answer-${aa.id}`}>{aa?.answers.map(renderAssessmentAnswers)}</Box>
      ))}
    </Box>
  );
  // return (
  //   <Box>
  //     {preCourseInfo.map((d, index) => {
  //       return (
  //         <>
  //           <Grid key={`precourseInfo-${index}`} templateColumns="repeat(12, 1fr)" bg="greyBox" p="5" mt="3" mb="5" borderRadius="5px">
  //             <GridItem colSpan={12}>
  //               <>
  //                 <Question question={d.question?.question} />
  // {d.question?.options.map((o, oI) => {
  //   return (
  //     <Box pt="5" pb="3" key={`precourseInfoOpt-${oI}`}>
  //       {renderAnswers(d.metadata.givenAnswers, o)}
  //     </Box>
  //   );
  // })}
  //                 {/* <Box pt="5" pb="3">
  //                   <AnswerBox answer="They were short and concise. I understood like 95% of it without any issues." />
  //                   <AnswerBox answer="they were ok, had trouble wid the 10th lesson... but overall good" />
  //                   <AnswerBox answer="Ez to follow!! the drawings of the guitar helped me a lott!" />
  //                   <AnswerBox answer="Had difficulty understanding some instructions, maybe show a video next to the lines?" />
  //                 </Box> */}
  //               </>
  //             </GridItem>
  //           </Grid>
  //         </>
  //       );
  //     })}

  //     {/* <Grid templateColumns="repeat(12, 1fr)" bg="greyBox" p="5" mb="5" borderRadius="5px">
  //       <GridItem colSpan={12}>
  //         <Box display={{ base: "block", md: "flex", lg: "flex" }}>
  //           <Question question="Can you identify the 4 notes played in this audio?" />
  //           <Spacer />
  //           <Box>
  //             <audio controls>
  //               <source src="http://www.sousound.com/music/healing/healing_01.mp3" type="audio/mpeg"></source>
  //             </audio>
  //           </Box>
  //         </Box>
  //         <Box pt="5" pb="3">
  //           <AnswerBox answer="C minor, D sharp, G minor, C major" />
  //           <AnswerBox answer="C minor, D sharp, G minor, C major" />
  //           <AnswerBox answer="C minor, D sharp, G minor, C major" />
  //         </Box>
  //         <Box pt="5" pb="3">
  //           <AnswerBox answer="C minor, D sharp, G minor, C major" />
  //           <AnswerBox answer="C minor, D sharp, G minor, C major" />
  //           <AnswerBox answer="C minor, D sharp, G minor, C major" />
  //         </Box>
  //       </GridItem>
  //     </Grid> */}
  //   </Box>
  // );
};

export default ResponseSummary;
