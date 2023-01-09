import { Flex, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Stack, Text, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { Button as ChakraButton } from "@chakra-ui/react";
import { BsFilter } from "react-icons/bs";

const Filter = (props) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { filter, setFilter, handleFilterChange } = props;

  const handleClick = () => {
    onClose();
    handleFilterChange && handleFilterChange();
  };

  const selectedStyles = {
    variant: "outline",
    border: "1px",
    borderColor: "black",
    fontWeight: "normal",
    _hover: { bg: "white" },
    borderRadius: "0.5em",
    w: "fit-content",
  };

  const normalStyles = {
    fontWeight: "normal",
    _hover: { bg: "white" },
    bg: "white",
    borderRadius: "0.5em",
    w: "fit-content",
  };

  const styles = {
    all: filter === "all" ? selectedStyles : normalStyles,
    year: filter === "year" ? selectedStyles : normalStyles,
    month: filter === "month" ? selectedStyles : normalStyles,
    week: filter === "week" ? selectedStyles : normalStyles,
  };

  return (
    <Popover placement="bottom-end" closeOnBlur={true} isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <Flex justifyContent="end">
        <PopoverTrigger>
          <ChakraButton leftIcon={<BsFilter />} colorScheme="primary" variant="outline" border="1px" _hover={{ bg: "lightgray" }}>
            Filter
          </ChakraButton>
        </PopoverTrigger>
      </Flex>
      <PopoverContent w="100%" h="100%">
        <PopoverArrow />
        <PopoverBody p="2.5em" boxShadow="2xl" borderRadius="0.5em">
          <Text fontSize="1.3em" mb="2" fontWeight="medium">
            Time
          </Text>
          <Stack direction={["column", "row"]} spacing={2}>
            <ChakraButton {...styles.all} onClick={() => setFilter("all")}>
              Overall
            </ChakraButton>
            <ChakraButton {...styles.year} onClick={() => setFilter("year")}>
              This year
            </ChakraButton>
            <ChakraButton {...styles.month} onClick={() => setFilter("month")}>
              This month
            </ChakraButton>
            <ChakraButton {...styles.week} onClick={() => setFilter("week")}>
              This week
            </ChakraButton>
          </Stack>
          <Flex mt="6" justifyContent="end">
            <ChakraButton
              variant="outline"
              paddingY="0.6em"
              paddingX="1em"
              color="white"
              bg="darkBlue.500"
              borderRadius="0.5em"
              _hover={{ bg: "darkBlue.500" }}
              onClick={handleClick}
            >
              Done
            </ChakraButton>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default Filter;
