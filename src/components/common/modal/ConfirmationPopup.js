import { Box, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import React from "react";
import { FiEdit } from "react-icons/fi";

function ConfirmationPopup({ isOpen, onClose, onSubmit, header, description = "", isLoading }) {
  const handlesbmit = async () => {
    await onSubmit();
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w="90%">
        <Box p={{ base: "1", md: "8", lg: "8" }} textAlign="center">
          <ModalHeader fontSize="3xl">{header}</ModalHeader>
          <ModalBody px={{ base: "2em", md: "5em", lg: "5em" }} fontSize="sm">
            {description}
          </ModalBody>
        </Box>
        <ModalFooter justifyContent="space-evenly" gap="4">
          <Button w="100%" onClick={onClose} _hover={{ bg: "#1D313E" }} fontSize="sm" bg="dark" color="white">
            Cancel
          </Button>
          <Button
            w="100%"
            spinnerPlacement={"end"}
            loadingText={"Updating"}
            isLoading={isLoading}
            _hover={{ bg: "#BF354B" }}
            fontSize="sm"
            leftIcon={<FiEdit />}
            bg="darkred"
            color="white"
            onClick={() => {
              handlesbmit();
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ConfirmationPopup;
