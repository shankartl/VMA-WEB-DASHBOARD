import React from "react";
import { Box, Flex, Progress, Text } from "@chakra-ui/react";
const UserScoreRenderer = ({ data }) => {
  return (
    <Flex alignItems="center" gap="2">
      <Box>
        <Text>{data ? `${data.totalScore} / ${data.totalMarks}` : ""}</Text>
      </Box>

      <Box>
        <Progress
          width="180px"
          value={data?.totalScore}
          max={data?.totalMarks}
          size="xs"
          colorScheme="cyan"
          borderRadius="10px"
        />
      </Box>
    </Flex>
  );
};

export default UserScoreRenderer;
