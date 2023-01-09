import { Box, Button, Flex, Grid, GridItem, Heading, Select, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsSave2 } from "react-icons/bs";
import { Layout } from "../../common";
import PostCourseQuestionTab from "./PostCourseQuestionTab";
import PostCourseResponseTab from "./PostCourseResponseTab";
import QuestionTab from "./QuestionTab";
import ResponseTab from "./ResponseTab";

function PostCourse(props) {
  return (
    <Layout>
      <Grid templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={{ base: "12", md: "12", lg: "9" }} position="relative">
          <Grid templateColumns="repeat(12, 1fr)" justifyContent="space-between">
            <GridItem colSpan={{ base: "12", md: "12", lg: "12" }} mb="5">
              <Text fontSize="sm">Assessments</Text>
              <Heading fontSize={{ base: "md", lg: "xl" }}>Post Course Assessment</Heading>
            </GridItem>
          </Grid>

          <Box display="flex">
            <Tabs isLazy mt="5" flex={3}>
              <TabList>
                <Tab w="50%">Questions</Tab>
                <Tab w="50%">
                  <Text border="1px solid orange" p="1" color="white" background="orange" borderRadius="5px">
                    50
                  </Text>
                  Responses
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel px="0">
                  <PostCourseQuestionTab />
                </TabPanel>
                <TabPanel px="0">
                  <PostCourseResponseTab />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </GridItem>
      </Grid>
    </Layout>
  );
}

export default PostCourse;

PostCourse.defaultProps = {
  subTitle: "Assesments",
  title: "Post Course Assessment",
  questions: "Questions",
  responses: "Responses",
};
