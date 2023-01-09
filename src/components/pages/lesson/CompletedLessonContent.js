import { Box, Divider, Heading } from "@chakra-ui/react";
import React from "react";
import { useEffect } from "react";
import { COMPLETED_LESSONS } from "../../../constants/apiRoutes";
import api from "../../../services/api";
import { useAuth } from "../../../services/auth";

import CompletedLessonCard from "../lesson/CompletedLessonCard";

const CompletedLessonContent = ({ completedLessons }) => {
  return (
    <Box borderRadius="0.5em" mt="5">
      <Heading fontSize="2xl" fontWeight="medium" mb="3">
        Completed lessons
      </Heading>
      <Divider mb="5" />

      {completedLessons.map((data, index) => {
        return (
          <Box key={index}>
            <CompletedLessonCard data={data} visitors="5500" mostviewed="Switch ON" />
          </Box>
        );
      })}
    </Box>
  );
};

export default CompletedLessonContent;
