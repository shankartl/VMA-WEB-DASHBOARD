import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Box } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Button } from "../common";
import { RiPlayCircleLine } from "react-icons/ri";
import { HiOutlinePause } from "react-icons/hi";
import api from "../../services/api";
import { BULK_SUSPEND, SUSPEND, USERS } from "../../constants/apiRoutes";
import useCustomToastr from "../../utils/useCustomToastr";
import { SessionContext } from "../context/SessionContext";
const SuspendModal = (props) => {
  const sessionContext = useContext(SessionContext);
  const { session } = sessionContext;

  const toast = useCustomToastr();
  const handleSuspend = (userId) => {
    switch (props.name) {
      case "COURSE_TEST_SUSPEND":
        if (props.selectedUser.name === "SUSPEND_SINGLE_USER") {
          api
            .put(SUSPEND(userId), { status: "SUSPENDED" })
            .then((res) => {
              toast.showSuccess(`User Suspended Successfully`);
              props.onClose();
              props.closeAddUserModal();
              props.fetchUserAssessmentAnswers();
              props.userStats();
            }, [])
            .catch((err) => {
              console.log("errrr", err);
              toast.showError(err);
            });
        }
        if (props.selectedUser.name === "UNSUSPEND_SINGLE_USER") {
          api
            .put(SUSPEND(userId), { status: "ACTIVE" })
            .then((res) => {
              props.showButton && props.showButton.setShowDeleteButton.off();
              toast.showSuccess(`User Activated Successfully`);
              props.onClose();
              props.closeAddUserModal();
              props.fetchUserAssessmentAnswers();
              props.userStats();
            }, [])
            .catch((err) => {
              toast.showError(err);
            });
        }
        break;
      default:
        if (props.selectedUser.name === "SUSPEND_SINGLE_USER") {
          api
            .put(SUSPEND(userId), { status: "SUSPENDED" })
            .then((res) => {
              props.showButton && props.showButton.setShowDeleteButton.off();
              toast.showSuccess(`User Suspended Successfully`);
              props.onClose();
              props.closeAddUserModal();
              api.get(`${USERS}?session=${session}`).then((res) => {
                props.setUsersData(res);
              });
              props.userStats();
            }, [])
            .catch((err) => {
              console.log("errrr", err);
              toast.showError(err);
            });
        }
        if (props.selectedUser.name === "SUSPEND_USERS") {
          api
            .put(BULK_SUSPEND, { userId })
            .then((res) => {
              props.showButton.setShowDeleteButton.off();
              toast.showSuccess(`Users suspended Successfully`);
              props.onClose();
              api.get(`${USERS}?session=${session}`).then((res) => {
                props.setUsersData(res);
              });
            }, [])
            .catch((err) => {
              toast.showError(err);
            });
        }
        if (props.selectedUser.name === "UNSUSPEND_SINGLE_USER") {
          api
            .put(SUSPEND(userId), { status: "ACTIVE" })
            .then((res) => {
              props.showButton && props.showButton.setShowDeleteButton.off();
              toast.showSuccess(`User Activated Successfully`);
              props.onClose();
              props.closeAddUserModal();
              api.get(`${USERS}?session=${session}`).then((res) => {
                props.setUsersData(res);
              });
              props.userStats();
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
            {props.selectedUser.name === "SUSPEND_USERS" ? (
              <ModalHeader fontSize="3xl">Are you sure you want to Suspend {props.userId?.length} users</ModalHeader>
            ) : props.selectedUser.name === "SUSPEND_SINGLE_USER" ? (
              <ModalHeader fontSize="3xl">Are you sure you want to Suspend this User</ModalHeader>
            ) : (
              <ModalHeader fontSize="3xl">Are you sure you want to Activate this User</ModalHeader>
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
              onClick={() => handleSuspend(props.userId)}
              _hover={{ bg: "#BF354B" }}
              fontSize="sm"
              leftIcon={props.status === "SUSPENDED" ? <RiPlayCircleLine /> : <HiOutlinePause />}
              bg="orange"
              color="white"
            >
              {props.status === "SUSPENDED" ? "UnSuspend" : "Suspend"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SuspendModal;
