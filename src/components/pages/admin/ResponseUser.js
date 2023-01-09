import { Box, Grid, GridItem, Image, Spacer, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Select from "react-select";
import AnswerBox from "../../common/AnswerBox";
import Pagenation from "../../common/Pagenation";
import Question from "../../common/Question";

const ResponseUser = () => {
  const options = [
    { value: "nsdoor91.ahmed@gmail.com", label: "Noor Ahmed", image: "https://placekitten.com/100/100" },
    { value: "qwesrty.ahmed@gmail.com", label: "qwerty", image: "https://placekitten.com/100/100" },
    { value: "qwaessrty.ahmed@gmail.com", label: "qwerty", image: "https://placekitten.com/100/100" },
    { value: "josde@gmail.co", label: "jose", image: "https://placekitten.com/100/100" },
    { value: "noasasor91.ahmed@gmail.om", label: "Noor Ahmed", image: "https://placekitten.com/100/100" },
    { value: "qwerrwwrty.ahed@gmail.com", label: "qwerty", image: "https://placekitten.com/100/100" },
    { value: "josedsdgmail.com", label: "jose", image: "https://placekitten.com/100/100" },
  ];

  const [userIndex, setUserIndex] = useState(0);
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    setSelectedValue(options[userIndex]);
  }, [userIndex]);

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
    <>
      <Box
        justifyContent="space-between"
        alignItems="center"
        display="flex"
        border="1px solid lightGrey"
        borderRadius="5px"
        px="5"
        py="2"
        bg="white"
      >
        <Box w={{ base: "60%", md: "40%", lg: "40%" }}>
          <Select
            borderRadius="5em"
            options={options}
            value={selectedValue !== null ? selectedValue : options[0]}
            formatOptionLabel={(option) => (
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
      </Box>
      <Box>
        <Grid templateColumns="repeat(12, 1fr)" bg="greyBox" p="5" mb="5" borderRadius="5px">
          <GridItem colSpan={12}>
            <Question question="How was your experience with this session?" />
            <Box pt="5" pb="3">
              <AnswerBox answer="Option 01" />
              <AnswerBox answer="Option 02" />
              <AnswerBox answer="Option 03" />
              <AnswerBox answer="Option 04" />
            </Box>
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(12, 1fr)" bg="greyBox" p="5" mb="5" borderRadius="5px">
          <GridItem colSpan={12}>
            <Question question="How did you find the instructions?" />
            <Box pt="5" pb="3">
              <AnswerBox answer="They were short and concise. I understood like 95% of it without any issues." />
            </Box>
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(12, 1fr)" bg="greyBox" p="5" mb="5" borderRadius="5px">
          <GridItem colSpan={12}>
            <Box display={{ base: "block", md: "flex", lg: "flex" }}>
              <Question question="Can you identify the 4 notes played in this audio?" />
              <Spacer />
              <Box>
                <audio controls>
                  <source src="http://www.sousound.com/music/healing/healing_01.mp3" type="audio/mpeg"></source>
                </audio>
              </Box>
            </Box>
            <Box pt="5" pb="3">
              <AnswerBox answer="C minor, D sharp, G minor, C major" />
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};

export default ResponseUser;
