import { Box, Button, Divider, Grid, GridItem, Heading, HStack, Input, Spinner, Stack, Text, useBoolean } from "@chakra-ui/react";
import { FieldArray, Form, Formik } from "formik";
import React, { useContext, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { AiOutlineFile, AiOutlinePlus } from "react-icons/ai";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { FlushedInputField } from "../../formik";
import RenderPostQuestions from "./RenderPostQuestions";
import RenderPracticalQuestions from "./RenderPracticalQuestions";
import * as Yup from "yup";
import useCustomToastr from "../../../utils/useCustomToastr";
import api from "../../../services/api";
import {
  CREATE_POST_COURSE_PRACTICAL,
  CREATE_POST_COURSE_THEORY,
  GET_PRE_COURSE_THEORY_QUESTIONS,
  UPDATE_QUESTIONS,
} from "../../../constants/apiRoutes";
import { SessionContext } from "../../context/SessionContext";
import { getPostLessonSession } from "../../../utils/commonUtil";

const defaultValues = {
  questions: [],
  practicalQuestions: [],
  sectionDescription: {
    description: "",
    musicPiece: "",
    tunning: "",
    key: "",
  },
  musicSheet: "",
};

function PostLessonTab() {
  const [practicalOrder, setPracticalOrder] = React.useState(0);
  const [initialValues, setInitialValues] = React.useState(defaultValues);
  const [isDisabledAddQuestion, idaqState] = useBoolean(false);
  const [isDisabledPracticalQuestion, idpqState] = useBoolean(false);
  const [isSubmitting, isState] = useBoolean(false);
  const [isFetchingQuestion, ifqState] = useBoolean(false);
  const toast = useCustomToastr();
  const sessionContext = useContext(SessionContext);
  const { session, setSession } = sessionContext;
  const assessmentId = getPostLessonSession(session);
  const [musicSheet, setMusicSheet] = React.useState("");

  const optionSchema = Yup.object().shape({
    label: Yup.string().required("Option Field is required"),
  });

  const questionValidation = Yup.object().shape({
    question: Yup.string().required("Question Field is required"),
    type: Yup.string().required("type Field is required"),
    order: Yup.string(),
    options: Yup.array().of(optionSchema),
  });

  const sessionValidation = Yup.object().shape({
    description: Yup.string().required("Description Field is required"),
    musicPiece: Yup.string().required("MusicPiece Field is required"),
    tunning: Yup.string().required("Tunning Field is required"),
    key: Yup.string().required("Key Field is required"),
  });

  const validationSchema = Yup.object({
    questions: Yup.array().of(questionValidation),
    practicalQuestions: Yup.array().of(questionValidation),
    sectionDescription: sessionValidation,
  });

  const getListStyle = (isDraggingOver) => {
    if (isDraggingOver) {
      idaqState.on();
    } else {
      idaqState.off();
    }
  };

  const getPracticalListStyle = (isDraggingOver) => {
    if (isDraggingOver) {
      idpqState.on();
    } else {
      idpqState.off();
    }
  };

  const onDragEnd = (dragedItem, values) => {
    setInitialValues({ ...values, questions: values });
    if (!dragedItem?.destination) {
      return;
    } else {
      const dItem = Array.from(values?.questions);
      const [reOrderedItem] = dItem.splice(dragedItem?.source.index, 1);
      dItem.splice(dragedItem?.destination.index, 0, reOrderedItem);
      setInitialValues({ ...values, questions: dItem });
    }
  };
  const onPracticaldragEnd = (dragedItem, values) => {
    setInitialValues({ ...values, practicalQuestions: values });
    if (!dragedItem?.destination) {
      return;
    } else {
      const dItem = Array.from(values?.practicalQuestions);
      const [reOrderedItem] = dItem.splice(dragedItem?.source.index, 1);
      dItem.splice(dragedItem?.destination.index, 0, reOrderedItem);
      setInitialValues({ ...values, practicalQuestions: dItem });
    }
  };

  const createTheoryPayload = (values) => {
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

  const createPracticalPayload = (values) => {
    return values?.practicalQuestions?.map((question, index) => {
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

  const createSessionPayload = (values) => {
    return {
      description: values?.description,
      metadata: {
        piece_name: values?.musicPiece,
        key: values?.key,
        tuning: values?.tunning,
      },
    };
  };

  const fetchAssessmentQuestions = async () => {
    try {
      ifqState.on();
      const theoryResponse = await api.get(GET_PRE_COURSE_THEORY_QUESTIONS(assessmentId?.theory));
      const practicalResponse = await api.get(GET_PRE_COURSE_THEORY_QUESTIONS(assessmentId?.practical));
      const fetchedQuestions = {
        questions: theoryResponse?.assessment?.questions,
        practicalQuestions: practicalResponse?.assessment?.questions,
        sectionDescription: {
          description: practicalResponse?.assessment?.description,
          musicPiece: practicalResponse?.assessment?.metadata?.piece_name,
          tunning: practicalResponse?.assessment?.metadata?.tuning,
          key: practicalResponse?.assessment?.metadata?.key,
        },
      };
      setInitialValues(fetchedQuestions);
      return { practicalResponse, theoryResponse };
    } catch (error) {
      toast.showError({ description: `${error?.message}` });
    } finally {
      ifqState.off();
    }
  };

  useEffect(() => {
    fetchAssessmentQuestions();
  }, [session]);

  const onHandleSubmit = async (values) => {
    try {
      const file = musicSheet[0];
      const formData = new FormData();
      await formData.append("", file);
      const theoryPayload = await createTheoryPayload(values);
      const practicalPayload = await createPracticalPayload(values);
      const sessionPayload = await createSessionPayload(values?.sectionDescription);
      isState.on();
      const theoryResponse = await api.post(CREATE_POST_COURSE_THEORY(assessmentId?.theory), { questions: theoryPayload });
      const practicalesponse = await api.post(CREATE_POST_COURSE_PRACTICAL(assessmentId?.practical), {
        questions: practicalPayload,
      });
      const updateSessionDescription = await api.put(UPDATE_QUESTIONS(assessmentId?.practical), { ...sessionPayload });
      toast.showSuccess({ description: `Questions Saved Successfully` });
      return { theoryResponse, practicalesponse, updateSessionDescription };
    } catch (error) {
      toast.showError({ description: `${error?.message}` });
    } finally {
      isState.off();
    }
  };

  return (
    <>
      <div style={{ marginBottom: "200px" }}>
        {isFetchingQuestion ? (
          <Spinner />
        ) : (
          <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={onHandleSubmit} enableReinitialize={true}>
            {({ values }) => {
              return (
                <Form>
                  <Stack mb={4}>
                    <Text>Theory</Text>
                    <Text fontSize={"x-small"}>Section description</Text>
                    <Input name="" variant="flushed" placeholder="Add a description..." />
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
                                      <div className="row" key={index}>
                                        <RenderPostQuestions insert={insert} index={index} push={push} remove={remove} values={values} />
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
                                    onClick={() =>
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
                                      })
                                    }
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
                  {/* ---------- */}
                  <Divider mt={4} border={1} borderRadius={"full"} borderColor={"gray"} />
                  <Stack mt={3}>
                    <Heading as="h5" size="sm">
                      Practical
                    </Heading>

                    <FlushedInputField
                      isInline={false}
                      direction="column"
                      label="Section description"
                      name={"sectionDescription.description"}
                      placeholder={`Add a description...`}
                      fontSize="xs"
                    />

                    <Grid templateColumns="repeat(5, 1fr)" gap={20}>
                      <GridItem colSpan={3}>
                        <Box>
                          <Stack>
                            <FlushedInputField
                              isInline={false}
                              direction="column"
                              name={"sectionDescription.musicPiece"}
                              label={"Name of music piece"}
                              placeholder={`What is this music piece called?`}
                              fontSize="xs"
                            />
                          </Stack>
                          <Stack>
                            <FlushedInputField
                              isInline={false}
                              direction="column"
                              label="Tuning"
                              name={"sectionDescription.tunning"}
                              placeholder={`For example: E, A, D, G, B, E`}
                              fontSize="xs"
                            />
                          </Stack>
                          <Stack>
                            <FlushedInputField
                              isInline={false}
                              direction="column"
                              label="Key"
                              name={"sectionDescription.key"}
                              placeholder={`For example: Am`}
                              fontSize="xs"
                            />
                          </Stack>
                        </Box>
                      </GridItem>
                      <GridItem colSpan={2}>
                        <Box
                          padding={4}
                          borderRadius={"lg"}
                          border={"dashed"}
                          borderColor={"gray"}
                          width={"330px"}
                          height={"full"}
                          bg={"white"}
                          display={"flex"}
                          flexDirection={"column"}
                          justifyContent={"space-between"}
                        >
                          <HStack alignItems={"center"}>
                            <MdOutlineAddPhotoAlternate fontSize={"20px "} />
                            <Text color={"gray"} fontSize={"xs"}>
                              Drag your music sheet image here, or
                            </Text>{" "}
                            <Button color={"#EB5A3C"} variant="link">
                              <Text fontSize={"xs"}> upload one</Text>
                              <Input
                                type="file"
                                height="100%"
                                width="100%"
                                position="absolute"
                                name={"musicSheet"}
                                top="0"
                                left="0"
                                opacity="0"
                                aria-hidden="true"
                                accept="image/*"
                                onChange={(e) => {
                                  setMusicSheet(e.target.files);
                                }}
                              />
                            </Button>
                          </HStack>
                          <Text color={"gray"} fontSize={"xs"}>
                            Supported file types: png, jpg, jpeg
                          </Text>
                        </Box>
                      </GridItem>
                    </Grid>
                    <FieldArray name="practicalQuestions">
                      {({ remove, push, insert }) => (
                        <DragDropContext onDragEnd={(items) => onPracticaldragEnd(items, values)}>
                          <Droppable droppableId="questionContainer">
                            {(provided, snapshot) => (
                              <>
                                <Stack
                                  style={getPracticalListStyle(snapshot?.isDraggingOver)}
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                >
                                  <div>
                                    {values.practicalQuestions?.length > 0 &&
                                      values.practicalQuestions?.map((value, index) => {
                                        setPracticalOrder(index + 1);
                                        return (
                                          <div className="row" key={index}>
                                            <RenderPracticalQuestions
                                              insert={insert}
                                              index={index}
                                              push={push}
                                              remove={remove}
                                              values={values}
                                            />
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
                                        bg="orange"
                                        color="white"
                                        type="submit"
                                        isLoading={isSubmitting}
                                        loadingText={"Submitting"}
                                        spinnerPlacement={"end"}
                                        _hover={{
                                          bg: "orange",
                                          color: "white",
                                        }}
                                      >
                                        SAVE ASSESSMENT
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          push({
                                            question: "",
                                            type: "",
                                            order: practicalOrder,
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
                                          })
                                        }
                                        fontSize="xs"
                                        fontWeight={800}
                                        display={isDisabledPracticalQuestion ? "none" : "block"}
                                        py="7"
                                        leftIcon={<AiOutlinePlus />}
                                        bg="white"
                                        color="orange"
                                        w="100%"
                                        border="0.5px solid lightGrey"
                                      >
                                        ADD QUESTION
                                      </Button>
                                    </Box>
                                  </div>
                                </Stack>
                                {provided.placeholder}
                              </>
                            )}
                          </Droppable>
                        </DragDropContext>
                      )}
                    </FieldArray>
                  </Stack>
                </Form>
              );
            }}
          </Formik>
        )}
      </div>
    </>
  );
}

export default PostLessonTab;
