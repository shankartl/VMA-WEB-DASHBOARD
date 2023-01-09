import React, { useContext, useEffect, useRef } from "react";
import { Box, Button, Center, Grid, GridItem, HStack, Input, Spinner, Stack, Text, useBoolean } from "@chakra-ui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { AiOutlineFile, AiOutlinePlus } from "react-icons/ai";
import RenderSurveryQuestions from "./RenderSurveryQuestions";
import useCustomToastr from "../../../utils/useCustomToastr";
import api from "../../../services/api";
import {
  CREATE_PRE_COURSE_THEORY,
  GET_ASSESSMENT_BY_TYPE,
  GET_PRE_COURSE_THEORY_QUESTIONS,
  UPDATE_QUESTIONS,
} from "../../../constants/apiRoutes";
import { getSurveyAssessmentId, toTitleCase } from "../../../utils/commonUtil";
import { SessionContext } from "../../context/SessionContext";
import { FlushedInputField } from "../../formik";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { PRACTICAL_QUESTION_TYPE } from "../../../constants/common";

const defaultValues = {
  questions: [],
};

function SurveyResponse({ placement = "SURVEY" }) {
  const [initialValues, setInitialValues] = React.useState([]);
  const sessionContext = useContext(SessionContext);
  const { session } = sessionContext;
  const toast = useCustomToastr();
  const [isDisabledAddQuestion, idaqState] = useBoolean(false);
  const [isSubmitting, isState] = useBoolean(false);
  const assessmentId = getSurveyAssessmentId(session);
  const [isFetchingQuestions, ifqState] = useBoolean(false);

  const onDragEnd = (dragedItem, values, initialFormData) => {
    setInitialValues(values);
    if (!dragedItem?.destination) {
      return;
    } else {
      const dItem = Array.from(values?.questions);
      const [reOrderedItem] = dItem.splice(dragedItem?.source.index, 1);
      dItem.splice(dragedItem?.destination.index, 0, reOrderedItem);
      const assessmentQuestions = [];
      initialFormData.assessments.forEach((assessment) => {
        const assQuestion = [];
        assessment.questions.forEach((aq) => {
          assQuestion.push(aq);
        });
        if (assessment?.id === values?.id) {
          assessmentQuestions.push({
            ...assessment,
            questions: dItem,
          });
        } else {
          assessmentQuestions.push({
            ...assessment,
          });
        }
      });
      setInitialValues({ assessments: assessmentQuestions });
    }
  };

  const getListStyle = (isDraggingOver) => {
    if (isDraggingOver) {
      idaqState.on();
    } else {
      idaqState.off();
    }
  };

  const onSubmit = async (values) => {
    try {
      isState.on();
      const assessmentQuestions = [];
      let metaData = {};
      let practicalAssessmentId;

      values.assessments.forEach((a) => {
        const questionCreatePayload = {
          assessmentId: a.id,
          questions: a.questions.map((aq, i) => ({
            question: aq.question,
            options: aq.type === "TEXT" ? [] : aq.options,
            type: aq.type,
            order: i + 1,
          })),
        };
        if (a.type === PRACTICAL_QUESTION_TYPE) {
          metaData = { description: a?.description, metadata: { ...a.metadata } };
          practicalAssessmentId = a.id;
        }
        assessmentQuestions.push(questionCreatePayload);
      });

      await Promise.all(
        assessmentQuestions.map(async (aq) => {
          return api.post(CREATE_PRE_COURSE_THEORY(aq.assessmentId), { questions: aq.questions });
        })
      );
      await api.put(UPDATE_QUESTIONS(practicalAssessmentId), { ...metaData });

      toast.showSuccess({ description: `Questions Saved Successfully` });
    } catch (error) {
      toast.showError({ description: `${error?.message}` });
    } finally {
      isState.off();
    }
  };

  const fetchAssessmentQuestions = async () => {
    try {
      ifqState.on();
      const response = await api.get(GET_ASSESSMENT_BY_TYPE(placement, session));
      const fetchedQuestions = response?.assessments;
      setInitialValues({ assessments: fetchedQuestions });
      return response;
    } catch (error) {
      toast.showError({ description: `${error?.message}` });
    } finally {
      ifqState.off();
    }
  };

  useEffect(() => {
    fetchAssessmentQuestions();
  }, [session]);

  function renderFormSection(assessment, assessmentIndex, values) {
    const assessmentKeyPrefix = `assessments.${assessmentIndex}`;

    return (
      <Box key={`form-section-${assessmentIndex}`}>
        <Form>
          <Stack mb={4}>
            <Text>{toTitleCase(assessment.type)}</Text>
            <Text fontSize={"x-small"}>Section description</Text>
            <Field as={Input} name={`${assessmentKeyPrefix}.description`} variant="flushed" placeholder="Add a description..." />
            {/* post course description */}
            {assessment?.type === PRACTICAL_QUESTION_TYPE ? (
              <Grid templateColumns="repeat(5, 1fr)" gap={20}>
                <GridItem colSpan={3}>
                  <Box>
                    <Stack>
                      <FlushedInputField
                        isInline={false}
                        direction="column"
                        name={`${assessmentKeyPrefix}.metadata.piece_name`}
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
                        name={`${assessmentKeyPrefix}.metadata.tuning`}
                        placeholder={`For example: E, A, D, G, B, E`}
                        fontSize="xs"
                      />
                    </Stack>
                    <Stack>
                      <FlushedInputField
                        isInline={false}
                        direction="column"
                        label="Key"
                        name={`${assessmentKeyPrefix}.metadata.key`}
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
                          // onChange={(e) => {
                          //   setMusicSheet(e.target.files);
                          // }}
                        />
                      </Button>
                    </HStack>
                    <Text color={"gray"} fontSize={"xs"}>
                      Supported file types: png, jpg, jpeg
                    </Text>
                  </Box>
                </GridItem>
              </Grid>
            ) : (
              ""
            )}
          </Stack>
          <FieldArray name={`${assessmentKeyPrefix}.questions`}>
            {({ remove, push, insert }) => (
              <DragDropContext onDragEnd={(items) => onDragEnd(items, assessment, values)}>
                <Droppable droppableId="questionContainer">
                  {(provided, snapshot) => (
                    <>
                      <Stack style={getListStyle(snapshot?.isDraggingOver)} {...provided.droppableProps} ref={provided.innerRef}>
                        {assessment?.questions?.length > 0 &&
                          assessment?.questions?.map((value, index) => {
                            return (
                              <div key={`questionContainer-${index}`}>
                                <RenderSurveryQuestions
                                  placement={placement}
                                  index={index}
                                  remove={remove}
                                  values={assessment}
                                  insert={insert}
                                  keyPrefix={assessmentKeyPrefix}
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
                            leftIcon={<AiOutlinePlus />}
                            display={isDisabledAddQuestion ? "none" : "block"}
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
      </Box>
    );
  }

  function renderFormSections() {
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          onSubmit(values);
        }}
        enableReinitialize={true}
      >
        {({ values }) => {
          return (
            <FieldArray
              name={"assessments"}
              render={() => {
                return values.assessments?.map((assessment, index) => {
                  return renderFormSection(assessment, index, values);
                });
              }}
            />
          );
        }}
      </Formik>
    );
  }

  return (
    <>
      {isFetchingQuestions ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        renderFormSections()
      )}
    </>
  );
}

export default SurveyResponse;
