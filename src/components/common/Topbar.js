import { Box, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Portal, Select, Stack, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { Navigate } from "react-router-dom";
import logo from "../../assets/music-commission-logo.jpg";
import { GuitarIcon } from "../../constants/IconData";
import { changeSession, getCurrentSession, useAuth } from "../../services/auth";

import { useState } from "react";
import { SessionContext } from "../context/SessionContext";

const Topbar = () => {
  const sessionContext = useContext(SessionContext);
  const { session, setSession } = sessionContext;
  const { user } = useAuth();
  const roleParser = {
    admin: "ADMIN",
    student: "STUDENT",
  };

  return (
    <Box py="5" position="absolute" zIndex="1" w="100%" display={{ base: "none", md: "none", lg: "block" }}>
      <Flex align="center" bg="white" mx="5" border="1px solid #EBEBF4" px="3" borderRadius="0.7em">
        <Box me="auto">
          {/* <Image src={logo} w="100%" h="5.2em" /> */}
          <GuitarIcon />
        </Box>
        <Box display="flex">
          {user?.role === "ADMIN" && (
            <Box mt="2" display="flex" alignItems="center">
              <Text fontSize="sm" color="gray.500" fontWeight="600">
                View stats for
              </Text>
              <Stack mr="4" ml="2">
                <Select fontSize="sm" size="md" defaultValue={session} value={session} onChange={(e) => setSession(e.target.value)}>
                  <option value="drums">Drums VR</option>
                  <option value="guitar">Guitar AR</option>
                </Select>
              </Stack>
            </Box>
          )}

          <Box w="0.1em" h="2.5em" mx="0.7em" background="gray.300" />
          <Menu>
            <MenuButton>
              <Flex>
                <Text mx="2" mt="1.5">
                  {roleParser[user?.role.toLowerCase()]}
                </Text>
                <Image borderRadius="xl" boxSize="2.5em" border="1px solid #91BAB5" src="https://bit.ly/dan-abramov" alt="Dan Abramov" />
                <Box mt="3" ml="3">
                  <RiArrowDownSLine />
                </Box>
              </Flex>
            </MenuButton>
            <Portal></Portal>
          </Menu>
        </Box>
      </Flex>
    </Box>
  );
};

export default Topbar;
