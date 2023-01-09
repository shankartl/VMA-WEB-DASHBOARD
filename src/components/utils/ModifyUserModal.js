import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  GridItem,
  Grid,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import React, { useContext } from "react";

import { Button } from "../common";
import InputField from "../formik/InputField";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { PhoneNumberField } from "../formik";
import { FaRegEdit } from "react-icons/fa";
import api from "../../services/api";
import { USER, USERS } from "../../constants/apiRoutes";
import useCustomToastr from "../../utils/useCustomToastr";
import { formattedErrorMessage } from "../../utils/formattedErrorMessage";
import { SessionContext } from "../context/SessionContext";

const ModifyUserModal = (props) => {
  const initialValues = {
    firstName: props.usersData.firstName,
    lastName: props.usersData.lastName,
    phoneNumber: props.usersData.phoneNumber,
    email: props.usersData.email,
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().max(15, "Must be 15 characters or less").required("Required"),
    lastName: Yup.string().max(20, "Must be 20 characters or less").required("Required"),
    phoneNumber: Yup.string().max(10, "Must be 10 Digits").required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
  });

  const toast = useCustomToastr();
  const sessionContext = useContext(SessionContext);
  const { session } = sessionContext;
  const onSubmit = (values) => {
    switch (props.name) {
      case "COURSE_TEST_MODIFY":
        api
          .put(USER(props.usersData.id), values)
          .then((response) => {
            toast.showSuccess("User Modified Successfully");
            props.fetchUserAssessmentAnswers();
            props.userStats();
            props.onClose();
            props.closeAddUserModal();
          }, [])
          .catch((error) => {
            const e = formattedErrorMessage(error);
            toast.showError(e);
          });
        break;
      default:
        api
          .put(USER(props.usersData.id), values)
          .then((response) => {
            toast.showSuccess("User Modified Successfully");
            api.get(`${USERS}?session=${session}`).then((res) => {
              props.setUsersData(res);
            });
            props.userStats();
            props.onClose();
            props.closeAddUserModal();
          }, [])
          .catch((error) => {
            const e = formattedErrorMessage(error);
            toast.showError(e);
          });
    }
  };
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize={true}>
        {() => (
          <Form>
            <ModalContent w="90%">
              <ModalHeader>Modify details</ModalHeader>
              <ModalBody>
                <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                  <GridItem colSpan={6}>
                    <InputGroup>
                      <InputField isInline={false} label="First Name" name="firstName" />
                      <InputRightElement top="25">
                        <FaRegEdit cursor="pointer" />
                      </InputRightElement>
                    </InputGroup>
                  </GridItem>
                  <GridItem colSpan={6}>
                    <InputGroup>
                      <InputField isInline={false} label="Last Name" name="lastName" />
                      <InputRightElement top="25">
                        <FaRegEdit cursor="pointer" />
                      </InputRightElement>
                    </InputGroup>
                  </GridItem>
                  <GridItem colSpan={12}>
                    <InputGroup display="block">
                      <PhoneNumberField isInline={false} label="Phone number" name="phoneNumber" />
                      <InputRightElement top="25">
                        <FaRegEdit cursor="pointer" />
                      </InputRightElement>
                    </InputGroup>
                  </GridItem>
                  <GridItem colSpan={12}>
                    <InputGroup display="block">
                      <InputField isInline={false} label="E-mail ID" name="email" />
                    </InputGroup>
                  </GridItem>
                </Grid>
              </ModalBody>
              <ModalFooter justifyContent="space-evenly" gap="4">
                <Button w="100%" py="6" onClick={props.onClose} _hover={{ bg: "#1D313E" }} fontSize="sm" bg="dark" color="white">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  // isLoading={formprops.isSubmitting}
                  w="100%"
                  _hover={{ bg: "#1D313E" }}
                  fontSize="sm"
                  bg="orange"
                  color="white"
                  py="6"
                >
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ModifyUserModal;
