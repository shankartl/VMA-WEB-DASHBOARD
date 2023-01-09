import React, { useContext, useEffect } from "react";
import { Formik, Form, FieldArray } from "formik";
import { Box, Button, Center, Input, Spinner, Stack, Text, useBoolean } from "@chakra-ui/react";
import { AiOutlineFile, AiOutlinePlus } from "react-icons/ai";
import RenderQuestionComponents from "../pages/admin/RenderQuestionComponents";
import useCustomToastr from "../../utils/useCustomToastr";
import { CREATE_PRE_COURSE_THEORY, GET_PRE_COURSE_THEORY_QUESTIONS, UPDATE_QUESTIONS } from "../../constants/apiRoutes";
import api from "../../services/api";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { getSession } from "../../utils/commonUtil";
import { SessionContext } from "../context/SessionContext";
import * as Yup from "yup";

const optionSchema = Yup.object().shape({
  label: Yup.string().required("Option Field is required"),
});

const questionValidation = Yup.object().shape({
  question: Yup.string().required("Question Field is required"),
  type: Yup.string().required("type Field is required"),
  order: Yup.string(),
  options: Yup.array().of(optionSchema),
});

const validationSchema = Yup.object({
  questions: Yup.array().of(questionValidation),
});

const defaultValues = {
  questions: [],
};

const FieldArrayExample = () => {
  const toast = useCustomToastr();
  const sessionContext = useContext(SessionContext);
  const { session, setSession } = sessionContext;
  const [initialValues, setInitialValues] = React.useState(defaultValues);
  const [isDisabledAddQuestion, idaqState] = useBoolean(false);
  const [isSubmitting, isState] = useBoolean(false);
  const [isFetchingQuestion, ifqState] = useBoolean(false);
  const assessmentId = getSession(session);

  const createOption = (values) => {
    return values?.questions?.map((question, index) => {
      delete question?.fileId;
      delete question?.id;
      delete question?.assessmentId;
      if (question?.type === "MCQ") {
        return {
          ...question,
          order: index + 1,
          options: question?.options?.map((opt) => {
            return { label: opt?.label, is_correct: opt["is_correct"] ? opt.is_correct : false };
          }),
        };
      } else {
        return {
          ...question,
          order: index + 1,
          options: question?.options?.map((opt) => {
            return { label: opt?.label, emotion: opt?.label };
          }),
        };
      }
    });
  };

  const onSubmit = async (values) => {
    try {
      isState.on();
      const preCourseTheory = await createOption(values);
      const response = await api.post(CREATE_PRE_COURSE_THEORY(assessmentId), { questions: preCourseTheory });
      toast.showSuccess({ description: `Questions Saved Successfully` });
      return response;
    } catch (error) {
      toast.showError({ description: `${error?.message}` });
    } finally {
      isState.off();
    }
  };

  const fetchAssessmentQuestions = async () => {
    try {
      ifqState.on();
      const response = await api.get(GET_PRE_COURSE_THEORY_QUESTIONS(assessmentId));
      const fetchedQuestions = response?.assessment;
      setInitialValues(fetchedQuestions);
      return response;
    } catch (error) {
      toast.showError({ description: `${error?.message}` });
    } finally {
      ifqState.off();
    }
  };

  const onDragEnd = (dragedItem, values) => {
    setInitialValues(values);
    if (!dragedItem?.destination) {
      return;
    } else {
      const dItem = Array.from(values?.questions);
      const [reOrderedItem] = dItem.splice(dragedItem?.source.index, 1);
      dItem.splice(dragedItem?.destination.index, 0, reOrderedItem);
      setInitialValues({ ...values, questions: dItem });
    }
  };

  const getListStyle = (isDraggingOver) => {
    // background: isDraggingOver ? "red" : "yellow",
    if (isDraggingOver) {
      idaqState.on();
    } else {
      idaqState.off();
    }
  };

  useEffect(() => {
    if (session) fetchAssessmentQuestions();
  }, [assessmentId]);

  return (
    <div>
      {isFetchingQuestion ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
          {({ values }) => {
            return (
              <Form>
                <Stack mb={4}>
                  <Text>Theory</Text>
                  <Text fontSize={"x-small"}>Section description</Text>
                  <Input variant="flushed" placeholder="Add a description..." />
                </Stack>
                <FieldArray name="questions">
                  {({ remove, push, insert }) => (
                    <DragDropContext onDragEnd={(items) => onDragEnd(items, values)}>
                      <Droppable droppableId="questionContainer">
                        {(provided, snapshot) => (
                          <>
                            <Stack style={getListStyle(snapshot?.isDraggingOver)} {...provided.droppableProps} ref={provided.innerRef}>
                              {values.questions?.length > 0 &&
                                values.questions?.map((value, index) => {
                                  return (
                                    <div key={`quetsionContainer-${index}`}>
                                      <RenderQuestionComponents index={index} remove={remove} values={values} insert={insert} />
                                    </div>
                                  );
                                })}

                              <Box>
                                <Button
                                  position="absolute"
                                  top="0%"
                                  left={{ base: "50%", md: "70%", lg: "70%" }}
                                  fontSize="xs"
                                  fontWeight={800}
                                  leftIcon={<AiOutlineFile />}
                                  isLoading={isSubmitting}
                                  loadingText={"Saving Assessment"}
                                  spinnerPlacement={"end"}
                                  bg="orange"
                                  color="white"
                                  type="submit"
                                  _hover={{
                                    bg: "orange",
                                    color: "white",
                                  }}
                                >
                                  SAVE ASSESSMENT
                                </Button>
                                <Button
                                  onClick={() => {
                                    push({
                                      question: "",
                                      type: "",
                                      order: "",
                                      options: [
                                        {
                                          label: "",
                                        },
                                        {
                                          label: "",
                                        },
                                        {
                                          label: "",
                                        },
                                        {
                                          label: "",
                                        },
                                      ],
                                    });
                                  }}
                                  fontSize="xs"
                                  fontWeight={800}
                                  py="7"
                                  display={isDisabledAddQuestion ? "none" : "block"}
                                  leftIcon={<AiOutlinePlus />}
                                  bg="white"
                                  color="orange"
                                  w="100%"
                                  border="0.5px solid lightGrey"
                                >
                                  ADD QUESTION
                                </Button>
                              </Box>
                            </Stack>
                            {provided.placeholder}
                          </>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </FieldArray>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default FieldArrayExample;
