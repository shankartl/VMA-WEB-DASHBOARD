import { Box, Flex, Grid, GridItem, Input, Stack, Text, useDisclosure } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Button, Layout } from "../../common";
import { RiArrowRightDownLine, RiArrowRightUpLine } from "react-icons/ri";
import { useEffect } from "react";
import api from "../../../services/api";
import { USERS } from "../../../constants/apiRoutes";
import { getCurrentSession } from "../../../services/auth";
import { useState } from "react";
import { millisecondsToHours } from "date-fns";
import { digitalTime } from "../../utils/DateFormat";
import { SessionContext } from "../../context/SessionContext";

const AdminHomeMain = () => {
  const [currentSession, setCurrentSession] = useState("");
  const fetchCurrentSession = () => {
    setCurrentSession(getCurrentSession);
  };
  const sessionContext = useContext(SessionContext);
  const { session, setSession } = sessionContext;

  const [usersData, setUsersData] = React.useState([]);
  useEffect(() => {
    api.get(`${USERS}?search=&session=${session}`).then((res) => {
      setUsersData(res);
    });
  }, [session]);
  const filteredUserData = usersData.map((d) => d.userLessons);
  const filteredLessonData = filteredUserData.filter((l) => {
    return l.length;
  });
  const findlessonavg = filteredLessonData.map((fl) => {
    return fl?.map((avg) => {
      return avg;
    });
  });
  const totalDurations = findlessonavg.flat().map((fd) => {
    return fd.duration;
  });
  const findTotalAverage = totalDurations.reduce((p, c) => {
    return (p += c);
  }, 0);
  const average = findTotalAverage / totalDurations.length;

  return (
    <Layout>
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={2}>
          <Flex flexDirection="column" bg="white" px="3" py="1" borderRadius="5" height="8em">
            <Box mb="auto">
              <Text fontSize="2xl" fontWeight="800" color="orange">
                {usersData.length}
              </Text>
              <Text fontSize="sm">Learners</Text>
            </Box>
            <Box>
              <Flex color="lightGreen">
                <RiArrowRightUpLine />
                <Text ml="1" fontSize="10">
                  0% from last week
                </Text>
              </Flex>
            </Box>
          </Flex>
        </GridItem>
        <GridItem colSpan={2}>
          <Flex flexDirection="column" bg="white" px="3" py="1" borderRadius="5" height="8em">
            <Box mb="auto">
              <Text fontSize="2xl" fontWeight="800" color="orange">
                {isNaN(average) ? 0 : digitalTime(average)}
              </Text>
              <Text fontSize="sm">Average time spent per session</Text>
            </Box>
            <Box>
              <Flex color="darkred">
                <RiArrowRightDownLine />
                <Text fontSize="10" ml="1">
                  Down 0% from last week
                </Text>
              </Flex>
            </Box>
          </Flex>
        </GridItem>
      </Grid>
    </Layout>
  );
};

export default AdminHomeMain;
