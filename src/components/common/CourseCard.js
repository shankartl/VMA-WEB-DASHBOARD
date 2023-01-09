import { Box, Image, Text, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { FaLock } from "react-icons/fa";
import LessonLockedModal from "../utils/LessonLockedModal";

const CourseCard = () => {
  const { isOpen: isOpenLesson, onOpen: onOpenLesson, onClose: onCloseLesson } = useDisclosure();
  return (
    <Box onClick={onOpenLesson}>
      <Box position="relative">
        <Image h="7em" w="9em" src={require("../../assets/coursepic1.png")} fallbackSrc="coursePic1" />
        <Box position="absolute" top="40%" left="40%" color="#f5f6f7">
          <FaLock fontSize="2em" />
        </Box>
      </Box>

      <Text fontSize="xs" mt="1">
        Lesson 05
      </Text>
      <Text fontSize="0.8em" fontWeight="600">
        Directed Practice x
      </Text>
      <LessonLockedModal isOpen={isOpenLesson} onClose={onCloseLesson} />
    </Box>
  );
};

export default CourseCard;
