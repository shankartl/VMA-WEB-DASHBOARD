import {
  Box,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useBoolean,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { BsEmojiFrown, BsEmojiLaughing, BsEmojiNeutral, BsEmojiSmile } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { GET_PRE_COURSE_THEORY_QUESTIONS, SUBMIT_ASSESSMENT_ANSWERS } from "../../../constants/apiRoutes";
import { ROUTES } from "../../../constants/routes";
import api from "../../../services/api";
import { updateUserLocalData, useAuth } from "../../../services/auth";
import { getPostLessonSession } from "../../../utils/commonUtil";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import useCustomToastr from "../../../utils/useCustomToastr";
import { SessionContext } from "../../context/SessionContext";
import preLessonPic from "../../../assets/preLessonPic.png";

const initialValues = {};

const RenderOptions = ({
  selectedLabel,
  label,
  index,
  setSelectLabel,
  optionId,
  questionId,
  setLikertAnswers,
  selectedQuestionId,
  setSelectedQuestionId,
  labelId,
}) => {
  const isClicked = selectedLabel === labelId;

  const renderEmojis = (label) => {
    switch (label) {
      case "SAD":
        return <BsEmojiFrown fontSize="3em" />;
      case "NEUTRAL":
        return <BsEmojiNeutral fontSize="3em" />;
      case "HAPPY":
        return <BsEmojiSmile fontSize="3em" />;
      case "VERY_HAPPY":
        return <BsEmojiLaughing fontSize="3em" />;
      default:
    }
  };

  return (
    <Box
      onClick={() => {
        setSelectLabel(labelId);
        setSelectedQuestionId({
          ...selectedQuestionId,
          assessmentQuestionId: questionId,
          answeredOptions: [optionId],
        });
      }}
      key={index}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box p="3" borderRadius="10px" bg={isClicked ? "green" : "inherit"} color={isClicked ? "#fff" : "inherit"}>
        {renderEmojis(label)}
      </Box>
      <Text>{label}</Text>
    </Box>
  );
};

const RenderLikertScale = ({ q, index, likertAnswers, setLikertAnswers, setSelectedQuestionId, selectedQuestionId }) => {
  const [selectedLabel, setSelectLabel] = useState("");
  return (
    <Box m="5" key={index}>
      <Box display="flex" gap="2">
        <Text>0{index + 1}</Text>
        <Text fontWeight="bold">{q.question}</Text>
      </Box>
      <Box display="flex" gap="5" justifyContent="space-around" bg="greyBox" borderRadius="10px" ml="5" mt="3" p="2">
        {q.options.map((opt, oI) => {
          return (
            <div key={`post-course-assessment-${oI}`}>
              <RenderOptions
                questionId={q.id}
                selectedLabel={selectedLabel}
                label={opt.label}
                labelId={opt.id}
                optionId={opt.id}
                index={oI}
                setSelectLabel={setSelectLabel}
                setSelectedQuestionId={setSelectedQuestionId}
                selectedQuestionId={selectedQuestionId}
                likertAnswers={likertAnswers}
                setLikertAnswers={setLikertAnswers}
              />
            </div>
          );
        })}
      </Box>
    </Box>
  );
};

function PostCourseTestModal({ isOpen, onClose, setTestAttended }) {
  const toast = useCustomToastr();
  const sessionContext = useContext(SessionContext);
  const { session, setSession } = sessionContext;
  const assessmentId = getPostLessonSession(session);
  const [isFetchingQuestion, ifqState] = useBoolean(false);
  const [theoryQuestion, setTheoryQuestions] = React.useState([]);
  const [practicalQuestions, setPracticalQuestions] = React.useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState({});
  const [likertAnswers, setLikertAnswers] = useState([]);
  const [practicalDescription, setPracticalDescription] = React.useState({});
  const startedAt = Date.now();

  const assesmentsQuestionLength = +theoryQuestion.length + +practicalQuestions.length;

  const renderMCQ = (q, index) => {
    return (
      <Box m="5" key={index}>
        <Box display="flex" gap="2" id="checkbox-group">
          <Text>0{index + 1}</Text>
          <Text fontWeight="bold">{q.question}</Text>
        </Box>

        {q.options.map((opt, oI) => {
          return (
            <Box
              key={`pre-course-assessment-${oI}`}
              bg="greyBox"
              borderRadius="10px"
              ml="5"
              mt="3"
              p="2"
              role="group"
              display={"flex"}
              alignItems={"center"}
              aria-labelledby="checkbox-group"
            >
              <Field type="checkbox" name={q.id} value={opt.id} />
              &nbsp; {opt.label}
            </Box>
          );
        })}
      </Box>
    );
  };

  useEffect(() => {
    if (likertAnswers.length && Object.keys(selectedQuestionId).length) {
      const findIndex = likertAnswers?.findIndex((q) => q.assessmentQuestionId === selectedQuestionId.assessmentQuestionId);
      if (findIndex === -1) {
        setLikertAnswers((prev) => [...prev, selectedQuestionId]);
      } else {
        likertAnswers.splice(findIndex, 1);
        setLikertAnswers((prev) => [...prev, selectedQuestionId]);
      }
    } else if (Object.keys(selectedQuestionId).length) {
      setLikertAnswers([selectedQuestionId]);
    }
  }, [selectedQuestionId]);

  const uploadAnswers = async (payload) => {
    try {
      ifqState.on();
      // const response = await api.post(SUBMIT_ASSESSMENT_ANSWERS("POST_COURSE", session), payload);

      // const separateTheoryPayload = payload.answers.filter((x) =>
      //   theoryQuestion.map((y) => Number(y.id)).includes(Number(x.assessmentQuestionId))
      // );
      // const separatePracticalPayload = payload.answers.filter((x) =>
      //   practicalQuestions.map((y) => Number(y.id)).includes(Number(x.assessmentQuestionId))
      // );
      // ifqState.on();
      // const theoryResponse = await api.post(SUBMIT_ASSESSMENT_ANSWERS(assessmentId?.theory), {
      //   ...payload,
      //   answers: separateTheoryPayload,
      // });
      // const practicalResponse = await api.post(SUBMIT_ASSESSMENT_ANSWERS(assessmentId?.practical), {
      //   ...payload,
      //   answers: separatePracticalPayload,
      // });
      updateUserLocalData({ attendedPreLessonTest: true });
      setTestAttended(true);
      onClose();
      // return response;
      // return { theoryResponse, practicalResponse };
    } catch (error) {
      toast.showError({ description: `${error?.message}` });
    } finally {
      ifqState.off();
    }
  };

  const manipulateSubmissionData = async (values) => {
    let payload = [];
    for (let key in values) {
      const reqValues = { assessmentQuestionId: key, answeredOptions: values[key] };
      payload.push({ ...reqValues });
    }
    const submittedAnswers = [...payload, ...likertAnswers];
    const testEndTime = Date.now();

    const finalPayload = {
      startedAt: startedAt,
      endedAt: testEndTime,
      answers: submittedAnswers,
    };

    const finalAnswerPayload = submittedAnswers.filter((d) => d.answeredOptions?.length === 0);

    if (submittedAnswers.length !== assesmentsQuestionLength) {
      const error = formattedErrorMessage("Please Attend all the questions");
      toast.showError(error);
    } else if (finalAnswerPayload.length > 0) {
      const error = formattedErrorMessage("Please Attend all the questions");
      toast.showError(error);
    } else {
      uploadAnswers(finalPayload);
    }
  };

  function renderAssessmentQuestions(question, index) {
    switch (question.type) {
      case "MCQ":
        return renderMCQ(question, index);
      case "LIKERT_SCALE":
        return (
          <RenderLikertScale
            q={question}
            index={index}
            likertAnswers={likertAnswers}
            setLikertAnswers={setLikertAnswers}
            selectedQuestionId={selectedQuestionId}
            setSelectedQuestionId={setSelectedQuestionId}
          />
        );
      default:
        return <span>Question type unrecognised</span>;
    }
  }

  const fetchAssessmentQuestions = async () => {
    try {
      ifqState.on();
      const theoryResponse = await api.get(GET_PRE_COURSE_THEORY_QUESTIONS(assessmentId?.theory));
      const practicalResponse = await api.get(GET_PRE_COURSE_THEORY_QUESTIONS(assessmentId?.practical));
      setPracticalDescription(practicalResponse?.assessment);
      setTheoryQuestions(theoryResponse?.assessment?.questions);
      setPracticalQuestions(practicalResponse?.assessment?.questions);
      return { practicalResponse, theoryResponse };
    } catch (error) {
      toast.showError({ description: `${error?.message}` });
    } finally {
      ifqState.off();
    }
  };

  useEffect(() => {
    fetchAssessmentQuestions();
  }, []);

  return (
    <Modal isOpen={isOpen} size="sm" onClose={onClose}>
      <ModalOverlay bg={"gray"} />
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          manipulateSubmissionData(values);
        }}
        enableReinitialize={true}
      >
        {({ values, handleSubmit, setFieldValue }) => {
          return (
            <>
              <ModalContent maxW={{ base: "70%", md: "80%", lg: "50%" }} maxH="40em" overflowY="scroll" position="relative">
                <Form>
                  <Stack>
                    {/* theory questions--- */}
                    <Stack>
                      <Box display="flex" border={"0.5px solid white"} m="5" borderRadius="10px">
                        <Box bg="lightGrey" display="flex" flexDirection="column" justifyContent="space-around" pl="2" flex="2">
                          <Box>
                            <Text fontWeight="bold">Post-course test</Text>
                            <Text fontWeight="bold">Theory</Text>
                          </Box>
                          <Text fontSize="xs" color="gray.500">
                            Please fill out this 2 minute so we can understand how much of this lesson you have efficiently absorbed.
                          </Text>
                        </Box>
                        <Box>
                          <Image src={preLessonPic} fallbackSrc="" h="8em" />
                        </Box>
                      </Box>

                      {/* render theory question */}
                      {isFetchingQuestion ? (
                        <Spinner />
                      ) : (
                        <>
                          {theoryQuestion?.map((q, index) => {
                            return <div key={`pre-assessment-question-${index}`}>{renderAssessmentQuestions(q, index)}</div>;
                          })}
                        </>
                      )}
                    </Stack>

                    {/* render pactical questions--- */}
                    <Stack>
                      <Box display="flex" border={"0.5px solid white"} m="5" borderRadius="10px">
                        <Box bg="lightGrey" display="flex" flexDirection="column" justifyContent="space-around" pl="2" flex="2">
                          <Box>
                            <Text fontWeight="bold">Post-course test</Text>
                            <Text fontWeight="bold">Practical</Text>
                          </Box>

                          <Text fontSize="xs" color="gray.500">
                            {practicalDescription?.description}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {practicalDescription?.metadata?.key}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {practicalDescription?.metadata?.piece_name}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {practicalDescription?.metadata?.tuning}
                          </Text>
                        </Box>
                        <Box>
                          <Image src={preLessonPic} fallbackSrc="" h="8em" />
                        </Box>
                      </Box>
                      {isFetchingQuestion ? (
                        <Spinner />
                      ) : (
                        <>
                          {practicalQuestions?.map((q, index) => {
                            return <div key={`pre-assessment-question-${index}`}>{renderAssessmentQuestions(q, index)}</div>;
                          })}
                        </>
                      )}
                    </Stack>
                  </Stack>

                  {/*--- submit button--- */}
                  <Box display="flex" flexDirection="column">
                    <ModalFooter>
                      {" "}
                      <Box ml="10" mr="4" p="2">
                        <Button
                          fontSize="xs"
                          fontWeight={800}
                          bg="orange"
                          w="100%"
                          color="white"
                          border="0.5px solid lightGrey"
                          justifyContent="center"
                          type="submit"
                        >
                          SUBMIT ASSESSMENT
                        </Button>
                      </Box>
                    </ModalFooter>
                  </Box>
                </Form>
              </ModalContent>
            </>
          );
        }}
      </Formik>
    </Modal>
  );
}

export default PostCourseTestModal;
