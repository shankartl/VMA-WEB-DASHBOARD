import { Box, Button, Center, Flex, Image, Modal, ModalContent, ModalOverlay, Spinner, Stack, Text, useBoolean } from "@chakra-ui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import preLessonPic from "../../../assets/preLessonPic.png";
import React, { useContext, useEffect, useState } from "react";
import { LIKERTSCALE_QUESTION_TYPE, MULTIPLE_QUESTION_TYPE, SURVEY_QUESTION_TYPE } from "../../../constants/common";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import useCustomToastr from "../../../utils/useCustomToastr";
import { SessionContext } from "../../context/SessionContext";
import { FlushedInputField } from "../../formik";
import { SURVEY } from "../../../constants/common";
import { pff } from "../../../utils/commonUtil";

const RenderMultipleChoice = ({ question, index, formValues, keyPrefix }) => {
  return (
    <Box m="5" key={index}>
      <Box display="flex" gap="2" id="checkbox-group">
        <Text>0{index + 1}</Text>
        <Text fontWeight="bold">{question?.question}</Text>
      </Box>

      <FieldArray
        name={pff(`answers.${index}.answeredOptions`, keyPrefix)}
        render={({ push, remove }) => {
          return question.options.map((o, i) => {
            return (
              <div key={`mcq-option-${i}-${o.id}`}>
                <input
                  type="checkbox"
                  checked={formValues.answers[index].answeredOptions?.includes(o.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      push(o.id);
                    } else {
                      const idx = formValues.answers[index].answeredOptions.indexOf(o.id);
                      if (idx > -1) remove(idx);
                    }
                  }}
                  value={o.id}
                />
                &nbsp; {o.label}
              </div>
            );
          });
        }}
      />
    </Box>
  );
};

const RenderLikertScale = ({ answer, index, formValues, keyPrefix }) => {
  return (
    <Box m="5" key={index}>
      <Box display="flex" gap="2">
        <Text>0{index + 1}</Text>
        <Text fontWeight="bold">{answer.question}</Text>
      </Box>
      <Box display="flex" gap="5" justifyContent="space-around" bg="greyBox" borderRadius="10px" ml="5" mt="3" p="2">
        <FieldArray
          name={pff(`answers.${index}.answeredOptions`, keyPrefix)}
          render={({ pop, push }) => {
            return answer?.options?.map((opt, oI) => {
              return (
                <div key={`likertScale-option-${oI}`}>
                  <RenderOptions
                    onChange={(optionId) => {
                      pop();
                      push(optionId);
                    }}
                    formValues={formValues}
                    questionIndex={index}
                    option={opt}
                    index={oI}
                  />
                </div>
              );
            });
          }}
        />
      </Box>
    </Box>
  );
};

const RenderOptions = ({ option, index, onChange, formValues, questionIndex }) => {
  const isSelected = React.useMemo(() => {
    return formValues.answers[questionIndex].answeredOptions?.includes(option.id);
  }, [formValues.answers[questionIndex]]);

  const handleClick = () => {
    onChange(option.id);
  };
  return (
    <Box cursor={"pointer"} onClick={handleClick} display="flex" flexDirection="column" alignItems="center">
      <Box p="3" borderRadius="10px">
        <Text color={isSelected ? "green" : "inherit"}>{option.label}</Text>
      </Box>
    </Box>
  );
};

const RenderSurveyQuestionType = ({ question, index, questionName }) => {
  return (
    <>
      <Box m="5">
        <Box display="flex" gap="2" id="checkbox-group">
          <Text>0{index + 1}</Text>
          <Text fontWeight="bold">{question}</Text>
        </Box>
        <FlushedInputField isInline={false} direction="column" label="answer" name={questionName} isRequired fontSize="xs" />
      </Box>
    </>
  );
};

