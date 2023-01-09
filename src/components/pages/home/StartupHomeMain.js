import { SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { Layout, Filter } from "../../common";
import GeoLocation from "./GeoLocation";
import StartupWaitingForApproval from "./StartupWaitingForApproval";

const StartupHomeMain = () => {
  return (
    <Layout>
      <Filter />
      <SimpleGrid columns={[1, 2]} spacing={5} mt="2em">
        <GeoLocation />
        <StartupWaitingForApproval />
      </SimpleGrid>
    </Layout>
  );
};

export default StartupHomeMain;
