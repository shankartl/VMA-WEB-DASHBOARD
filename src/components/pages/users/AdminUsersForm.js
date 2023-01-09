import { Box, Flex, InputGroup, InputRightElement, Text } from "@chakra-ui/react";
import { FieldArray, Form, Formik } from "formik";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlineFileUpload } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import * as Yup from "yup";
import { ADMIN_USERS } from "../../../constants/apiRoutes";
import api from "../../../services/api";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import useCustomToastr from "../../../utils/useCustomToastr";
import { Button } from "../../common";
import { InputField } from "../../formik";

const AdminUsersForm = (props) => {
  const toast = useCustomToastr();
  const adminFormSchema = Yup.object().shape({
    admins: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().min(2, "Too Short!").required("Name is required"),
        email: Yup.string().email().required("Email is required"),
        password: Yup.string().min(2, "Too Short!").required("Password is required"),
      })
    ),
  });
  const initialValues = {
    admins: [
      {
        name: "",
        email: "",
        password: "",
      },
    ],
  };

  let randomPassword = (size = 10) =>
    Array(size)
      .fill("!@#$%^&0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")
      .map((x) => x[Math.floor(Math.random() * x.length)])
      .join("");

  const onSubmit = (values, { setSubmitting }) => {
    api
      .post(ADMIN_USERS, values)
      .then(() => {
        toast.showSuccess({ description: "Admin users created successfully" });
        setSubmitting(false);
        props.fetchUsers();
        props.onClose();
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        setSubmitting(false);
        toast.showError(e);
      });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={adminFormSchema} onSubmit={onSubmit} enableReinitialize={true}>
      {(props) => (
        <Form>
          <FieldArray name="admins">
            {({ remove, push }) => (
              <>
                {props.values.admins.length > 0 &&
                  props.values.admins.map((admin, i) => (
                    <Box bg="tertiary" p={5} key={i} borderRadius="0.3em" my={"1em"}>
                      <Flex justifyContent="space-between">
                        <Text fontSize="1xl" fontWeight="medium" mb={3}>
                          Admin {i + 1}
                        </Text>
                        <Box _hover={{ cursor: "pointer" }} onClick={() => remove(i)}>
                          <RiDeleteBin6Fill />
                        </Box>
                      </Flex>
                      <Flex direction={["column", "row"]} w="100%" gap={3}>
                        <Box flex="1">
                          <InputField isInline={false} direction="column" label="Name" name={`admins.${i}.name`} isRequired />
                        </Box>
                        <Box flex="2">
                          <InputField isInline={false} direction="column" label="Email" name={`admins.${i}.email`} isRequired />
                        </Box>
                        <Box isInline flex="2" alignItems="center">
                          <InputGroup size="md" display="block">
                            <InputField isInline={false} direction="column" label="Password" name={`admins.${i}.password`} isRequired />
                            <InputRightElement width="9.5rem" pr="3">
                              <Text
                                cursor="pointer"
                                mt="45%"
                                color="darkBlue.500"
                                onClick={() => props.setFieldValue(`admins.${i}.password`, randomPassword())}
                              >
                                Generate password
                              </Text>
                            </InputRightElement>
                          </InputGroup>
                        </Box>
                      </Flex>
                    </Box>
                  ))}
                <Flex justifyContent="start">
                  <Button colorScheme="primary" onClick={() => push({ name: "", email: "", password: "" })}>
                    <AiOutlinePlus /> <Text ml={2}>Add next admin</Text>
                  </Button>
                </Flex>
              </>
            )}
          </FieldArray>
          <Box p={5} textAlign="end">
            <Button colorScheme="darkBlue" type="submit" isLoading={props.isSubmitting}>
              <MdOutlineFileUpload /> <Text ml={2}>Upload</Text>
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AdminUsersForm;
