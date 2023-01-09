import React from "react";
import { Button as ChakraButton } from "@chakra-ui/react";
import { HiPencil } from "react-icons/hi";

const Button = (props) => {
  return (
    <ChakraButton
      leftIcon={<HiPencil />}
      color="primary.500"
      variant="outline"
      border="2px"
      borderColor="primary.500"
      _hover={{ bg: "lightgray" }}
      {...props}
    >
      {props.children || "EDIT"}
    </ChakraButton>
  );
};

Button.defaultProps = {
  borderRadius: "0.5em",
};

export default Button;
