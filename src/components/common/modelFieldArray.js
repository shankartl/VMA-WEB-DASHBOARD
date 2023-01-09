import React from "react";
import { Formik, Form, FieldArray, ErrorMessage } from "formik";
import { Box, Button, Flex, Grid, GridItem, Input, InputGroup, InputRightElement, Select, Stack, Text } from "@chakra-ui/react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { FiCopy } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import AnswerField from "./AnswerField";

const initialValues = {
  questionType: [
    {
      question: "",
      options: [{ value1: "" }],
    },
  ],
};

const FieldArrayExample = () => (
  <div>
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        await new Promise((r) => setTimeout(r, 500));
        alert(JSON.stringify(values, null, 2));
      }}
    >
      {({ values }) => (
        <Form>
          <FieldArray name="questionType">
            {({ insert, remove, push }) => (
              <div>
                {values.questionType.length > 0 &&
                  values.questionType.map((value, index) => (
                    <div className="row" key={index}>
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
                              <option value="lesson1">Multiple Choice</option>
                              <option value="lesson2">Paragraph answer</option>
                              <option value="lesson2">Audio question</option>
                            </Select>
                          </Stack>
                        </GridItem>
                        <GridItem colSpan={{ base: "12", md: "7", lg: "7" }} order={{ base: "3", md: "2", lg: "2" }} px="3">
                          <Box mb="3">
                            <Box mb="3">
                              <Text fontSize="xs" color="gray">
                                Question
                              </Text>
                              <Input variant="flushed" name={`questionType[${index}].question`} />
                            </Box>
                            {/* {values.questionType[index].options.map((option, index) => {
                              console.log(option, index, "indddddddddddddddddddddddd");
                              return (
                                <>
                                  <FieldArray name="questionType">
                                    <Text fontSize="xs" color="gray" htmlFor={`option.value1`}>
                                      {`Option${index + 1}`}
                                    </Text>
                                    <InputGroup>
                                      <Input variant="flushed" name={`option.value1`} type="text" fontSize="sm" />
                                      <InputRightElement>
                                        {<AiOutlineClose onClick={() => remove(index)} cursor="pointer" />}
                                      </InputRightElement>
                                    </InputGroup>
                                    <ErrorMessage name={`option.value1`} component="div" className="field-error" />
                                    <Box mt="4">
                                      <Button
                                        onClick={() => push({ value1: "" })}
                                        fontSize="xs"
                                        leftIcon={<AiOutlinePlus />}
                                        bg="white"
                                        color="black"
                                        w="100%"
                                        border="0.5px solid lightGrey"
                                      >
                                        ADD OPTION
                                      </Button>
                                    </Box>
                                  </FieldArray>
                                </>
                              );
                            })} */}
                            {/* <AnswerField initialValues={value.options} /> */}
                          </Box>
                        </GridItem>
                        <GridItem colSpan={{ base: "4", md: "2", lg: "2" }} order={{ base: "2", md: "3", lg: "3" }} px="2">
                          <Flex justifyContent="center">
                            <Box mr="1">
                              <FiCopy />
                            </Box>
                            <Box ml="1">
                              <RiDeleteBinLine onClick={() => remove(index)} cursor="pointer" />
                            </Box>
                          </Flex>
                        </GridItem>
                      </Grid>
                    </div>
                  ))}

                <Box>
                  <Button
                    onClick={() => push({ question: "", options: [{ value1: "" }] })}
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
              </div>
            )}
          </FieldArray>
        </Form>
      )}
    </Formik>
  </div>
);

export default FieldArrayExample;
