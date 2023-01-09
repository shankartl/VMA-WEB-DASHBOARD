import { Box, Button, Flex, Grid, GridItem, Stack, Text, useBoolean } from "@chakra-ui/react";
import { Field, FieldArray, useField } from "formik";
import { React } from "react";
import { Draggable } from "react-beautiful-dnd";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { FiCopy } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import ConfirmationPopup from "../../common/modal/ConfirmationPopup";
import { FlushedInputField } from "../../formik";

const RenderQuestionComponents = ({ index, remove, values, insert }) => {
  const [field] = useField(`questions[${index}].type`);
  const [isOpenPopup, iopState] = useBoolean(false);

  function renderLikertScale() {
    return (
      <GridItem colSpan={{ base: "12", md: "7", lg: "7" }} order={{ base: "3", md: "2", lg: "2" }} px="3">
        <Box mb="3">
          <Box mb="3">
            <FlushedInputField
              isInline={false}
              direction="column"
              label="Question"
              name={`questions[${index}].question`}
              isRequired
              fontSize="xs"
            />
          </Box>
          <Grid templateColumns="repeat(10, 1fr)" gap="2">
            <FieldArray name={`questions[${index}].options`}>
              {(optionField) => (
                <>
                  {values?.questions[index].options?.length > 0 &&
                    values?.questions[index].options?.map((qo, oIndex) => {
                      return (
                        <GridItem colSpan={2} key={"option-" + oIndex}>
                          <Box mb="3">
                            <FlushedInputField
                              isInline={false}
                              direction="column"
                              label={`label ${oIndex + 1}`}
                              name={`questions[${index}].options.${oIndex}.label`}
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
    );
  }

  function renderMCQ() {
    return (
      <>
        <FlushedInputField
          isInline={false}
          direction="column"
          label="Question"
          name={`questions[${index}].question`}
          isRequired
          fontSize="xs"
        />
        <FieldArray name={`questions[${index}].options`}>
          {(optionField) => (
            <>
              {values?.questions[index].options?.length > 0 &&
                values?.questions[index].options.map((val, oIndex) => {
                  return (
                    <GridItem colSpan={7} key={"option-" + oIndex}>
                      <Box mb="3">
                        <Box display="flex" w="100%">
                          <Box w="60%">
                            <FlushedInputField
                              label={`Option${oIndex + 1}`}
                              isInline={false}
                              name={`questions[${index}].options.${oIndex}.label`}
                              fontSize="xs"
                            />
                          </Box>
                          <Box w="40%" display="flex" alignItems="end" justifyContent="space-between">
                            <Box px="2">
                              <div role="group" aria-labelledby="checkbox-group">
                                <label
                                  style={{
                                    color: values["questions"][index].options[oIndex].label?.length > 0 ? "black" : "gray",
                                  }}
                                >
                                  <Field
                                    disabled={values["questions"][index].options[oIndex].label?.length > 0 ? false : true}
                                    style={{ marginRight: "5px" }}
                                    type="checkbox"
                                    name={`questions[${index}].options.${oIndex}.is_correct`}
                                  />
                                  Correct answer
                                </label>
                              </div>
                            </Box>
                            <Box>{<AiOutlineClose onClick={() => optionField.remove(oIndex)} cursor="pointer" />}</Box>
                          </Box>
                        </Box>
                      </Box>
                    </GridItem>
                  );
                })}
              <Button
                fontSize="xs"
                leftIcon={<AiOutlinePlus />}
                bg="white"
                color="black"
                w="100%"
                border="0.5px solid lightGrey"
                onClick={() =>
                  optionField.push({
                    label: "",
                    is_correct: false,
                  })
                }
              >
                ADD OPTION
              </Button>
            </>
          )}
        </FieldArray>
      </>
    );
  }

  const renderComponent = () => {
    switch (field.value) {
      case "MCQ":
        return renderMCQ();

      case "LIKERT_SCALE":
        return renderLikertScale();
    }
  };

  return (
    <>
      <Draggable draggableId={`question${index}`} index={index}>
        {(provided) => (
          <Grid
            {...provided?.draggableProps}
            ref={provided?.innerRef}
            {...provided?.dragHandleProps}
            templateColumns="repeat(12, 1fr)"
            bg="greyBox"
            py="3"
            mb={5}
          >
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
                <Field name={`questions[${index}].type`} component="select">
                  <option value={""}>Select Type</option>
                  <option value={"MCQ"}>Multiple Choice</option>
                  <option value={"LIKERT_SCALE"}> Likert Scale</option>
                </Field>
              </Stack>
            </GridItem>
            <GridItem colSpan={{ base: "12", md: "7", lg: "7" }} order={{ base: "3", md: "2", lg: "2" }} px="3">
              {renderComponent()}
            </GridItem>
            <GridItem colSpan={{ base: "4", md: "2", lg: "2" }} order={{ base: "2", md: "3", lg: "3" }} px="2">
              <Flex justifyContent="center">
                <Box mr="1">
                  <FiCopy
                    name={`questionType[${index}].options`}
                    onClick={() => {
                      insert(index + 1, values?.questions[index]);
                    }}
                    cursor="pointer"
                  />
                </Box>
                <Box ml="1">
                  <RiDeleteBinLine onClick={() => iopState.on()} cursor="pointer" />
                </Box>
              </Flex>
            </GridItem>
          </Grid>
        )}
      </Draggable>
      <ConfirmationPopup
        isOpen={isOpenPopup}
        onClose={iopState.off}
        onSubmit={() => {
          remove(index);
        }}
        header={"Are you sure you want to delete this question?"}
        description={"This cannot be undone."}
        isLoading={false}
      />
    </>
  );
};

export default RenderQuestionComponents;
