import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Flex,
  Stack,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { FastField, Field, getIn } from "formik";
import PropTypes from "prop-types";
import { AiFillEye, AiFillEyeInvisible, AiOutlineEyeInvisible } from "react-icons/ai";
import { GiConsoleController } from "react-icons/gi";
import { useEffect } from "react";
import { Text } from "@chakra-ui/react";
import { Button } from "../common";

function PhoneNumberField(props) {
  return (
    <Field name={props.name}>
      {({ field, form }) => {
        return (
          <Flex direction={props.direction} align="center" {...props.containerStyle}>
            <FormControl
              isInvalid={getIn(form.errors, props.name) && getIn(form.touched, props.name)}
              isRequired={props.isRequired}
              w={"100%"}
            >
              <Stack isInline={props.isInline} width="100%" align="center" spacing={0}>
                <FormLabel w={"100%"} htmlFor={props.name} mx="2" color={props.color} fontSize="xs" fontWeight="normal">
                  {props.label}
                </FormLabel>

                <Stack w="100%">
                  <Input
                    {...field}
                    type="tel"
                    id={props.id || props.name}
                    disabled={props.isDisabled}
                    color={props.color}
                    backgroundColor={props.backgroundColor}
                    fontSize="sm"
                  />

                  <FormErrorMessage>{getIn(form.errors, props.name)}</FormErrorMessage>
                </Stack>
              </Stack>
            </FormControl>
          </Flex>
        );
      }}
    </Field>
  );
}

PhoneNumberField.defaultProps = {
  label: "Label",
  isRequired: false,
  isDisabled: false,
  isInline: true,
  direction: { xs: "column", md: "row" },
  showHeader: true,
  containerStyle: {},
  backgroundColor: "white",
  color: "black",
};

PhoneNumberField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  showHeader: PropTypes.bool,
  containerStyle: PropTypes.object,
  mode: PropTypes.string,
  rightIcon: PropTypes.element,
};

export default PhoneNumberField;
