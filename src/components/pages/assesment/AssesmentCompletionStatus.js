import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";
import logo from "../../../assets/music-commission-logo.jpg";
import { Button } from "../../common";
import { TiTick } from "react-icons/ti";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
const AssesmentCompletionStatus = () => {
  return (
    <Box h="90vh">
      <Image src={logo} h="5em" />

      <Box display="flex" flexDirection="column" gap="10" alignItems="center" justifyContent="center" h="100%">
        <Box textAlign="center">
          <Box position="relative">
            <Box borderRadius="50%" p="10" bg="#54C781" position="absolute" bottom="0.5em" left="3em">
              <TiTick fontSize="4em" textAlign="center" color="white" />
            </Box>
          </Box>
          <Box mt="5">
            <Text fontSize="2xl" fontWeight="bold">
              Assessment Complete !
            </Text>
            <Text fontSize="xxs" color="gray.500" mt="2">
              We will use this information to improve our lessons
            </Text>
          </Box>
        </Box>

        <Box>
          <Link to={ROUTES.HOME_SCREEN}>
            <Button bg="black" leftIcon={<AiOutlineArrowRight />} p="5">
              Calibrate and start lesson
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default AssesmentCompletionStatus;
