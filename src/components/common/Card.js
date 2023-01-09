import React from "react";
import { Box, Flex, Center, Text } from "@chakra-ui/react";

const Card = (props) => {
  return (
    <Box gap="md" bg="white" p="1em" borderRadius="0.5em">
      <Flex justifyContent="space-between">
        <Box>
          <Text fontSize="lg" mb={2}>
            {props.title}
          </Text>
          <Flex>
            <Text fontSize="sm" color="lightGreen">
              {props.value}
            </Text>
            <Text ml={1} fontSize="sm">
              {props.description}
            </Text>
          </Flex>
        </Box>
        <Box h="4em" w="4em" p="2" pt={"1.2em"} bg="primary.500" color={"white"} borderRadius="0.5em">
          <Center>
            <Text fontSize="sm">{props.dataNum}</Text>
          </Center>
        </Box>
      </Flex>
    </Box>
  );
};

export default Card;
