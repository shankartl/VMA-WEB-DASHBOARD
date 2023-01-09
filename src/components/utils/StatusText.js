import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { getStatusColor } from "../../utils/getStatusColor";
import { GoPrimitiveDot } from "react-icons/go";

function StatusText({ accountStatus }) {
  let status = accountStatus.status;
  const suspendedIcon = () => {
    if (status === "SUSPENDED") {
      return (
        <Box>
          <GoPrimitiveDot />
        </Box>
      );
    }
  };
  return (
    <Text color={getStatusColor(status)}>
      <Box display="flex" alignItems="center">
        {suspendedIcon()}
        <Box mb="1">{status === "SUSPENDED" ? "Suspended" : "Active"}</Box>
      </Box>
    </Text>
  );
}
export default StatusText;
