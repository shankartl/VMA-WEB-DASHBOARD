import React from "react";
import { Box, Flex, Text, Button, Stack, Show, Image, useBoolean } from "@chakra-ui/react";
import { ReactComponent as Logo } from "../../../assets/home.png";
import logo from "../../../assets/music-commission-logo.jpg";
import { Form, Formik } from "formik";
import { InputField, PasswordField } from "../../formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { LOGIN } from "../../../constants/apiRoutes";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import { useAuth } from "../../../services/auth";
import useCustomToastr from "../../../utils/useCustomToastr";
import ResetPassword from "./ResetPassword";

const AdminLoginDrums = () => {
  const navigate = useNavigate();
  const toast = useCustomToastr();
  const [isLoadingData, ilsState] = useBoolean(false);

  const loginFormSchema = Yup.object().shape({
    email: Yup.string().min(2, "Too Short!").required("Required"),
    password: Yup.string().min(2, "Too Short!").required("Required"),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const onSubmit = (values, { setSubmitting }) => {
    const drumsLoginCredentials = { ...values, accessibleCourse: "DRUMS" };
    ilsState.on();
    api
      .post(LOGIN, drumsLoginCredentials)
      .then((response) => {
        const {
          tokens: {
            access: { token },
          },
          user: {
            firstName,
            lastName,
            email,
            phoneNumber,
            id,
            role,
            accessibleCourses,
            dob,
            profile_photo,
            attendedPreLessonTest,
            attendedPostLessonTest,
          },
        } = response;
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: {
              firstName,
              lastName,
              email,
              phoneNumber,
              role,
              id,
              accessibleCourses,
              dob,
              profile_photo,
              attendedPreLessonTest,
              attendedPostLessonTest,
            },
            token,
          })
        );
        navigate(`/${role.toLowerCase()}/home`);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
        setSubmitting(false);
      })
      .finally(() => {
        ilsState.off();
      });
  };

  return (
    <>
      <Flex bg="linearGray" pos="fixed" top="0" left="0" right="0" bottom="0" zIndex={2}>
        <Box w={["100%", "50%", "50%", "50%"]} my={[0, "auto", "auto", "auto"]}>
          <Box w={["100%", "70%", "70%", "60%"]} display="flex" flexDirection="column" pl={[1, 6, 8, 10]}>
            <Box bg="white" borderRadius="10px" p="5">
              <Box display="flex" m="1">
                <Box w="50%"></Box>
                <Image src={logo} w="50%" />
              </Box>
              <Box mx="3">
                <Text fontSize="0.9em" fontWeight="600">
                  Login to
                </Text>
                <Text fontSize="1.4em" fontWeight="600" mt="0">
                  Drums XR
                </Text>
              </Box>
              <Box mt={10}>
                <Formik initialValues={initialValues} validationSchema={loginFormSchema} onSubmit={onSubmit} enableReinitialize={true}>
                  {(props) => (
                    <Form autoComplete="off">
                      <Stack mx="3" spacing={5}>
                        <InputField isInline={false} direction="column" label="Email" name="email" isRequired isAdmin="true" />
                        <PasswordField isInline={false} direction="column" label="Password" name="password" isRequired isAdmin="true" />
                        {/* submit button */}
                        {/* <ResetPassword /> */}
                        <Box textAlign={{ base: "center", md: "end" }} pb="5">
                          <Button
                            _hover={{ bg: "#EB5A3C", color: "#ffff" }}
                            w={{ base: "100%" }}
                            bg="#EB5A3C"
                            color="#ffff"
                            type="submit"
                            isLoading={isLoadingData}
                            loadingText={"Submitting"}
                            spinnerPlacement={"end"}
                          >
                            LOG IN
                          </Button>
                        </Box>
                      </Stack>
                    </Form>
                  )}
                </Formik>
              </Box>
            </Box>
            <Link to="/login">
              <Text textDecoration="underline" fontSize="0.9em" pt="3">
                Go to Guitar XR Admin
              </Text>
            </Link>
          </Box>
        </Box>
        <Show above="sm">
          <Flex
            w={"50%"}
            // eslint-disable-next-line no-undef
            backgroundImage={`url(${require("../../../assets/adminLoginDrums.png")})`}
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            d={{ sm: "none", lg: "flex" }}
            backgroundSize="cover"
          ></Flex>
        </Show>
      </Flex>
    </>
  );
};

export default AdminLoginDrums;
