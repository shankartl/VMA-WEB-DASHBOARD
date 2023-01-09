import React from "react";
import { Box, Flex, Progress, Text } from "@chakra-ui/react";
import LessonProgressBar from "../common/LessonProgressBar";
const ProgressBar = (props) => {
  const lessons = [
    {
      lesson: 1,
    },
    {
      lesson: 2,
    },
    {
      lesson: 3,
    },
    {
      lesson: 4,
    },
    {
      lesson: 5,
    },
  ];
  let array = [];
  props.value.userLessons?.forEach((data) => {
    if (data.status === "COMPLETED") {
      const indexFound = array.findIndex((a) => a.lessonId === data.lessonId);
      if (indexFound === -1) {
        const obj = { lessonId: data.lessonId, status: data.status };
        array.push(obj);
      }
    }
  });

  return (
    <Box display="flex" alignItems="center" gap="5">
      <Text>{array?.length}</Text>
      <Box>
        <LessonProgressBar progressBarData={array?.length} />
      </Box>
    </Box>
  );
};

export default ProgressBar;
