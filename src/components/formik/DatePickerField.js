import React from "react";
import { Flex, FormControl, FormLabel, FormErrorMessage, Input, Stack, InputGroup, InputRightElement } from "@chakra-ui/react";
import { FastField, getIn } from "formik";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import { MdOutlineDateRange } from "react-icons/md";

function DatePickerField(props) {
  const current = new Date();
  current.setFullYear(current.getFullYear() - 5);
  return (
    <FastField name={props.name}>
      {({ field, form }) => (
        <Flex direction={props.direction} align={props.align} {...props.containerStyle}>
          <FormControl
            isInvalid={getIn(form.errors, props.name) && getIn(form.touched, props.name)}
            w={props.w}
            isRequired={props.isRequired}
          >
            <Stack isInline={props.isInline} width="100%" spacing={0}>
              {props.showHeader && (
                <FormLabel htmlFor={props.name} w={props.w} fontSize="xs" fontWeight="normal">
                  {props.label}
                </FormLabel>
              )}
              <Stack w="100%">
                <InputGroup>
                  <DatePicker
                    {...props}
                    onChange={(time) => {
                      form.setFieldValue(props.name, time);
                      props.onChange && props.onChange(time);
                    }}
                    maxDate={current}
                    selected={field.value || null}
                    customInput={<Input autoComplete="off" {...field} />}
                    w={"100%"}
                  />
                  <InputRightElement>{<MdOutlineDateRange />}</InputRightElement>
                </InputGroup>
                <FormErrorMessage>{getIn(form.errors, props.name)}</FormErrorMessage>
              </Stack>
            </Stack>
          </FormControl>
        </Flex>
      )}
    </FastField>
  );
}

DatePickerField.defaultProps = {
  label: "Label",
  isRequired: false,
  isDisabled: false,
  direction: { xs: "column", md: "row" },
  showHeader: true,
  containerStyle: {},
  dateFormat: "dd/MM/yyyy",
  timeFormat: "hh:mm a",
  showTimeSelect: false,
};

DatePickerField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  showHeader: PropTypes.bool,
  containerStyle: PropTypes.object,
  direction: PropTypes.string,
};

export default DatePickerField;
