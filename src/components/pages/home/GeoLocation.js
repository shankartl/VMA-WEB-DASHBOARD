import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import GeoLocationCard from "../../common/GeoLocationCard";

const GeoLocation = () => {
  return (
    <Box bg="white" borderRadius="0.5em" p="1em">
      <Heading fontSize="lg" fontWeight="medium" mb="1.5em">
        Geo Location
      </Heading>
      <GeoLocationCard country="India" visitors="5500" mostviewed="Switch ON" />
      <GeoLocationCard country="Japon" visitors="3500" mostviewed="Dave.ai" />
      <GeoLocationCard country="Australia" visitors="1500" mostviewed="Qnlabs" />
      <GeoLocationCard country="America" visitors="500" mostviewed="Simyog" />
    </Box>
  );
};
export default GeoLocation;
