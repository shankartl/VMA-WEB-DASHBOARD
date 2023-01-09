import React from "react";
import {
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Flex,
  Image,
} from "@chakra-ui/react";
import { ReactComponent as Logo } from "../../../assets/logo.svg";
import logo from "../../../assets/music-commission-logo.jpg";
import { InputField } from "../../formik";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import api from "../../../services/api";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import useCustomToastr from "../../../utils/useCustomToastr";
import { RESEND_OTP, SEND_OTP, UPDATE_PASSWORD_WITH_OTP, VERIFY_OTP } from "../../../constants/apiRoutes";
import { Tickmark } from "../../common";

const ResetPassword = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useCustomToastr();

  const [isOtpSent, setIsOtpSent] = React.useState(false);
  const [isOtpVerified, setIsOtpVerified] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");

  const EmailInputForm = () => {
    const initialValues = { email: "" };
    const emailSchema = Yup.object().shape({
      email: Yup.string().email("Invalid email").required("Required"),
    });
    const onSubmit = (values, { setSubmitting }) => {
      api
        .post(SEND_OTP, values)
        .then(() => {
          toast.showSuccess("OTP sent successfully");
          setIsOtpSent(true);
          setEmail(values.email);
          setSubmitting(false);
        })
        .catch((error) => {
          const e = formattedErrorMessage(error);
          toast.showError(e);
          setSubmitting(false);
        });
    };
    return (
      <>
        <Text fontSize="sm">Please enter the email you use to login</Text>
        <Formik initialValues={initialValues} validationSchema={emailSchema} onSubmit={onSubmit} enableReinitialize={true}>
          {(props) => (
            <Form>
              <InputField
                isInline={false}
                direction="column"
                label="Email"
                name="email"
                isRequired
                containerStyle={{
                  marginTop: "1em",
                }}
              />
              <Flex justifyContent="center" mt={6}>
                <Button colorScheme="purple" type="submit" isLoading={props.isSubmitting}>
                  Send OTP
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </>
    );
  };

  const OtpInputForm = () => {
    const initialValues = { otp: "" };
    const [isLoading, setLoading] = React.useState(false);
    const otpSchema = Yup.object().shape({
      otp: Yup.string()
        .required()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(6, "Invalid OTP")
        .max(6, "Invalid OTP")
        .required("Required"),
    });
    const onSubmit = (values, { setSubmitting }) => {
      api
        .post(VERIFY_OTP, { email, code: values.otp })
        .then(() => {
          toast.showSuccess("OTP verified successfully");
          setIsOtpSent(false);
          setCode(values.otp);
          setIsOtpVerified(true);
          setLoading(false);
          setSubmitting(false);
        })
        .catch((error) => {
          const e = formattedErrorMessage(error);
          toast.showError(e);
          setLoading(false);
          setSubmitting(false);
        });
    };

    return (
      <>
        <Text fontSize="sm">Please enter the OTP sent to your email</Text>
        <Formik initialValues={initialValues} validationSchema={otpSchema} onSubmit={onSubmit} enableReinitialize={true}>
          {(props) => (
            <Form>
              <InputField
                isInline={false}
                direction="column"
                label="OTP"
                name="otp"
                isRequired
                containerStyle={{
                  marginTop: "1em",
                }}
              />
              <Flex justifyContent="center" mt={6} gap={4}>
                <Button
                  colorScheme="darkBlue"
                  variant="outline"
                  onClick={() => {
                    setLoading(true);
                    api
                      .post(RESEND_OTP, { email })
                      .then(() => {
                        setLoading(false);
                        toast.showSuccess("OTP re-sent successfully");
                      })
                      .catch((error) => {
                        const e = formattedErrorMessage(error);
                        toast.showError(e);
                        setLoading(false);
                      });
                  }}
                  isLoading={isLoading}
                >
                  Resend OTP
                </Button>
                <Button colorScheme="darkBlue" type="submit" isLoading={props.isSubmitting}>
                  Verify OTP
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </>
    );
  };

  const ResetPasswordForm = () => {
    const initialValues = { password: "", confirmPassword: "", email, code };
    const passwordSchema = Yup.object().shape({
      password: Yup.string().required("Required"),
      confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match"),
      email: Yup.string().email("Invalid email").required("Required"),
      code: Yup.string().required("Required"),
    });
    const [isSuccess, setIsSuccess] = React.useState(false);
    const onSubmit = (values, { setSubmitting }) => {
      // eslint-disable-next-line
      const { confirmPassword, ...data } = values;
      api
        .post(UPDATE_PASSWORD_WITH_OTP, data)
        .then(() => {
          setIsSuccess(true);
          toast.showSuccess("Password reset successfully");
        })
        .then(() => {
          return new Promise((resolve) => setTimeout(() => resolve(), 2000));
        })
        .then(() => {
          onClose();
          setIsOtpVerified(false);
          setIsOtpSent(false);
          setEmail("");
          setCode("");
          setSubmitting(false);
        })
        .catch((error) => {
          const e = formattedErrorMessage(error);
          toast.showError(e);
          onClose();
          setIsOtpVerified(false);
          setIsOtpSent(false);
          setEmail("");
          setCode("");
          setSubmitting(false);
        });
    };
    return isSuccess ? (
      <Tickmark />
    ) : (
      <>
        <Text fontSize="sm">Please enter your new password</Text>
        <Formik initialValues={initialValues} validationSchema={passwordSchema} onSubmit={onSubmit} enableReinitialize={true}>
          {(props) => (
            <Form>
              <InputField
                isInline={false}
                direction="column"
                label="Password"
                name="password"
                isRequired
                containerStyle={{
                  marginTop: "1em",
                }}
              />
              <InputField
                isInline={false}
                direction="column"
                label="Confirm Password"
                name="confirmPassword"
                isRequired
                containerStyle={{
                  marginTop: "1em",
                }}
              />
              <Flex justifyContent="center" mt={6} gap={4}>
                <Button
                  colorScheme="darkBlue"
                  variant="outline"
                  onClick={() => {
                    setIsOtpVerified(false);
                    setIsOtpSent(false);
                    setEmail("");
                    setCode("");
                  }}
                >
                  Start Over
                </Button>
                <Button colorScheme="darkBlue" type="submit" isLoading={props.isSubmitting}>
                  Reset Password
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </>
    );
  };

  return (
    <>
      <Text fontSize="sm" onClick={onOpen} _hover={{ cursor: "pointer", textDecoration: "underline", color: "darkBlue.500" }}>
        Forgot password?
      </Text>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent py={5} px={3}>
          <ModalHeader>
            <Image src={logo} w="50%" />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={3}>
            <Text fontSize="1xl" fontWeight="medium">
              Forgot your password ?
            </Text>
            {isOtpVerified ? <ResetPasswordForm /> : isOtpSent ? <OtpInputForm /> : <EmailInputForm />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ResetPassword;
