import React from "react";
import { Stack, Switch as ChakraSwitch } from "@chakra-ui/react";

const Switch = (props) => {
  return (
    <Stack align="center" direction="row">
      <ChakraSwitch colorScheme="intelPurple" isChecked={props.isChecked} onChange={(e) => props.onChange && props.onChange(e)} />
    </Stack>
  );
};

export default Switch;
