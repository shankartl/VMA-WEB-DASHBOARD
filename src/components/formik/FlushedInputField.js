import React from "react";
import { FormControl, FormLabel, Input, FormErrorMessage, Flex, Stack } from "@chakra-ui/react";
import { FastField, Field, getIn } from "formik";
import PropTypes from "prop-types";

function FlushedInputField(props) {
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
                {props.showHeader && (
                  <FormLabel w={"100%"} fontWeight="normal" mx="2" htmlFor={props.name} color={props.color} fontSize={props.fontSize}>
                    {props.label}
                  </FormLabel>
                )}
                <Stack w="100%">
                  <Input
                    width="100%"
                    variant="flushed"
                    {...field}
                    id={props.id || props.name}
                    disabled={props.isDisabled}
                    color="black"
                    fontSize="sm"
                    borderColor="gray.300"
                    borderWidth="0 0 2px"
                    fontWeight="bold"
                    placeholder={props.placeholder}
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

FlushedInputField.defaultProps = {
  label: "Label",
  isRequired: false,
  isDisabled: false,
  isInline: true,
  direction: { xs: "column", md: "row" },
  showHeader: true,
  containerStyle: {},
  backgroundColor: "white",
  color: "gray",
};

FlushedInputField.propTypes = {
  //   label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  showHeader: PropTypes.bool,
  containerStyle: PropTypes.object,
  mode: PropTypes.string,
  rightIcon: PropTypes.element,
};

export default FlushedInputField;
