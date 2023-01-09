import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, GridItem, Grid } from "@chakra-ui/react";
import React, { useContext } from "react";

import { Button } from "../common";
import { FiUserPlus } from "react-icons/fi";
import InputField from "../formik/InputField";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { PasswordField, PhoneNumberField } from "../formik";
import api from "../../services/api";
import { USERS } from "../../constants/apiRoutes";
import { formattedErrorMessage } from "../../utils/formattedErrorMessage";
import useCustomToastr from "../../utils/useCustomToastr";
import { SessionContext } from "../context/SessionContext";
const AddUserModal = (props) => {
  const { setUsersData, usersData } = props;
  const toast = useCustomToastr();
  let initialValues = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
  };
  const sessionContext = useContext(SessionContext);
  const { session, setSession } = sessionContext;

  const validationSchema = Yup.object({
    firstName: Yup.string().max(15, "Must be 15 characters or less").required("Required"),
    lastName: Yup.string().max(20, "Must be 20 characters or less").required("Required"),
    phoneNumber: Yup.string().max(10, "Must be 10 Digits").min(10, "Must be 10 Digits").required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(8, "Password must be 8 characters long")
      .max(16, "only 16 characters allowed")
      .matches(/[0-9]/, "Password must contain one Number")
      // .matches(/[a-z]/, "Password requires a lowercase letter")
      .matches(/[A-Z]/, "Password must contain one uppercase letter")
      .matches(/[^\w]/, "Password must contain one symbol")
      .required("Required"),
  });
  const currentSession = session;
  let addUserWithSession;

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          if (currentSession === "guitar") {
            addUserWithSession = { ...values, accessibleCourses: { module2: "GUITAR" } };
          }
          if (currentSession === "drums") {
            addUserWithSession = { ...values, accessibleCourses: { module1: "DRUMS" } };
          }

          api
            .post(USERS, addUserWithSession)
            .then((response, values) => {
              toast.showSuccess("User Added Successfully");
              resetForm();
              // setUsersData([...usersData, response]);
              api.get(`${USERS}?session=${session}`).then((res) => {
                props.setUsersData(res);
              });
              props.onClose();
            })
            .catch((error) => {
              const e = formattedErrorMessage(error);
              toast.showError(e);
              setSubmitting(false);
            });
        }}
        enableReinitialize={true}
      >
        {(form) => (
          <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <Form>
              <ModalContent w="90%">
                <ModalHeader>Add new user</ModalHeader>
                <ModalBody>
                  <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                    <GridItem colSpan={6}>
                      <InputField isInline={false} label="First Name" name="firstName" isRequired />
                    </GridItem>
                    <GridItem colSpan={6}>
                      <InputField isInline={false} label="Last Name" name="lastName" isRequired />
                    </GridItem>
                    <GridItem colSpan={12}>
                      <PhoneNumberField isInline={false} label="Phone Number" name="phoneNumber" />
                    </GridItem>
                    <GridItem colSpan={12}>
                      <InputField isInline={false} label="E-mail ID" name="email" isRequired />
                    </GridItem>
                    <GridItem colSpan={12}>
                      <PasswordField isInline={false} label="Password" name="password" isRequired addUser={true} />
                    </GridItem>
                  </Grid>
                </ModalBody>
                <ModalFooter justifyContent="space-evenly" gap="4">
                  <Button w="100%" py="6" onClick={props.onClose} _hover={{ bg: "#1D313E" }} fontSize="sm" bg="dark" color="white">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    w="100%"
                    _hover={{ bg: "#1D313E" }}
                    fontSize="sm"
                    leftIcon={<FiUserPlus />}
                    bg="orange"
                    color="white"
                    py="6"
                  >
                    Add user
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Form>
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default AddUserModal;
