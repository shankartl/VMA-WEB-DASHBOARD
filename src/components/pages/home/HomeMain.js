import { Text, Box, Divider, Stack, useBoolean, Button } from "@chakra-ui/react";
import React from "react";
import { Layout } from "../../common";
import Courses from "./CourseList";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import Status from "../../common/Status";
import { CgSandClock } from "react-icons/cg";
import { useAuth } from "../../../services/auth";
import { useEffect } from "react";
import axios from "axios";
import api from "../../../services/api";
import { LESSONS, USER_STATISTICS } from "../../../constants/apiRoutes";
import millisecondsToHours from "date-fns/millisecondsToHours";
import millisecondsToMinutes from "date-fns/millisecondsToMinutes";

const HomeMain = () => {
  const [lessons, setLessons] = React.useState([]);
  const [userStats, setUserStats] = React.useState([]);

  const { user } = useAuth();
  const accessibleCourse = Object.values(user?.accessibleCourses);

  useEffect(() => {
    api.get(LESSONS(accessibleCourse[0])).then((res) => {
      setLessons(res);
    });
    api.get(USER_STATISTICS).then((res) => {
      setUserStats(res);
    });
  }, []);

  let timeSpent = millisecondsToHours(+userStats.totalDuration);
  let hourSpent;
  let minSpent;
  if (timeSpent > 0) {
    hourSpent = timeSpent;
  } else {
    timeSpent = millisecondsToMinutes(+userStats.totalDuration);
    minSpent = timeSpent;
  }

  return (
    <Layout>
      <Stack
        spacing={{ base: "0", md: "0", lg: "5em" }}
        direction={["column", "row"]}
        display="flex"
        flexDirection={{ base: "column-reverse", md: "row", lg: "row" }}
      >
        <Box w={{ base: "100%", md: "70%", lg: "70%" }}>
          <Box flex={["2", "2", "2", "2"]}>
            <Text fontSize="2xl" fontWeight="medium" mt="3">
              Welcome back, {user?.firstName}.
            </Text>
            <Divider mt="2" mb="10" />
            <Text fontSize="sm">Your next lessons</Text>
            <Courses lessons={lessons} />
          </Box>
        </Box>
        <Box w={{ base: "100%", md: "30%", lg: "30%" }}>
          <Box mt={{ base: "0", md: "0", lg: "6em" }}>
            <Box flex={["1", "1", "1", "1"]}>
              <Text fontSize="sm">Your Stats</Text>
              <Box display="flex" flexDirection={{ base: "row", md: "column", lg: "column" }} gap="0.5em">
                <Status
                  hours={hourSpent ? hourSpent : minSpent ? minSpent : "Secs ..."}
                  hoursSpent={hourSpent ? "Hours spent" : minSpent ? "Mins" : "In seconds"}
                  icon={<CgSandClock />}
                />
                <Status
                  hours={`${userStats?.totalCourseCompletionPercentage ? userStats?.totalCourseCompletionPercentage : "0"} %`}
                  hoursSpent=" Course completion"
                  icon={<AiOutlineMenuUnfold />}
                />
                {/* <Button disabled={testAttended} onClick={imoState.on} bg={"gray"} w={"200px"}>
                  Take Post Course Test
                </Button> */}
              </Box>
            </Box>
          </Box>
        </Box>
      </Stack>
    </Layout>
  );
};

export default HomeMain;
