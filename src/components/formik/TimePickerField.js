import React from "react";
import { Flex, FormControl, FormLabel, FormErrorMessage, Input, Stack } from "@chakra-ui/react";
import { FastField, getIn } from "formik";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";

function TimePicker(props) {
  return (
    <FastField name={props.name}>
      {({ field, form }) => (
        <Flex direction={props.direction} {...props.containerStyle}>
          <FormControl
            isInvalid={getIn(form.errors, props.name) && getIn(form.touched, props.name)}
            w={props.w}
            isRequired={props.isRequired}
          >
            <Stack isInline={props.isInline} width="100%" align="center" spacing={0}>
              {props.showHeader && (
                <FormLabel w={"100%"} htmlFor={props.name} isRequired={props.isRequired} ml="1em">
                  {props.label}
                </FormLabel>
              )}
              <Stack w="100%">
                <DatePicker
                  {...props}
                  onChange={(time) => {
                    form.setFieldValue(props.name, time);
                    props.onChange && props.onChange(time);
                  }}
                  selected={field.value || null}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  customInput={<Input {...field} />}
                />
              </Stack>
              <FormErrorMessage>{getIn(form.errors, props.name)}</FormErrorMessage>
            </Stack>
          </FormControl>
        </Flex>
      )}
    </FastField>
  );
}

TimePicker.defaultProps = {
  label: "Label",
  isRequired: false,
  direction: { xs: "column", md: "row" },
  showHeader: true,
  containerStyle: {},
};

TimePicker.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  showHeader: PropTypes.bool,
  containerStyle: PropTypes.object,
};

export default TimePicker;
