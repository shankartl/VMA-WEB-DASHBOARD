import { Box, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack } from "@chakra-ui/react";
import React, { useContext } from "react";
import { BsSave2 } from "react-icons/bs";
import { USER, USERS } from "../../constants/apiRoutes";
import api from "../../services/api";
import { formattedErrorMessage } from "../../utils/formattedErrorMessage";
import useCustomToastr from "../../utils/useCustomToastr";
import { SessionContext } from "../context/SessionContext";

const ResetPasswordModal = (props) => {
  const toast = useCustomToastr();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const sessionContext = useContext(SessionContext);
  const { session, setSession } = sessionContext;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.showError({ description: "New password and confirm password do not match" });
      return;
    }

    switch (props.name) {
      case "COURSE_TEST_RESET_PASSWORD":
        api
          .put(USER(props.userId), { newPassword: password })
          .then((response) => {
            setIsLoading(false);
            toast.showSuccess("Password updated successfully");
            props.onClose();
            props.closeAddUserModal();
            props.fetchUserAssessmentAnswers();
            props.userStats();
          }, [])
          .catch((error) => {
            setIsLoading(false);
            const e = formattedErrorMessage(error);
            toast.showError(e);
          });
        break;
      default:
        api
          .put(USER(props.userId), { newPassword: password })
          .then((response) => {
            setIsLoading(false);
            toast.showSuccess("Password updated successfully");
            props.onClose();
            props.closeAddUserModal();
            api.get(`${USERS}?session=${session}`).then((res) => {
              props.setUsersData(res);
            });
            props.userStats();
          }, [])
          .catch((error) => {
            setIsLoading(false);
            const e = formattedErrorMessage(error);
            toast.showError(e);
          });
    }
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <Box as="form" onSubmit={handleSubmit}>
          <ModalHeader>Reset password</ModalHeader>
          <ModalBody>
            <Stack spacing={3}>
              <Input
                placeholder="Enter new password"
                fontSize="sm"
                size="md"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
              />
              <Input
                placeholder="Re-enter new password"
                fontSize="sm"
                size="md"
                name="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type="password"
              />
            </Stack>
          </ModalBody>

          <ModalFooter justifyContent="space-evenly" gap="4">
            <Button py="6" onClick={props.onClose} w="100%" _hover={{ bg: "#1D313E" }} fontSize="sm" bg="dark" color="white">
              Cancel
            </Button>
            <Button
              py="6"
              w="100%"
              _hover={{ bg: "#E8674C" }}
              fontSize="sm"
              leftIcon={<BsSave2 />}
              bg="orange"
              color="white"
              type="submit"
              isLoading={isLoading}
            >
              Save
            </Button>
          </ModalFooter>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default ResetPasswordModal;
