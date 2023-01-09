import { Box, Flex, Grid, GridItem, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { RiArrowRightDownLine, RiArrowRightUpLine } from "react-icons/ri";
import { ASSESSMENT_USER_RESPONSES } from "../../../constants/apiRoutes";
import { SURVEY } from "../../../constants/common";
import api from "../../../services/api";
import useCustomToastr from "../../../utils/useCustomToastr";
import { Layout } from "../../common";
import { SessionContext } from "../../context/SessionContext";
import ResponseTab from "./ResponseTab";
import SurveyResponse from "./SurveyQuestionsTabs";
import SurveyResponseTab from "./SurveyResponseTab";
import SurveyQuestionsTab from "./SurveyResponseTab";

function SurveyQuestions(props) {
  const toast = useCustomToastr();

  const sessionContext = useContext(SessionContext);
  const { session } = sessionContext;

  // state
  const [assessmentAnswers, setAssessmentAnswers] = useState([]);

  const module = session?.toUpperCase();

  const fetchUserAssessmentAnswers = async () => {
    try {
      const response = await api.get(ASSESSMENT_USER_RESPONSES + `?placement=SURVEY&module=${module}`);
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
              <Text fontSize="sm">Survey</Text>
              <Heading fontSize={{ base: "md", lg: "xl" }}>{"Questions"}</Heading>
            </GridItem>
          </Grid>

          <Box display="flex">
            <Tabs isLazy mt="5" flex={3}>
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
                  <SurveyResponse />
                </TabPanel>
                <TabPanel px="0">
                  {/* <SurveyQuestionsTab /> */}
                  <SurveyResponseTab
                    fetchUserAssessmentAnswers={fetchUserAssessmentAnswers}
                    assessments={assessmentAnswers}
                    placement={SURVEY}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </GridItem>
      </Grid>
    </Layout>
  );
}

export default SurveyQuestions;
SurveyQuestions.defaultProps = {
  subTitle: "Assesments",
  title: "Pre Course Assessment",
  questions: "Questions",
  responses: "Responses",
};
