import React from "react";
import { FormControl, FormLabel, Input, FormErrorMessage, Flex, Stack } from "@chakra-ui/react";
import { FastField, getIn } from "formik";
import PropTypes from "prop-types";

function InputField(props) {
  return (
    <FastField name={props.name}>
      {({ field, form }) => {
        return (
          <Flex direction={props.direction} align="center" {...props.containerStyle}>
            <FormControl
              isInvalid={getIn(form.errors, props.name) && getIn(form.touched, props.name)}
              isRequired={props.isRequired}
              w={"100%"}
            >
              <Stack isInline={props.isInline} width="100%" align="center" spacing={0}>
                {props.showHeader && (
                  <FormLabel w={"100%"} fontWeight="normal" htmlFor={props.name} fontSize="xs" mx="2" color={props.color}>
                    {props.label}
                  </FormLabel>
                )}
                <Stack w="100%">
                  <Input
                    autoComplete="off"
                    w="100%"
                    {...field}
                    id={props.id || props.name}
                    disabled={props.isDisabled}
                    placeholder={props.isAdmin ? "" : props.placeholder || props.label}
                    color={props.color}
                    fontSize="sm"
                    backgroundColor={props.backgroundColor}
                  />
                  <FormErrorMessage>{getIn(form.errors, props.name)}</FormErrorMessage>
                </Stack>
              </Stack>
            </FormControl>
          </Flex>
        );
      }}
    </FastField>
  );
}

InputField.defaultProps = {
  label: "Label",
  isRequired: false,
  isDisabled: false,
  isInline: true,
  direction: { xs: "column", md: "row" },
  showHeader: true,
  containerStyle: {},
  backgroundColor: "white",
  color: "#0F2837",
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  showHeader: PropTypes.bool,
  containerStyle: PropTypes.object,
  mode: PropTypes.string,
  rightIcon: PropTypes.element,
};

export default InputField;
