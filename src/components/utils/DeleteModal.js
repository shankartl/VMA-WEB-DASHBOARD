import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Box, Switch } from "@chakra-ui/react";
import React, { useContext } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { BULK_DELETE, USER, USERS } from "../../constants/apiRoutes";
import api from "../../services/api";
import useCustomToastr from "../../utils/useCustomToastr";
import { Button } from "../common";
import { SessionContext } from "../context/SessionContext";

const DeleteModal = (props) => {
  const sessionContext = useContext(SessionContext);
  const { session } = sessionContext;
  const toast = useCustomToastr();
  const deleteItemHandler = (userId) => {
    switch (props.name) {
      case "COURSE_TEST_DELETE":
        if (props.selectedUser.name === "DELETE_SINGLE_USER") {
          api
            .remove(USER(userId))
            .then((res) => {
              toast.showSuccess("User Deleted Successfully");
              props.onClose();
              props.closeAddUserModal();
              props.fetchUserAssessmentAnswers();
              props.userStats();
            })
            .catch((err) => {
              toast.showError(err);
            });
        }
        break;
      default:
        if (props.selectedUser.name === "DELETE_SINGLE_USER") {
          api
            .remove(USER(userId))
            .then((res) => {
              props.showButton.setShowDeleteButton.off();
              toast.showSuccess("User Deleted Successfully");
              props.onClose();
              props.closeAddUserModal();
              if (props.setUsersData) {
                api.get(`${USERS}?session=${session}`).then((res) => {
                  props.setUsersData(res);
                });
              }
              props.userStats();
            })
            .catch((err) => {
              toast.showError(err);
            });
        }
        if (props.selectedUser.name === "DELETE_USERS") {
          api
            .post(BULK_DELETE, { userId })
            .then((res) => {
              props.showButton.setShowDeleteButton.off();
              toast.showSuccess("Users Deleted Successfully");
              props.onClose();
              api.get(`${USERS}?session=${session}`).then((res) => {
                props.setUsersData(res);
              });
            }, [])
            .catch((err) => {
              toast.showError(err);
            });
        }
    }
  };
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent w="90%">
          <Box p={{ base: "1", md: "8", lg: "8" }} textAlign="center">
            {props.selectedUser.name === "DELETE_USERS" ? (
              <ModalHeader fontSize="3xl">Are you sure you want to delete {props.userId?.length} users?</ModalHeader>
            ) : props.selectedUser.name === "DELETE_SINGLE_USER" ? (
              <ModalHeader fontSize="3xl">Are you sure you want to delete this User</ModalHeader>
            ) : (
              <ModalHeader fontSize="3xl">Are you sure you want to delete the question</ModalHeader>
            )}
            <ModalBody px={{ base: "2em", md: "5em", lg: "5em" }} fontSize="sm">
              This cannot be undone.
            </ModalBody>
          </Box>
          <ModalFooter justifyContent="space-evenly" gap="4">
            <Button w="100%" onClick={props.onClose} _hover={{ bg: "#1D313E" }} fontSize="sm" bg="dark" color="white">
              Cancel
            </Button>
            <Button
              w="100%"
              onClick={() => deleteItemHandler(props.userId, props.onClose)}
              _hover={{ bg: "#BF354B" }}
              fontSize="sm"
              leftIcon={<RiDeleteBinLine />}
              bg="darkred"
              color="white"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteModal;
