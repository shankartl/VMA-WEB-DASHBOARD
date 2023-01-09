import React from "react";
import ReactDOM from "react-dom";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Select,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { AiOutlineFile, AiOutlinePlus } from "react-icons/ai";
import { FiCopy } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { FlushedInputField } from "../formik";
import * as Yup from "yup";
import { questionInitialValues, formikInitialValues } from "../utils/InitialquestionValues";
import { useState } from "react";
import DeleteModal from "../utils/DeleteModal";
import { useEffect } from "react";
import AssesmentSaveModal from "../utils/AssesmentSaveModal";

const initialValues = formikInitialValues;

const schema = Yup.object().shape({
  questionType: Yup.array()
    .of(
      Yup.object().shape({
        question: Yup.string().min(2, "too short").required("Required"),
      })
    )
    .required(""),
});

const SurveyForm = (props) => {
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
  const { isOpen: isOpenSaveAssesment, onOpen: onOpenSaveAssesment, onClose: onCloseSaveAssesment } = useDisclosure();
  const [questionType, setQuestionType] = useState("c0");
  const [isDirty, setIsDirty] = useState(false);
  const deleteQuestion = (remove, index) => {
    onOpenDelete();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={async (values) => {
        onOpenSaveAssesment();
      }}
    >
      {(props) => {
        return (
          <Form>
            <FieldArray name="questionType">
              {({ insert, remove, push }) => (
                <>
                  {props.values.questionType.length > 0 &&
                    props.values.questionType.map((value, index) => (
                      <Box className="row" key={index}>
                        <Grid templateColumns="repeat(12, 1fr)" bg="greyBox" py="3" mb="5">
                          <GridItem
                            colSpan={{ base: "8", md: "3", lg: "3" }}
                            order={{ base: "1", md: "1", lg: "1" }}
                            px="3"
                            borderRight="1px solid lightGrey"
                          >
                            <Text fontSize="xs" color="gray" mb="1">
                              Question Type
                            </Text>
                            <Stack>
                              <Select fontSize="sm" size="md" bg="white">
                                <option value="Linkert Scale">Linkert Scale</option>
                              </Select>
                            </Stack>
                          </GridItem>
                          <GridItem colSpan={{ base: "12", md: "7", lg: "7" }} order={{ base: "3", md: "2", lg: "2" }} px="3">
                            <Box mb="3">
                              <Box mb="3">
                                <FlushedInputField
                                  isInline={false}
                                  direction="column"
                                  label="Question"
                                  name={`questionType[${index}].question`}
                                  isRequired
                                  fontSize="xs"
                                  onChange={setIsDirty(true)}
                                />
                              </Box>
                              <Grid templateColumns="repeat(10, 1fr)" gap="2">
                                <FieldArray name={`questionType[${index}].options`}>
                                  {(optionField) => (
                                    <>
                                      {props.values["questionType"][index].options?.length > 0 &&
                                        props.values["questionType"][index].options.map((qo, oIndex) => {
                                          return (
                                            <GridItem colSpan={2} key={"option-" + oIndex}>
                                              <Box mb="3">
                                                <FlushedInputField
                                                  isInline={false}
                                                  direction="column"
                                                  label="label"
                                                  name={`questionType[${index}].options.${oIndex}.value`}
                                                  isRequired
                                                  fontSize="xs"
                                                />
                                              </Box>
                                            </GridItem>
                                          );
                                        })}
                                    </>
                                  )}
                                </FieldArray>
                              </Grid>
                            </Box>
                          </GridItem>
                          <GridItem colSpan={{ base: "4", md: "2", lg: "2" }} order={{ base: "2", md: "3", lg: "3" }} px="2">
                            <Flex justifyContent="center">
                              <Box mr="1">
                                <FiCopy onClick={() => push(`questionType[${index}].question`)} cursor="pointer" />
                              </Box>
                              <Box ml="1">
                                <RiDeleteBinLine onClick={() => remove(index)} cursor="pointer" />
                              </Box>
                            </Flex>
                          </GridItem>
                        </Grid>
                      </Box>
                    ))}
                  <Box>
                    <Button
                      position="absolute"
                      top="0"
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
                    <AssesmentSaveModal isOpen={isOpenSaveAssesment} onClose={onCloseSaveAssesment} />
                    <Button
                      onClick={() => push(questionInitialValues)}
                      fontSize="xs"
                      fontWeight={800}
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
                </>
              )}
            </FieldArray>
            {prompt}
          </Form>
        );
      }}
    </Formik>
  );
};
export default SurveyForm;
