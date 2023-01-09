import { Box, Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import React from "react";
import Switch from "./Switch";

const IndustryCard = ({ industry, setIndustriesData }) => {
  const [isLoading, setLoading] = React.useState(false);

  const onChange = (e) => {
    const newValue = e.target.checked;
    setLoading(true);
    setIndustriesData((prev) => {
      const newData = [...prev];
      const index = newData.findIndex((i) => i.id === industry.id);
      newData[index].isActive = newValue;
      newData[index].changed = true;
      return newData;
    });
    setLoading(false);
  };

  return (
    <Stack>
      <Box bg="white" p="1em" borderRadius="0.5em">
        <Flex justifyContent="space-between">
          <Text fontSize="lg">{industry.name}</Text>
          {isLoading ? <Spinner /> : <Switch onChange={onChange} isChecked={industry.isActive} />}
        </Flex>
      </Box>
    </Stack>
  );
};

export default IndustryCard;
