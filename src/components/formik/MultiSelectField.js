import React from "react";
import { FormControl, FormLabel, FormErrorMessage, Flex, Text } from "@chakra-ui/react";
import { FastField, getIn } from "formik";
import PropTypes from "prop-types";
import CreatableSelect from "react-select/creatable";

function MultiSelectField(props) {
  const { options = [], enableSelectAll = false } = props;

  const getDefaultFieldValue = (values) => {
    if (!values) return;
    if (!Array.isArray(values)) values = [values];

    const valueArray = [];
    for (const value of values) {
      valueArray.push(undefined);
      if (typeof value === "object") {
        valueArray.push(value);
        continue;
      }
      valueArray.push(options.find((o) => o.value === value));
    }

    return valueArray.filter((v) => !!v);
  };

  return (
    <FastField name={props.name}>
      {({ field, form }) => {
        const fieldValue = getDefaultFieldValue(field.value);

        return (
          <Flex direction={props.direction} {...props.containerStyle}>
            <FormControl
              isInvalid={getIn(form.errors, props.name) && getIn(form.touched, props.name)}
              w={"100%"}
              isRequired={props.isRequired}
            >
              {props.showHeader && (
                <Flex direction="row" align="center" justifyContent="space-between">
                  <FormLabel w={"100%"} htmlFor={props.name}>
                    {props.label}
                  </FormLabel>
                  {enableSelectAll && (
                    <Text
                      color="blue.500"
                      fontSize="0.8em"
                      whiteSpace="nowrap"
                      mb="5px"
                      _hover={{ cursor: "pointer" }}
                      isDisabled={props.isDisabled}
                      onClick={() =>
                        form.setFieldValue(
                          props.name,
                          options.map((o) => o.value)
                        )
                      }
                    >
                      Select All
                    </Text>
                  )}
                </Flex>
              )}
              <CreatableSelect
                value={fieldValue}
                instanceId={props.name}
                isMulti
                fontSize="sm"
                name={props.name}
                options={props.options}
                onChange={(selectedValues) => {
                  form.setFieldValue(props.name, (selectedValues && selectedValues.map((el) => el.value)) || []);
                }}
                isDisabled={props.isDisabled}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 3,
                  }),
                }}
              />
              <FormErrorMessage>{getIn(form.errors, props.name)}</FormErrorMessage>
            </FormControl>
          </Flex>
        );
      }}
    </FastField>
  );
}

MultiSelectField.defaultProps = {
  label: "",
  isRequired: false,
  isDisabled: false,
  options: [],
  direction: { xs: "column", md: "row" },
  showHeader: true,
  containerStyle: {},
};

MultiSelectField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  options: PropTypes.array.isRequired,
  showHeader: PropTypes.bool,
  containerStyle: PropTypes.object,
};

export default MultiSelectField;
