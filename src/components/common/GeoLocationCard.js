import { Box, Divider, Image, SimpleGrid, Text } from "@chakra-ui/react";
import React from "react";

const GeoLocationCard = (props) => {
  const Card = ({ label, value }) => (
    <Box alignSelf="center">
      <Text fontSize="xs">{label}</Text>
      <Text fontSize={{ base: "sm", md: "md" }} fontWeight="medium">
        {value}
      </Text>
    </Box>
  );
  return (
    <>
      <SimpleGrid columns={4} p="0.5em" marginY="1em" spacing={0}>
        <Box mr={{ base: "0.5em", md: "0em" }} alignSelf={{ base: "center", md: "auto" }}>
          <Image src={props.image} />
        </Box>
        <Card label={props.countryHeading} value={props.country} />
        <Card label={props.visitorsHeading} value={props.visitors} />
        <Card label={props.mostViewedHeading} value={props.mostviewed} />
      </SimpleGrid>
      <Divider />
    </>
  );
};
GeoLocationCard.defaultProps = {
  image: "https://via.placeholder.com/75X50",
  countryHeading: "Country",
  visitorsHeading: "Visitors",
  mostViewedHeading: "Most Viewed",
};
export default GeoLocationCard;
