import { Box, Flex, Grid, GridItem, Image, Text } from "@chakra-ui/react";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { BsEmojiLaughing } from "react-icons/bs";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Select from "react-select";
import UserFeedback from "./UserFeedback";
const SingleUserResponse = () => {
  const options = [
    { value: "noor91.ahmed@gmail.com", label: "Noor Ahmed", image: "https://placekitten.com/100/100" },
    { value: "qwerty.ahmed@gmail.com", label: "qwerty", image: "https://placekitten.com/100/100" },
    { value: "jose@gmail.com", label: "jose", image: "https://placekitten.com/100/100" },
    { value: "noor91.ed@gmail.com", label: "Noor Ahmed", image: "https://placekitten.com/100/100" },
    { value: "qwerty.ahed@gmail.com", label: "qwerty", image: "https://placekitten.com/100/100" },
    { value: "jose@gmil.com", label: "jose", image: "https://placekitten.com/100/100" },
    { value: "oor91.ahmed@gmail.com", label: "Noor Ahmed", image: "https://placekitten.com/100/100" },
    { value: "qwerty.ahmed@gmail.com", label: "qwerty", image: "https://placekitten.com/100/100" },
    { value: "jose@gmail.co", label: "jose", image: "https://placekitten.com/100/100" },
    { value: "noor91.ahmed@gmail.om", label: "Noor Ahmed", image: "https://placekitten.com/100/100" },
    { value: "qwerty.ahed@gmail.com", label: "qwerty", image: "https://placekitten.com/100/100" },
    { value: "josegmai.com", label: "jose", image: "https://placekitten.com/100/100" },
  ];
  // const res = [`Very Bad`, `Bad`, `Okay `, `Good `, `Very good `];
  const [userIndex, setUserIndex] = useState(0);
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    setSelectedValue(options[userIndex]);
  }, [userIndex]);

  const res = [
    {
      id: 1,
      emoji: <BsEmojiLaughing />,
      option: "Very Bad",
    },
    {
      id: 2,
      emoji: <BsEmojiLaughing />,
      option: "Bad",
    },
    {
      id: 3,
      emoji: <BsEmojiLaughing />,
      option: "Okay",
    },
    {
      id: 4,
      emoji: <BsEmojiLaughing />,
      option: "Good",
    },
    {
      id: 5,
      emoji: <BsEmojiLaughing />,
      option: "Very good",
    },
  ];

  const handleUserIndex = (e) => {
    const index = options.findIndex((o) => o.value === e.value);
    setUserIndex(index);
  };

  const handleBackwardNavigation = () => {
    setUserIndex(userIndex - 1);
  };

  const handleForwardNavigation = () => {
    setUserIndex((prev) => prev + 1);
  };

  return (
    <Box>
      <Flex
        // bg="white"
        border="1px solid lightGrey"
        borderRadius="0 0 5px 5px"
        px="3"
        py="5"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box w={{ base: "60%", md: "40%", lg: "40%" }}>
          <Select
            borderRadius="5em"
            options={options}
            value={selectedValue !== null ? selectedValue : options[0]}
            formatOptionLabel={(option, i) => (
              <Box display="flex">
                <Box mt="1">
                  <Image h="2em" w="2em" borderRadius="full" src={option.image} alt="country-image" />
                </Box>
                <Box ml="2">
                  <Text color="orange" fontSize="sm" fontWeight="bold">
                    {option.label}
                  </Text>
                  <Text color="gray.500" fontSize="xs">
                    {option.value}
                  </Text>
                </Box>
              </Box>
            )}
            onChange={(e) => handleUserIndex(e)}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: "lightGrey",
                primary: "orange.500",
              },
            })}
          />
        </Box>
        <Box>
          <Box display="flex" alignItems="center" gap="1">
            {userIndex + 1 > 1 && <IoIosArrowBack onClick={handleBackwardNavigation} />}
            <Text fontWeight="bold">{userIndex + 1 && userIndex + 1}</Text>/<Text>{options.length}</Text>
            {options.length > userIndex + 1 && <IoIosArrowForward onClick={handleForwardNavigation} />}
          </Box>
        </Box>
      </Flex>
      <UserFeedback res={res} />
      <UserFeedback res={res} />
    </Box>
  );
};

export default SingleUserResponse;
