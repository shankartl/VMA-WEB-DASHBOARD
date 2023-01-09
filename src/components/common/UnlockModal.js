import { Box, Button, Image, Modal, ModalBody, ModalContent, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { BsPlay } from "react-icons/bs";
import { IoArrowBackOutline } from "react-icons/io5";
import React from "react";

const UnlockModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>unlock Modal</Button>
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Box display="flex" flexDirection="column" alignItems="center" gap="1">
              <Box>
                <Image
                  h="13em"
                  w="19em"
                  borderRadius="10px"
                  objectFit="cover"
                  src={require("../../assets/guitarmodel.jpg")}
                  fallbackSrc="coursePic1"
                />
              </Box>
              <Text color="#EB5A3C" fontWeight="bold" fontSize="2xl" mt="3">
                Next lesson unlocked!
              </Text>
              <Box fontSize="0.8em" display="flex" flexDirection="column" alignItems="center">
                <Text>Great job,wasnt that fun? </Text>
                <Text> you may take short break before continuing</Text>
                <Text>to the next lesson</Text>
              </Box>
            </Box>
            <Box display="flex" gap="3" justifyContent="space-evenly" mt="5">
              <Box>
                <Button
                  fontSize="xs"
                  bg="#0F2837"
                  color="#ffff"
                  leftIcon={<IoArrowBackOutline fontSize="16px" />}
                  p="6"
                  _hover={{
                    background: "#0F2837",
                    color: "#ffff",
                  }}
                >
                  <Text fontSize="sm" fontWeight="medium">
                    Go back home
                  </Text>
                </Button>
              </Box>
              <Box>
                <Button
                  fontSize="xs"
                  bg="#EB5A3C"
                  color="#ffff"
                  leftIcon={<BsPlay fontSize="16px" />}
                  p="6"
                  _hover={{
                    background: "#EB5A3C",
                    color: "#ffff",
                  }}
                >
                  <Box display="flex" flexDirection="column" alignItems="baseline" gap="1">
                    <Text fontSize="sm" fontWeight="medium">
                      Begin Lesson 05
                    </Text>
                    <Text fontSize="xs" fontWeight="normal">
                      Directed Practice II
                    </Text>
                  </Box>
                </Button>
              </Box>
            </Box>
            <Box display="flex" border="0.5px solid #F6F7F7" borderRadius="6px" mt="2em" mb="1">
              <Box display="flex" flexDirection="column" pt="0.5em" pl="0.5em">
                <Text fontSize="1em">Next up: Lesson 05</Text>
                <Text fontSize="0.9em" fontWeight="bold">
                  Directed Practice II
                </Text>
                <Text fontSize="0.8em" mt="2">
                  Practice with AR guidance to improve your hand eye cordination while playing chords
                </Text>
              </Box>
              <Box>
                <Image
                  src={require("../../assets/guitar.jpg")}
                  borderRadius=" 0px 6px 6px 0px"
                  fallbackSrc="coursePic1"
                  h="100%"
                  w="10em"
                  opacity="0.5"
                />
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UnlockModal;
