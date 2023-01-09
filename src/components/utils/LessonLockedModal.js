import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Box, useDisclosure, Text } from "@chakra-ui/react";
import React from "react";
import { FaLock } from "react-icons/fa";
import { Button } from "../common";

const LessonLockedModal = (props) => {
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent w="90%">
          <Box p={{ base: "1", md: "8", lg: "8" }} textAlign="center">
            <ModalHeader display="flex" flexDirection="column" alignItems="center" gap="4">
              <Box>
                <FaLock fontSize="2em" />
              </Box>
              <Text fontSize="md">Please finish the previous lesson to unlock Next lesson</Text>{" "}
            </ModalHeader>
          </Box>
          <Box justifyContent="center" gap="4" margin="auto" mb="3">
            <Button onClick={props.onClose} _hover={{ bg: "black" }} fontSize="sm" bg="black" color="white" w="200px">
              Okay
            </Button>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LessonLockedModal;
