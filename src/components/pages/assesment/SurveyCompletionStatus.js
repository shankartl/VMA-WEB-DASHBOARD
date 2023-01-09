import { Box, Image, Text, VStack } from "@chakra-ui/react";
import React from "react";
import logo from "../../../assets/music-commission-logo.jpg";
import { Button } from "../../common";
import { TiTick } from "react-icons/ti";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";

const SurveyCompletionStatus = () => {
  return (
    <Box h="90vh">
      <Image src={logo} h="5em" />

      <Box display="flex" flexDirection="column" gap="10" alignItems="center" justifyContent="center" h="100%">
        <VStack w={'70%'} alignItems={'center'} justifyContent={'center'} textAlign="center">
          <Box position="relative">
            <Box borderRadius="50%" p="5" bg="#54C781">
              <TiTick fontSize="4em" textAlign="center" color="white" />
            </Box>
          </Box>
          {/* <Text fontSize="2xl" fontWeight="bold">
            Thank you for your submission!
          </Text> */}
          {/* <GuitarIcon /> */}
        </VStack>

        <Box>
          <Link to={ROUTES.HOME_SCREEN}>
            <Button bg="black" leftIcon={<AiOutlineArrowLeft />} p="5">
              Back to Home
            </Button>
          </Link>
        </Box>
      </Box >
    </Box >
  );
};

export default SurveyCompletionStatus;
