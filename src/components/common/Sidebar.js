import React from "react";
import { Box, Divider, Flex, Image, Text } from "@chakra-ui/react";

import startupPrimaryMenu from "../../constants/startupPrimaryMenu";
import startupSecondaryMenu from "../../constants/startupSecondaryMenu";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/logo.svg";
import logo from "../../assets/music-commission-logo.jpg";
import { useAuth, useLogout } from "../../services/auth";
import { BiLogOut } from "react-icons/bi";
import { MdOutlineFlipCameraIos } from "react-icons/md";
import { BsMic } from "react-icons/bs";
import { GiSpeaker } from "react-icons/gi";
import adminMenu from "../../constants/adminMenu";
import userMenu from "../../constants/userMenu";

function Sidebar() {
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

  const Entry = ({ onClick, children, link }) => (
    <Box
      px={2}
      py={2}
      my={2}
      fontSize={15}
      textAlign="left"
      backgroundColor={isActive(link) ? "lightorange" : "transparent"}
      color="black"
      cursor="pointer"
      _hover={{ bg: "lightorange", color: "orange" }}
      borderRadius={4}
      onClick={() => onClick && onClick()}
    >
      <Flex align="center" gap={2}>
        {children}
      </Flex>
    </Box>
  );

  return (
    <>
      {menu?.map((m) => (
        <React.Fragment key={m.link}>
          <Box w="100%">
            <Link to={m.link}>
              <Entry link={m.link}>
                {m.icon}
                {m.name}
              </Entry>
              <Box>
                {m.submenu &&
                  m.submenu.map((a) => {
                    return (
                      <>
                        <Link to={a.link}>
                          <Text pl="8" my="3" fontSize="sm" _hover={{ color: "orange" }}>
                            {a.name}
                          </Text>
                        </Link>
                      </>
                    );
                  })}
              </Box>
            </Link>
          </Box>
        </React.Fragment>
      ))}
      <Box mt="auto" w="100%">
        {/* <>
            <Text fontSize="0.7em">Improve your learning experience</Text>
            <Link to="#">
              <Entry>
                <MdOutlineFlipCameraIos />
                Calibrate your setup
              </Entry>
            </Link>
            <Link to="#">
              <Entry>
                <BsMic />
                Check microphone
              </Entry>
            </Link>
            <Link to="#">
              <Entry>
                <GiSpeaker />
                Test speakers
              </Entry>
            </Link>
          </> */}

        <Divider />
        <Entry onClick={() => logout()}>
          <BiLogOut />
          Logout
        </Entry>
      </Box>
    </>
  );
}

export default Sidebar;
