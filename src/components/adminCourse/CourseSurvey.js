import { Box, Button, Flex, Grid, GridItem, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import React from "react";
import { Layout } from "../common";
import SurveyForm from "./SurveyForm";
import { AiOutlinePlus } from "react-icons/ai";
import UserResponse from "./UserResponse";
import SingleUserResponse from "./SingleUserResponse";
import Select from "react-select";

const CourseSurvey = () => {
  return (
    <Layout>
      <Grid templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={{ base: "12", md: "12", lg: "9" }} position="relative">
          <Box>
            <Text fontSize="sm">Surveys</Text>
            <Text fontSize="md" fontWeight="bold">
              Course Completion
            </Text>
          </Box>
          <Grid>
            <GridItem>
              <Tabs isFitted>
                <TabList>
                  <Tab>Questions</Tab>
                  <Tab>Response</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <SurveyForm />
                  </TabPanel>

                  <TabPanel px="0">
                    <Box>
                      <Tabs>
                        <Box
                          justifyContent="space-between"
                          alignItems="center"
                          display="flex"
                          border="1px solid lightGrey"
                          borderRadius="5px 5px 0 0"
                          px="5"
                          pt="2"
                          pb="0"
                          bg="white"
                        >
                          <Box display="flex" pb="3" gap="2" alignItems="center">
                            <Text color="orange" fontWeight="bold" fontSize="3xl">
                              124
                            </Text>
                            <Text color="orange" fontSize="md">
                              Responses
                            </Text>
                          </Box>
                          <Box>
                            <TabList>
                              <Tab fontSize="sm" w="50%" pb="6">
                                Summary
                              </Tab>
                              <Tab fontSize="sm" w="50%" pb="6">
                                User
                              </Tab>
                            </TabList>
                          </Box>
                        </Box>

                        <TabPanels>
                          <TabPanel p="0">
                            <UserResponse />
                            <UserResponse />
                          </TabPanel>
                          <TabPanel p="0">
                            <SingleUserResponse />
                          </TabPanel>
                        </TabPanels>
                      </Tabs>
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </Layout>
  );
};

export default CourseSurvey;
