import React from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { HiLocationMarker } from "react-icons/hi";
import PropTypes from "prop-types";

const LoactionCard = (props) => {
  const { states, country, containerStyle = {} } = props;

  return (
    <Box p="1em" bg="lightGrey" borderRadius="0.5em" h="5.5em" {...containerStyle}>
      <Flex>
        <HiLocationMarker fontSize="1.5em" />
        <Heading fontSize="xl">{country}</Heading>
      </Flex>
      <Text fontSize="md" mt="0.5em">
        {states?.join(" | ")}
      </Text>
    </Box>
  );
};

LoactionCard.propTypes = {
  states: PropTypes.array,
  country: PropTypes.string,
};
LoactionCard.defaultProps = {
  states: [],
  country: "",
};

export default LoactionCard;