function AssesmentModal(props) {
  const {
    isModalOpen,
    onClose,
    courseType,
    questionType,
    assessments,
    description,
    isFetchingQuestion,
    assessmentId,
    onSubmit,
    placement,
    isSubmitting,
  } = props;

  if (!isModalOpen) {
    return;
  }

  const toast = useCustomToastr();
  const initialValues = React.useMemo(() => {
    const _assessments = [];
    assessments.forEach((assessment) => {
      const answersInitialValues = [];
      assessment.questions.forEach((aq) => {
        answersInitialValues.push(aq);
      });

      _assessments.push({
        ...assessment,
        answers: answersInitialValues,
      });
    });

    return { assessments: _assessments };
  }, [assessments]);

  let startedAt = Date.now();

  const showError = () => {
    const error = formattedErrorMessage(`Please Attend all the questions`);
    toast.showError(error);
  };

  const manipulateSubmissionData = async (values) => {
    const notAttenedQuestions = values?.assessments
      ?.map((ao) => {
        return ao?.answers?.filter((a) => {
          return a.type !== "TEXT" && !a["answeredOptions"];
        });
      })
      .flat();

    const transformedPayload = [];
    values.assessments.forEach((a) =>
      a.answers.forEach((aa) => {
        const payload = {
          assessmentQuestionId: aa.id,
        };

        if (aa.type === "LIKERT_SCALE" || aa.type === "MCQ") {
          payload.answeredOptions = aa.answeredOptions;
        } else if (aa.type === "TEXT") {
          payload.answer = aa.answer;
        }

        transformedPayload.push(payload);
      })
    );
    const submittedAnswers = [...transformedPayload];
    const testEndTime = Date.now();

    const finalPayload = {
      startedAt: startedAt,
      endedAt: testEndTime,
      answers: submittedAnswers,
    };

    if (notAttenedQuestions.length > 0) {
      showError();
    } else {
      await onSubmit(finalPayload);
    }
  };

  const renderTheory = (values, index) => {
    const keyPrefix = `assessments.${index}`;
    return (
      <>
        {isFetchingQuestion ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <React.Fragment key={`assessment-question-${index}`}>
            <Box display="flex" border={"0.5px solid white"} m="5" borderRadius="10px">
              <Box bg="lightGrey" display="flex" flexDirection="column" justifyContent="center" pl="2" flex="2">
                <Box>
                  <Text fontWeight="bold">{values.placement === "PRE_COURSE" ? "Pre-course test" : "Post-course test"}</Text>
                  <Text fontWeight="bold">{values.type === "THEORY" ? "Theory" : "Practical"}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500">
                    {values?.description}
                  </Text>
                  {values?.metadata && Object.keys(values?.metadata)?.length !== 0 ? (
                    <Box>
                      <Text fontSize="xs" color="gray.500">
                        key: {values?.metadata["key"] ? values?.metadata["key"] : ""}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        piece_name : {values?.metadata["piece_name"] ? values?.metadata["piece_name"] : ""}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        tuning: {values?.metadata["tuning"] ? values?.metadata["tuning"] : ""}
                      </Text>
                    </Box>
                  ) : (
                    ""
                  )}
                </Box>
              </Box>
              <Box>
                <Image src={preLessonPic} fallbackSrc="" h="8em" />
              </Box>
            </Box>

            <FieldArray
              name={pff("answers", keyPrefix)}
              render={(helpers) => {
                return values.answers.map((a, i) => {
                  if (a.type === "MCQ") {
                    return (
                      <div key={`mcq-question-${i}`}>
                        <RenderMultipleChoice keyPrefix={keyPrefix} question={a} index={i} formValues={values} />
                      </div>
                    );
                  }

                  if (a.type === "TEXT") {
                    return (
                      <div key={`text-question-${i}`}>
                        <RenderSurveyQuestionType questionName={pff(`answers.${i}.answer`, keyPrefix)} question={a.question} index={i} />
                      </div>
                    );
                  }

                  if (a.type === "LIKERT_SCALE") {
                    return (
                      <div key={`likert-scale-question-${i}`}>
                        <RenderLikertScale keyPrefix={keyPrefix} answer={a} index={i} formValues={values} />
                      </div>
                    );
                  }
                });
              }}
            />
          </React.Fragment>
        )}
      </>
    );
  };

  function renderSections(formValues) {
    return (
      <FieldArray
        name={"assessments"}
        render={(helper) => {
          return formValues.assessments?.map(renderTheory);
        }}
      />
    );
  }

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={onClose}>
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
                  <Box display="flex" flexDirection="column">
                    <Form>
                      {renderSections(values)}
                      <Box ml="10" mr="4" p="2">
                        <Button
                          fontSize="xs"
                          fontWeight={800}
                          bg="orange"
                          isLoading={isSubmitting}
                          loadingText={"Submitting"}
                          spinnerPlacement={"end"}
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
}

export default AssesmentModal;
