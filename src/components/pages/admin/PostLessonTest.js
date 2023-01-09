import { Box, Flex, Grid, GridItem, Heading, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { ASSESSMENT_USER_RESPONSES } from "../../../constants/apiRoutes";
import api from "../../../services/api";
import useCustomToastr from "../../../utils/useCustomToastr";
import { Layout } from "../../common";
import { SessionContext } from "../../context/SessionContext";
import PostLessonTab from "./PostLessonTab";
import ResponseTab from "./ResponseTab";
import SurveyResponse from "./SurveyQuestionsTabs";

function PostLessonTest(props) {
  // toast
  const toast = useCustomToastr();

  const sessionContext = useContext(SessionContext);
  const { session } = sessionContext;

  // state
  const [assessmentAnswers, setAssessmentAnswers] = useState([]);

  const module = session?.toUpperCase();

  const fetchUserAssessmentAnswers = async () => {
    try {
      const response = await api.get(ASSESSMENT_USER_RESPONSES + `?placement=POST_COURSE&module=${module}`);
      setAssessmentAnswers(response?.assessments);
    } catch (error) {
      toast.showError(error);
    }
  };

  React.useEffect(() => {
    fetchUserAssessmentAnswers();
  }, [session]);

  return (
    <Layout>
      <Grid templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={{ base: "12", md: "12", lg: "9" }} position="relative">
          <Grid templateColumns="repeat(12, 1fr)" justifyContent="space-between">
            <GridItem colSpan={{ base: "12", md: "12", lg: "12" }} mb="5">
              <Text fontSize="sm"> Assessments</Text>
              <Heading fontSize={{ base: "md", lg: "xl" }}>Post-course Assessment</Heading>
            </GridItem>
          </Grid>

          <Tabs isLazy mt="5">
            <TabList>
              <Tab w="50%">{props.questions}</Tab>
              <Tab w="50%">
                <Text border="1px solid orange" px={2} mx={2} color="white" background="orange" borderRadius="5px">
                  {assessmentAnswers.length}
                </Text>
                {props.responses}
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel px="0">
                <SurveyResponse placement="POST_COURSE" />
                {/* <PostLessonTab /> */}
              </TabPanel>
              <TabPanel px="0">
                {" "}
                <ResponseTab
                  fetchUserAssessmentAnswers={fetchUserAssessmentAnswers}
                  assessments={assessmentAnswers}
                  placement="POST_COURSE"
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
    </Layout>
  );
}

export default PostLessonTest;

PostLessonTest.defaultProps = {
  subTitle: "Surveys",
  title: "Pre-lesson Questions",
  questions: "Questions",
  responses: "Responses",
};
