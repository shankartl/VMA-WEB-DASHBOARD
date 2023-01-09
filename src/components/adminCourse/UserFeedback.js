import { Box, Text } from "@chakra-ui/react";
import React from "react";

const UserFeedback = ({ res }) => {
  return (
    <Box bg="#EEF0F0" my="5" p="4">
      <Text fontSize="xs" pt="2" mb="3" fontWeight="medium">
        How was your overall experience with GuitarXR ?
      </Text>
      <Box display="flex" justifyContent="space-around">
        {res.map((res, i) => {
          const renderColor = res.option === "Okay";
          return (
            <React.Fragment key={i}>
              <Box display="flex" alignItems="center" gap="2">
                <Box
                  display="flex"
                  alignItems="center"
                  gap="2"
                  color={renderColor ? "black" : "gray"}
                  borderRadius={renderColor ? "10px" : ""}
                  border={renderColor ? "none" : ""}
                  px={renderColor ? "3 " : ""}
                  py={renderColor ? "2" : ""}
                  bg={renderColor ? "white" : ""}
                  fontSize={["xs", "sm", "sm", "sm"]}
                >
                  {res.emoji} {res.option}
                </Box>
              </Box>
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
};

export default UserFeedback;
