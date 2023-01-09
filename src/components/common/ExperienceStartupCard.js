import { Box, Center, Flex, Image, Spinner, Stack, Text } from "@chakra-ui/react";
import React from "react";
import Switch from "./Switch";

const ExperienceStartupCard = ({ startup, setStartupsData }) => {
  const [isLoading, setLoading] = React.useState(false);

  const onChange = (e) => {
    const newValue = e.target.checked;
    setLoading(true);
    setStartupsData((prev) => {
      const newData = [...prev];
      const index = newData.findIndex((i) => i.id === startup.id);
      newData[index].status = newValue ? "published" : "archived";
      newData[index].changed = true;
      return newData;
    });
    setLoading(false);
  };

  return (
    <Stack>
      <Box bg="white" p="1em" borderRadius="0.5em">
        <Flex justifyContent="space-between" align="center">
          <Flex>
            <Image w="4em" h="3em" maxW="4em" maxH="3em" src={startup.logoId.url} borderRadius="5px" />
            <Center>
              <Text fontSize="lg" mx="3">
                {startup.name}
              </Text>
            </Center>
          </Flex>
          {isLoading ? <Spinner /> : <Switch onChange={onChange} isChecked={startup.status === "published"} />}
        </Flex>
      </Box>
    </Stack>
  );
};

export default ExperienceStartupCard;
