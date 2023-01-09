import { Box, Button, Image, Modal, ModalContent, ModalOverlay, Spinner, Text, useBoolean, useDisclosure } from "@chakra-ui/react";
import { React, useContext, useState } from "react";
import { useEffect } from "react";
import useCustomToastr from "../../../utils/useCustomToastr";
import { BsEmojiFrown, BsEmojiLaughing, BsEmojiNeutral, BsEmojiSmile } from "react-icons/bs";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import { SessionContext } from "../../context/SessionContext";
import { getSession } from "../../../utils/commonUtil";
import api from "../../../services/api";
import { GET_PRE_COURSE_THEORY_QUESTIONS, SUBMIT_ASSESSMENT_ANSWERS } from "../../../constants/apiRoutes";
import { updateUserLocalData } from "../../../services/auth";

const RenderOptions = ({
  selectedLabel,
  label,
  index,
  setSelectLabel,
  optionId,
  questionId,
  setArr,
  selectedQuestionId,
  setSelectedQuestionId,
}) => {
  const isClicked = selectedLabel === label;

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
        setSelectLabel(label);
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

const RenderLikertScale = ({ q, index, arr, setArr, setSelectedQuestionId, selectedQuestionId }) => {
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
            <div key={`pre-course-assessment-${oI}`}>
              <RenderOptions
                questionId={q.id}
                selectedLabel={selectedLabel}
                label={opt.label}
                optionId={opt.id}
                index={oI}
                setSelectLabel={setSelectLabel}
                setSelectedQuestionId={setSelectedQuestionId}
                selectedQuestionId={selectedQuestionId}
                arr={arr}
                setArr={setArr}
              />
            </div>
          );
        })}
      </Box>
    </Box>
  );
};

const PreCourseAssessmentModal = (props) => {
  const toast = useCustomToastr();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const sessionContext = useContext(SessionContext);
  const { session, setSession } = sessionContext;
  const startedAt = Date.now();

  useEffect(() => {
    if (props.currentSession === "DRUMS") {
      setSession("drums");
    } else {
      setSession("guitar");
    }
  }, []);
  const assessmentId = getSession(session);

  const initialValues = {};

  // const preAsessmentCompletionStatus = "COMPLETED";
  const [arr, setArr] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState({});
  const [submittedAnswersLength, setSubmmitedAnswersLength] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isFetchingQuestion, ifqState] = useBoolean(false);
  const navigate = useNavigate();
  const assesmentsQuestionLength = questions.length;

  const fetchAssessmentQuestions = async () => {
    try {
      ifqState.on();
      const response = await api.get(GET_PRE_COURSE_THEORY_QUESTIONS(assessmentId));
      const fetchedQuestions = response?.assessment?.questions;
      setQuestions(fetchedQuestions);
      return response;
    } catch (error) {
      toast.showError({ description: `${error?.message}` });
    } finally {
      ifqState.off();
    }
  };

  useEffect(() => {
    if (session) fetchAssessmentQuestions();
  }, [assessmentId]);

  useEffect(() => {
    if (arr.length && Object.keys(selectedQuestionId).length) {
      const findIndex = arr?.findIndex((q) => q.assessmentQuestionId === selectedQuestionId.assessmentQuestionId);
      if (findIndex === -1) {
        setArr((prev) => [...prev, selectedQuestionId]);
      } else {
        arr.splice(findIndex, 1);
        setArr((prev) => [...prev, selectedQuestionId]);
      }
    } else if (Object.keys(selectedQuestionId).length) {
      setArr([selectedQuestionId]);
    }
  }, [selectedQuestionId]);

  const manipulateSubmissionData = async (values) => {
    let payload = [];
    for (let key in values) {
      const reqValues = { assessmentQuestionId: key, answeredOptions: values[key] };
      payload.push({ ...reqValues });
    }
    const submittedAnswers = [...payload, ...arr];
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
      try {
        ifqState.on();
        const response = await api.post(SUBMIT_ASSESSMENT_ANSWERS("PRE_COURSE", session), finalPayload);
        updateUserLocalData({ attendedPreLessonTest: true });
        props.onClose();
        navigate(ROUTES.ASSESSMENT_COMPLETION_SCREEN);
        return response;
      } catch (error) {
        toast.showError({ description: `${error?.message}` });
      } finally {
        ifqState.off();
      }
    }
  };
  const renderMCQ = (q, index, values) => {
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

  function renderAssessmentQuestions(question, index) {
    switch (question.type) {
      case "MCQ":
        return renderMCQ(question, index);
      case "LIKERT_SCALE":
        return (
          <RenderLikertScale
            q={question}
            index={index}
            arr={arr}
            setArr={setArr}
            selectedQuestionId={selectedQuestionId}
            setSelectedQuestionId={setSelectedQuestionId}
          />
        );
      default:
        return <span>Question type unrecognised</span>;
    }
  }

  function handleClose() {
    // if (preAsessmentCompletionStatus !== "COMPLETED") {
    //   return;
    // }

    if (props.onClose) {
      props.onClose();
    }
  }

  return (
    //closeOnOverlayClick={false}
    <>
      <Modal isOpen={props.isModalOpen} size="sm" onClose={handleClose}>
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
                  <Box display="flex" border={"0.5px solid white"} m="5" borderRadius="10px">
                    <Box bg="lightGrey" display="flex" flexDirection="column" justifyContent="space-around" pl="2" flex="2">
                      <Box>
                        <Text fontWeight="bold">Pre-course test</Text>
                        <Text fontWeight="bold">Theory</Text>
                      </Box>
                      <Text fontSize="xs" color="gray.500">
                        Please fill out this 2 minute so we can understand how much of this lesson you have efficiently absorbed.
                      </Text>
                    </Box>
                    <Box>
                      <Image src={require("../../../assets/preLessonPic.png")} fallbackSrc="" h="8em" />
                    </Box>
                  </Box>

                  <Box display="flex" flexDirection="column">
                    <Form>
                      {isFetchingQuestion ? (
                        <Spinner />
                      ) : (
                        questions?.map((q, index) => {
                          return <div key={`pre-assessment-question-${index}`}>{renderAssessmentQuestions(q, index)}</div>;
                        })
                      )}

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
                    </Form>
                  </Box>
                </ModalContent>
              </>
            );
          }}
        </Formik>
      </Modal>
    </>
  );
};

export default PreCourseAssessmentModal;
PreCourseAssessmentModal.defaultProps = {};
