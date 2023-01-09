import React from "react";
import { Flex, Image, Text } from "@chakra-ui/react";

function ImageIcon(props) {
  return (
    <Flex>
      <Image src={props.url} maxW="4em" borderRadius="5px" />
      <Text ml={3}>{props.name}</Text>
    </Flex>
  );
}

ImageIcon.defaultProps = {
  url: "https://via.placeholder.com/150",
};

export default ImageIcon;
