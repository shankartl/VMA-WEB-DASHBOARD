import React from "react";
import { Box, Divider, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Portal, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth, useLogout } from "../../services/auth";
import startupPrimaryMenu from "../../constants/startupPrimaryMenu";
import startupSecondaryMenu from "../../constants/startupSecondaryMenu";
import { BiLogOut } from "react-icons/bi";
import { RiArrowDownSLine } from "react-icons/ri";
import adminMenu from "../../constants/adminMenu";
import userMenu from "../../constants/userMenu";

const MobileNav = () => {
  const logout = useLogout();
  const { user } = useAuth();
  const menuSelector = {
    admin: adminMenu,
    student: userMenu,
    // adminPrimary: adminPrimaryMenu,
    // adminSecondary: adminSecondaryMenu,
    // startupPrimary: startupPrimaryMenu,
    // startupSecondary: startupSecondaryMenu,
  };
  const menu = menuSelector[user?.role.toLowerCase()];

  const isActive = (link) => {
    const currentPath = window.location.pathname;
    return currentPath.includes(link);
  };
  const roleParser = {
    admin: "Admin",
    student: "Student",
  };

  const Entry = ({ onClick, children, link }) => (
    <Box
      px={2}
      py={2}
      my={2}
      fontSize={15}
      textAlign="center"
      backgroundColor={isActive(link) ? "secondary" : "transparent"}
      color="white"
      cursor="pointer"
      _hover={{ bg: "secondary" }}
      borderRadius={4}
      onClick={() => onClick && onClick()}
    >
      <Flex align="center" gap={2}>
        {children}
      </Flex>
    </Box>
  );

  return (
    <Flex as="nav" position="absolute" align="center" wrap="wrap" padding="1.5rem" w="100%" mb="5">
      <Box me="auto">
        <Menu>
          <MenuButton>
            <svg width="25px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </MenuButton>
          <MenuList backgroundColor="primary.500" p="0">
            {menu.map((m) => (
              <Box key={m.link} px="0.5em">
                <Link to={m.link}>
                  <Entry link={m.link}>
                    {m.icon}
                    {m.name}
                  </Entry>
                </Link>
              </Box>
            ))}
            <Divider />
            <Box px="0.5em">
              <Entry onClick={() => logout()}>
                <BiLogOut />
                Logout
              </Entry>
            </Box>
          </MenuList>
        </Menu>
      </Box>
      <Box>
        <Flex>
          <Image borderRadius="xl" boxSize="2.5em" border="1px solid #91BAB5" src="https://bit.ly/dan-abramov" alt="Dan Abramov" />
          <Menu>
            <MenuButton>
              <Flex>
                <Text color="gray.500" mx="2">
                  {roleParser[user?.role.toLowerCase()] || "Student"}
                </Text>
                <Box mt="1.5">
                  <RiArrowDownSLine />
                </Box>
              </Flex>
            </MenuButton>
            <Portal>
              <MenuList>
                <MenuItem>Menu 1</MenuItem>
                <MenuItem>Menu 2</MenuItem>
                <MenuItem>Menu 3</MenuItem>
                <MenuItem>Menu 4</MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </Flex>
      </Box>
    </Flex>
  );
};

export default MobileNav;
