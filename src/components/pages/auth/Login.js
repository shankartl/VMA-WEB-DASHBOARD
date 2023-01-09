import React from "react";
import { Box, Flex, Text, Button, Stack, Show, Image, InputRightElement, InputGroup, Input } from "@chakra-ui/react";
import { ReactComponent as Logo } from "../../../assets/home.png";
import logo from "../../../assets/music-commission-logo.jpg";
import { Form, Formik } from "formik";
import { FlushedInputField, InputField, PasswordField } from "../../formik";
import * as Yup from "yup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { LOGIN } from "../../../constants/apiRoutes";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import { useAuth } from "../../../services/auth";
import useCustomToastr from "../../../utils/useCustomToastr";
import ResetPassword from "./ResetPassword";

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useCustomToastr();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const loginFormSchema = Yup.object().shape({
    email: Yup.string().min(2, "Too Short!").required("Required"),
    password: Yup.string().min(2, "Too Short!").required("Required"),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const onSubmit = (values, { setSubmitting }) => {
    api
      .post(LOGIN, values)
      .then((response) => {
        const {
          tokens: {
            access: { token },
          },
          user: { firstName, lastName, email, phoneNumber, id, role, accessibleCourses },
        } = response;

        const auth = JSON.stringify({ user: { firstName, lastName, email, phoneNumber, id, role, accessibleCourses }, token });
        localStorage.setItem("auth", auth);
        navigate(`/${role.toLowerCase()}/home`);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
        setSubmitting(false);
      });
  };

  return user?.role ? (
    <Navigate to={`/${user.role.toLowerCase()}/home`} replace />
  ) : (
    <Flex bg="white" pos="fixed" top="0" left="0" right="0" bottom="0" zIndex={2}>
      <Flex
        w={{ base: "100%", lg: "50%" }}
        direction="column"
        align={{ base: "left", md: "left" }}
        justify={{ base: "left", md: "left" }}
        px={{ base: "5em" }}
      >
        <Box mt="3">
          <Image src={logo} w="50%" />
        </Box>

        <Box w={{ base: "auto", md: "100%", lg: "100%" }} m={{ base: "auto", lg: "auto" }} mx={0}>
          <Text
            lineHeight={1}
            fontSize={{ base: "4xl", md: "3xl", lg: "3xl" }}
            w={{ base: "100%" }}
            mx={{ base: "0.5em" }}
            fontWeight="600"
            textAlign={{ base: "left" }}
            mb={10}
          >
            Sign in to Guitar Learning
          </Text>

          <Box w={{ base: "100%", sm: "80%", md: "80%" }} mt={10}>
            <Formik initialValues={initialValues} validationSchema={loginFormSchema} onSubmit={onSubmit} enableReinitialize={true}>
              {(props) => (
                <Form>
                  <Stack mx="3" spacing={5}>
                    <FlushedInputField isInline={false} direction="column" label="Email" name="email" isRequired autoComplete="off" />

                    <PasswordField
                      isInline={false}
                      direction="column"
                      label="Password"
                      name="password"
                      isRequired
                      autoComplete="new-password"
                    />

                    <ResetPassword />
                    <Box textAlign={{ base: "center", md: "end" }}>
                      <Button w={{ base: "100%" }} colorScheme="purple" type="submit" isLoading={props.isSubmitting}>
                        SIGN IN
                      </Button>
                    </Box>
                    <Link to="/drumsLogin">Go to DrumsXR Admin</Link>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Flex>
      <Show above="sm">
        <Flex
          w={"50%"}
          // eslint-disable-next-line no-undef
          backgroundImage={`url(${require("../../../assets/guitar-login.png")})`}
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          d={{ sm: "none", lg: "flex" }}
          backgroundSize="cover"
        ></Flex>
      </Show>
    </Flex>
  );
};

export default Login;
