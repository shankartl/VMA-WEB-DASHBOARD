import { Box, Button, Input, InputGroup, InputRightElement, Text } from "@chakra-ui/react";
import { ErrorMessage, FieldArray } from "formik";
import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";

const AnswerField = (props) => {
  const [options, setOptions] = useState([]);
  console.log(props, "props");
  console.log(options, "options");

  useEffect(() => {
    setOptions(props.options);
  }, [options]);
  console.log(options, "use effect options");

  return (
    <Box>
      {options.length > 0 &&
        options.map((option, index) => {
          console.log(option, "Map OPtion");
          return (
            <>
              {({ options }) =>
                console.log(
                  options,
                  "Values"
                )(
                  <FieldArray
                    name="options"
                    render={(arrayHelpers) => (
                      <>
                        <Text fontSize="xs" color="gray" htmlFor={option.value1}>
                          {`Option${index + 1}`}
                        </Text>
                        <InputGroup>
                          <Input variant="flushed" name={option.value1} type="text" fontSize="sm" />
                          <InputRightElement>
                            {<AiOutlineClose onClick={() => arrayHelpers.remove(index)} cursor="pointer" />}
                          </InputRightElement>
                        </InputGroup>
                        <ErrorMessage name={option.value1} component="div" className="field-error" />
                        <Box mt="4">
                          <Button
                            onClick={() => arrayHelpers.push({ value1: "" })}
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
                      </>
                    )}
                  />
                )
              }
            </>
          );
        })}
    </Box>
  );
};

export default AnswerField;
