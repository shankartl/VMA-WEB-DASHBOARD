import { GridItem, Grid, Heading, Box, Divider, Button } from "@chakra-ui/react";
import { Formik } from "formik";
import React from "react";
import { Layout } from "../../common";
import ProfileSettings from "./ProfileSettings";

const SettingsMain = () => {
  return (
    <Layout>
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={{ base: "12", md: "12", lg: "8" }}>
          <Box position={"relative"} px="1em" borderRadius="0.5em">
            <Heading fontSize="2xl">Settings</Heading>
            <Divider my="4" />

            <ProfileSettings />
          </Box>
        </GridItem>
      </Grid>
    </Layout>
  );
};

export default SettingsMain;
