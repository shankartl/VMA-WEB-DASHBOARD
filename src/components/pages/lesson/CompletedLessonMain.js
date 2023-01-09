import { Box, Stack, Text } from "@chakra-ui/react";
import { millisecondsToHours, millisecondsToMinutes } from "date-fns";
import React from "react";
import { useEffect } from "react";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { CgSandClock } from "react-icons/cg";
import { USER_STATISTICS } from "../../../constants/apiRoutes";
import api from "../../../services/api";
import { useAuth } from "../../../services/auth";
import { Layout } from "../../common";
import Status from "../../common/Status";
import { SessionContext } from "../../context/SessionContext";
import CompletedLessonContent from "../lesson/CompletedLessonContent";

const CompletedLessonMain = () => {
  const context = React.useContext(SessionContext);
  const [userStats, setUserStats] = React.useState([]);
  const { completedLessons, getCompletedLessons } = context;

  const { user } = useAuth();

  const accessibleCourse = Object.values(user.accessibleCourses);
  useEffect(() => {
    getCompletedLessons(accessibleCourse);
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
          <CompletedLessonContent completedLessons={completedLessons} />
        </Box>
        <Box w={{ base: "100%", md: "30%", lg: "30%" }}>
          <Box mt={{ base: "0", md: "0", lg: "6em" }}>
            <Box flex={["1", "1", "1", "1"]}>
              <Text fontSize="sm">Your Stats</Text>
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
            </Box>
          </Box>
        </Box>
      </Stack>
    </Layout>
  );
};

export default CompletedLessonMain;
