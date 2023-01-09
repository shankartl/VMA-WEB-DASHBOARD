import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Box, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { Button } from "../common";
import { AiOutlineFile } from "react-icons/ai";
const AssesmentSaveModal = (props) => {
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent w="90%">
          <Box p={{ base: "1", md: "8", lg: "8" }} textAlign="center">
            <ModalHeader fontSize="2xl">Are you sure you want to Save Assesment</ModalHeader>
          </Box>
          <ModalFooter justifyContent="space-evenly" gap="4">
            <Button w="100%" onClick={props.onClose} _hover={{ bg: "#1D313E" }} fontSize="sm" bg="dark" color="white">
              Cancel
            </Button>
            <Button
              w="100%"
              onClick={props.onClose}
              _hover={{ bg: "#BF354B" }}
              fontSize="sm"
              leftIcon={<AiOutlineFile />}
              bg="orange"
              color="white"
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AssesmentSaveModal;
