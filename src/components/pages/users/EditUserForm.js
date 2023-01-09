import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { Button } from "../../common";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import { USER } from "../../../constants/apiRoutes";
import api from "../../../services/api";
import { Form, Formik } from "formik";
import useCustomToastr from "../../../utils/useCustomToastr";
import * as Yup from "yup";
import { InputField } from "../../formik";

const EditUserForm = ({ id, pageRefresher }) => {
  const toast = useCustomToastr();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userData, setUserData] = React.useState({});

  const initialValues = {
    name: userData.name,
    email: userData.email,
    password: null,
  };

  const formSchema = Yup.object().shape({
    name: Yup.string(),
    email: Yup.string(),
    password: Yup.string().nullable(),
  });

  const fetchUser = (id) => {
    api
      .get(USER(id))
      .then((response) => {
        setUserData(response);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
      });
  };

  const onSubmit = (values, { setSubmitting }) => {
    const body = Object.entries(values).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {});
    api
      .put(USER(id), body)
      .then(() => {
        setSubmitting(false);
        onClose();
        toast.showSuccess("User updated successfully");
        pageRefresher();
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        setSubmitting(false);
        toast.showError(e);
      });
  };

  React.useEffect(() => {
    isOpen && fetchUser(id);
  }, [isOpen]);

  return (
    <>
      <Button size="xs" onClick={onOpen}>
        Edit
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minW="40vw">
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={formSchema} enableReinitialize={true}>
                {(props) => (
                  <Form>
                    <Stack spacing={5}>
                      <InputField label="Name" name="name" />
                      <InputField label="Email" name="email" />
                      <InputField label="Password" name="password" />
                    </Stack>
                    <Flex justify="flex-end" my="1em">
                      <Button type="submit" isLoading={props.isSubmitting}>
                        Submit
                      </Button>
                    </Flex>
                  </Form>
                )}
              </Formik>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditUserForm;
