import React, { useEffect, useState } from "react";
import {
  GridItem,
  Grid,
  Text,
  Stack,
  Button,
  Box,
  Divider,
  Image,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useBoolean,
  Input,
} from "@chakra-ui/react";
import { IoHandLeftOutline, IoHandRightOutline } from "react-icons/io5";
import { Form, Formik } from "formik";
import { DatePickerField, InputField, MultiSelectField, PasswordField } from "../../formik";
import profileImage from "../../../assets/profile-img.png";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import api from "../../../services/api";
import useCustomToastr from "../../../utils/useCustomToastr";
import { RESET_LESSON, UPDATE_CURRENT_USER, UPDATE_USER, UPLOAD_PROFILE_PICTURE } from "../../../constants/apiRoutes";
import { format } from "date-fns";
import { updateUserLocalData } from "../../../services/auth";
import ConfirmationPopup from "../../common/modal/ConfirmationPopup";
import { ProfilePlaceHolder } from "../../../constants/IconData";
import * as Yup from "yup";

const AppSettings = () => {
  const [industriesData, setIndustriesData] = React.useState(["Eng", "Tam", "Hin"]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = JSON.parse(window.localStorage?.auth);
  const { firstName, lastName, email, id, dob = "", profile_photo, phoneNumber } = currentUser.user;
  const [isRestingLesson, irlState] = useBoolean(false);
  const [isUserUpdating, iuuState] = useBoolean(false);
  const [isConfirmationModalOpen, icmState] = useBoolean(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [updatedProfilePicture, setUpdatedProfilePicture] = useState("");
  const validationSchema = Yup.object({
    firstName: Yup.string().max(15, "Must be 15 characters or less").required("Required"),
    lastName: Yup.string().max(20, "Must be 20 characters or less").required("Required"),
    phoneNumber: Yup.string().max(10, "Must be 10 Digits").min(10, "Must be 10 Digits").required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    currentPassword: Yup.string().optional(),
    newPassword: Yup.string()
      .min(8, "Password must be 8 characters long")
      .max(16, "only 16 characters allowed")
      .matches(/[0-9]/, "Password must contain one Number")
      .matches(/[A-Z]/, "Password must contain one uppercase letter")
      .matches(/[^\w]/, "Password must contain one symbol")
      .optional(),
  });

  const initialValues = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    dob: dob ? new Date(dob) : "",
    phoneNumber: phoneNumber,
    currentPassword: "",
    newPassword: "",
  };

  const toast = useCustomToastr();

  const resetLesson = async () => {
    try {
      irlState.on();
      const response = await api.remove(RESET_LESSON(id));
      toast.showSuccess({ description: `Lesson Resetted Successfully` });
      onClose();
      return response;
    } catch (e) {
      toast.showError({ description: `${e?.message}` });
    } finally {
      irlState.off();
    }
  };

  useEffect(() => {
    if (profilePicture) {
      updateProfile();
    }
  }, [profilePicture]);

  useEffect(() => {
    setUpdatedProfilePicture(profile_photo);
  }, [profile_photo]);

  const updateUser = async (body) => {
    try {
      const payload = {};

      for (const prop in body) {
        if (body[prop]) {
          payload[prop] = body[prop];
        }
      }
      iuuState.on();
      const response = await api.put(UPDATE_CURRENT_USER(), payload);
      toast.showSuccess({ description: `User Updated Successfully` });
      updateUserLocalData(response);
      return response;
    } catch (e) {
      toast.showError({ description: `${e?.message}` });
    } finally {
      iuuState.off();
    }
  };

  const updateProfile = async (files) => {
    try {
      const file = profilePicture[0];
      const formData = new FormData();
      await formData.append("file", file);
      const response = await api.put(UPLOAD_PROFILE_PICTURE(id), formData, {
        headers: {
          "Contetnt-Type": "multipart/form-data",
        },
      });
      toast.showSuccess({ description: `Profile Picture Successfully` });
      updateUserLocalData(response);
      setUpdatedProfilePicture(response?.profile_photo);
      return response;
    } catch (error) {
      toast.showError({ description: `${error?.message}` });
    }
  };

  return (
    <Box>
      <Formik
        onSubmit={(values) => {
          updateUser(values);
        }}
        validationSchema={validationSchema}
        initialValues={initialValues}
        enableReinitialize={true}
      >
        {(props) => (
          <Form autoComplete="off">
            {/* <Divider my="7" /> */}
            <Grid templateColumns="repeat(12, 1fr)" gap={6}>
              <GridItem colSpan={{ base: "12", md: "6", lg: "6" }}>
                <Text fontSize="sm">Your Profile</Text>
              </GridItem>
              <GridItem colSpan={{ base: "12", md: "6", lg: "6" }}>
                <Text mb="3" fontSize="xs">
                  Profile Image
                </Text>
                {/* <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                  <GridItem colSpan={{ base: "12", md: "6", lg: "6" }}>
                    <Text fontSize="sm">App settings</Text>
                  </GridItem>
                  <GridItem colSpan={{ base: "12", md: "6", lg: "6" }}>
                    <Text mb="3" fontSize="xs">
                      Hand dominance
                    </Text>
                    <Stack direction="row" spacing={1} mb="3">
                      <Button borderRightRadius="0" leftIcon={<IoHandLeftOutline />} variant="solid" w="100%">
                        Left-handed
                      </Button>
                      <Button
                        color="orange"
                        border="1px"
                        borderColor="#EB5A3C"
                        borderLeftRadius="0"
                        backgroundColor="lightorange"
                        leftIcon={<IoHandRightOutline />}
                        variant="outline"
                        w="100%"
                      >
                        Right-handed
                      </Button>
                    </Stack>
                    <Text fontSize="xs">Language</Text>
                    <Box w={{ base: "100%", sm: "100%%", md: "100%", lg: "100%" }}>
                      <Stack>
                        <MultiSelectField
                          options={industriesData.map((i) => ({ label: i.name, value: i.id }))}
                          name="industries"
                          direction="column"
                          containerStyle={{ mt: 0, mb: 3 }}
                          {...props}
                        />
                      </Stack>
                    </Box>
                  </GridItem>
                </Grid> */}
                <Grid templateColumns="repeat(12, 1fr)" gap={6} my="3">
                  <GridItem colSpan={{ base: "4", md: "4", lg: "4" }}>
                    {updatedProfilePicture ? (
                      <Image src={process.env.REACT_APP_PROFILE_IMAGE_URL + updatedProfilePicture} alt="profileImage" h="6em" />
                    ) : (
                      <ProfilePlaceHolder />
                    )}
                  </GridItem>
                  <GridItem colSpan={{ base: "8", md: "8", lg: "8" }}>
                    <Stack flexDirection="column">
                      <Button fontSize="sm" leftIcon={<FiEdit />} variant="solid" w="60%">
                        Edit picture
                        <Input
                          type="file"
                          height="100%"
                          width="100%"
                          position="absolute"
                          top="0"
                          left="0"
                          opacity="0"
                          aria-hidden="true"
                          accept="image/*"
                          onChange={(e) => {
                            setProfilePicture(e.target.files);
                          }}
                        />
                      </Button>
                      <Button
                        onClick={() => {
                          icmState.on();
                        }}
                        fontSize="sm"
                        leftIcon={<RiDeleteBin6Line color="darkred" />}
                        variant="solid"
                        w="60%"
                      >
                        Delete picture
                      </Button>
                    </Stack>
                  </GridItem>
                </Grid>
                <Grid templateColumns="repeat(12,1fr)" gap={6} my="3">
                  <GridItem colSpan={{ base: "12", md: "6", lg: "6" }}>
                    <InputField direction="column" isInline={false} label="First name" name="firstName" isRequired />
                  </GridItem>
                  <GridItem colSpan={{ base: "12", md: "6", lg: "6" }}>
                    <InputField direction="column" isInline={false} label="Last name" name="lastName" isRequired />
                  </GridItem>
                </Grid>
                <Grid templateColumns="repeat(12,1fr)" gap={6} my="3">
                  <GridItem colSpan={{ base: "12", md: "12", lg: "12" }}>
                    <InputField direction="column" isInline={false} label="Email" name="email" isDisabled />
                  </GridItem>
                </Grid>
                <Grid templateColumns="repeat(12,1fr)" gap={6} my="3">
                  <GridItem colSpan={{ base: "12", md: "12", lg: "12" }}>
                    <DatePickerField direction="column" isInline={false} label="Date of Birth" name="dob" isRequired />
                  </GridItem>
                </Grid>
                <Grid templateColumns="repeat(12,1fr)" gap={6} my="3">
                  <GridItem colSpan={{ base: "12", md: "12", lg: "12" }}>
                    <PasswordField direction="column" isInline={false} label="Current Password" name="currentPassword" />
                  </GridItem>
                </Grid>
                <Grid templateColumns="repeat(12,1fr)" gap={6} my="3">
                  <GridItem colSpan={{ base: "12", md: "12", lg: "12" }}>
                    <PasswordField direction="column" isInline={false} label="New Password" name="newPassword" />
                  </GridItem>
                </Grid>
              </GridItem>
            </Grid>
            <Divider my="7" />
            {/* <Grid templateColumns="repeat(12,1fr)" gap={6} mb="10">
              <GridItem colSpan={{ base: "12", md: "6", lg: "6" }}>
                <Text fontSize="sm">Start over?</Text>
              </GridItem>
              <GridItem colSpan={{ base: "12", md: "6", lg: "6" }}>
                <SimpleGrid columns={[1, 2]} spacingX="20" spacingY="2">
                  <Box>
                    <Button onClick={onOpen} _hover={{ bg: "#BF354B" }} fontSize="sm" leftIcon={<FiEdit />} bg="darkred" color="white">
                      Reset lesson progress
                    </Button>
                  </Box>
                  <Box alignSelf="center">
                    <Text fontSize="xs">This cannot be undone</Text>
                  </Box>
                </SimpleGrid>
              </GridItem>
            </Grid> */}
            {/* -- */}

            <ConfirmationPopup
              isOpen={isConfirmationModalOpen}
              onClose={icmState.off}
              isLoading={isUserUpdating}
              onSubmit={() => updateUser({ profile_photo: "" })}
              header={"Are you sure want to delete Profile Picture?"}
            />
            {/* --- */}
            <GridItem position={"absolute"} top={0} right={"-300px"} colSpan={{ base: "12", md: "12", lg: "4" }}>
              <Box textAlign={{ base: "center", md: "center", lg: "left" }} mb="5">
                <Button fontSize="sm" w="7em">
                  Cancel
                </Button>
                <Button
                  isLoading={isUserUpdating}
                  loadingText={"Updating"}
                  spinnerPlacement={"end"}
                  bg="orange"
                  type="submit"
                  color="white"
                  _hover={{ bg: "#E66E56" }}
                  fontSize="sm"
                  ml="3"
                  w="8em"
                >
                  Save
                </Button>
              </Box>
            </GridItem>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent w="90%">
                <Box p={{ base: "1", md: "8", lg: "8" }} textAlign="center">
                  <ModalHeader fontSize="3xl">Reset lesson progress?</ModalHeader>
                  <ModalBody px={{ base: "2em", md: "5em", lg: "5em" }} fontSize="sm">
                    This will delete all your progress and cannot be undone.
                  </ModalBody>
                </Box>
                <ModalFooter justifyContent="space-evenly" gap="4">
                  <Button w="100%" onClick={onClose} _hover={{ bg: "#1D313E" }} fontSize="sm" bg="dark" color="white">
                    Cancel
                  </Button>
                  <Button
                    w="100%"
                    onClick={() => {
                      resetLesson();
                    }}
                    isLoading={isRestingLesson}
                    spinnerPlacement={"end"}
                    loadingText={"Reseting"}
                    _hover={{ bg: "#BF354B" }}
                    fontSize="sm"
                    leftIcon={<FiEdit />}
                    bg="darkred"
                    color="white"
                  >
                    Delete
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Divider my="7" />
            <Grid templateColumns="repeat(12,1fr)" gap={6} mb="10">
              <GridItem colSpan={{ base: "12", md: "6", lg: "6" }}>
                <Text fontSize="sm">App info</Text>
              </GridItem>
              <GridItem colSpan={{ base: "12", md: "6", lg: "6" }}>
                <Text fontSize="xs">Guitar AR </Text>
                <Text fontSize="xs">Saudi Music Commission | Saudi Ministry of Culture</Text>
              </GridItem>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AppSettings;
