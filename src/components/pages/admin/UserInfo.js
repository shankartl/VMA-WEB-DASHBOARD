import { Grid, GridItem, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { formatDistance } from "date-fns/esm";

import React from "react";
import { digitalTime } from "../../utils/DateFormat";

const UserInfo = ({ info, lessonProgress, averageDuration }) => {
  const lessonsCompleted = lessonProgress?.filter((l) => {
    return l?.status === "COMPLETED";
  });

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap="4" mb="8">
      <GridItem display={{ base: "none", md: "none", lg: "block" }} colSpan={{ base: "none", md: "none", lg: "1" }}></GridItem>
      <GridItem colSpan={{ base: "6", md: "3", lg: "2" }}>
        <Text fontSize="xs" color="gray.500">
          Account created
        </Text>
        <Text fontSize="xs" fontWeight="bold">
          {info?.created_at ? format(new Date(info?.created_at), "do LLLL yy") : ""}
        </Text>
      </GridItem>
      <GridItem colSpan={{ base: "6", md: "3", lg: "2" }}>
        <Text fontSize="xs" color="gray.500">
          Last Active
        </Text>
        <Text fontSize="xs" fontWeight="bold">
          {info?.lastActiveAt ? formatDistance(new Date(info.lastActiveAt), new Date()) : formatDistance(new Date(), new Date())}
        </Text>
      </GridItem>
      <GridItem colSpan={{ base: "6", md: "3", lg: "2" }}>
        <Text fontSize="xs" color="gray.500">
          Lesson Progress
        </Text>
        <Text fontSize="xs" fontWeight="bold">
          {lessonsCompleted.length}
        </Text>
      </GridItem>
      <GridItem colSpan={{ base: "6", md: "3", lg: "2" }}>
        <Text fontSize="xs" color="gray.500">
          Average Duration
        </Text>
        <Text fontSize="xs" fontWeight="bold">
          {isNaN(+averageDuration) ? "0" : digitalTime(+averageDuration)}
        </Text>
      </GridItem>
      <GridItem colSpan={{ base: "6", md: "3", lg: "2" }}>
        {/* <Text fontSize="xs" color="gray.500">
          Average Pace
        </Text>
        <Text fontSize="xs" fontWeight="bold">
          0
        </Text> */}
      </GridItem>
    </Grid>
  );
};

export default UserInfo;
