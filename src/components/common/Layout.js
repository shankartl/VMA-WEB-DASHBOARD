import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { NOTIFICATIONS } from "../../constants/apiRoutes";
import api from "../../services/api";
import { useAuth } from "../../services/auth";
import { formattedErrorMessage } from "../../utils/formattedErrorMessage";
import useCustomToastr from "../../utils/useCustomToastr";
import MobileNav from "./MobileNav";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <>
      <Topbar />
      <Flex flexDirection={["column", "column", "row", "row"]} minW="95vw" minH="100vh" top="0" position="relative">
        <Box
          display={["none", "none", "flex", "flex"]}
          w={{ md: "20%", lg: "15%" }}
          mt="10%"
          p="2"
          alignItems="start"
          flexDirection="column"
          pl="5"
        >
          <Sidebar />
        </Box>
        <Box display={["block", "block", "none", "none"]} w={"100%"}>
          <MobileNav />
        </Box>
        <Box bg="lightGrey" w={{ md: "80%", lg: "85%" }} px="5" pt={{ base: "20%", sm: "15%", md: "15%", lg: "10%" }}>
          {children}
        </Box>
      </Flex>
    </>
  );
};

export default Layout;
