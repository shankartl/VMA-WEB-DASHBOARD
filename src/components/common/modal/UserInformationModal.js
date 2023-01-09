import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import { React, useContext, useState } from "react";
import UserInfo from "../../pages/admin/UserInfo";
import UserInfoSideBar from "../../pages/admin/UserInfoSideBar";
import AgGrid from "../../utils/AgGrid";
import { IoIosRefresh } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { HiOutlinePause } from "react-icons/hi";
import { RiDeleteBin6Line, RiPlayCircleLine } from "react-icons/ri";
import { GoPrimitiveDot } from "react-icons/go";
import ResetPasswordModal from "../ResetPasswordModal";
import { AiOutlineInfoCircle } from "react-icons/ai";
import DeleteModal from "../../utils/DeleteModal";
import SuspendModal from "../../utils/SuspendModal";
import ModifyUserModal from "../../utils/ModifyUserModal";
import { DateFormat, TimeFormat } from "../../utils/DateFormat";
import { useEffect } from "react";
import api from "../../../services/api";
import { USER_LESSON_DETAILS, USER_LESSON_STATISTICS } from "../../../constants/apiRoutes";
import useCustomToastr from "../../../utils/useCustomToastr";
import { ProfilePlaceHolder } from "../../../constants/IconData";
import { SessionContext } from "../../context/SessionContext";

const UserInformationModal = (props) => {
  const toast = useCustomToastr();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: resetOpen, onOpen: resetOnOpen, onClose: resetOnClose } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
  const { isOpen: isOpenSuspend, onOpen: onOpenSuspend, onClose: onCloseSuspend } = useDisclosure();
  const { isOpen: isOpenModify, onOpen: onOpenModify, onClose: onCloseModify } = useDisclosure();
  const [isFetchingUserStats, ifusState] = useBoolean(false);
  const [userStats, setUserStats] = useState([]);
  const [usersData, setUsersData] = useState({});
  const sessionContext = useContext(SessionContext);
  const { session, setSession } = sessionContext;

  const deleteQuestion = (remove, index) => {
    onOpenDelete();
  };
  const getUserStats = async () => {
    try {
      ifusState.on();
      const response = await api.get(`${USER_LESSON_STATISTICS(props.data)}?session=${session}`);
      setUserStats(response);
      return response;
    } catch (error) {
      toast.showError(error);
    } finally {
      ifusState.off();
    }
  };
  const getUserData = () => {
    api.get(`${USER_LESSON_DETAILS(props.data)}?&session=${session}`).then((res) => {
      setUsersData(res);
    });
  };
  useEffect(() => {
    getUserData();
  }, []);
  useEffect(() => {
    if (props.data) {
      getUserStats();
    }
  }, [props.data]);
  const handleSuspendModal = () => {
    onOpenSuspend();
  };

  const closeModals = () => {
    props.onModalClose();
    props.closeAllModal();
  };
  const columns = [
    {
      header: "Lesson #",
      accessor: "lesson.number",
      width: 120,
      type: ["sortableColumn"],
      // cellRenderer: (params) => <Text>date</Text>,
    },
    {
      header: "Lesson duration",
      accessor: "lesson.duration",
      width: 150,
    },
    {
      header: "Repeats",
      accessor: "lesson.lesson_repeats",
      width: 100,
    },
    {
      header: "Date taken",
      accessor: "lesson.startedAt",
      width: 150,
      cellRenderer: (params) => {
        const startedAt = params?.data?.startedAt;
        return (
          <Box>
            <DateFormat data={startedAt} />
          </Box>
        );
      },
    },

    {
      header: "Time taken",
      accessor: "lesson.startedAt",
      width: 150,
      cellRenderer: (params) => {
        const startedTime = params?.data?.startedAt;
        return (
          <Box>
            <TimeFormat data={startedTime} />
          </Box>
        );
      },
    },
  ];
  return (
    <>
      <Modal isOpen={props.isModalOpen} size="sm" onClose={() => closeModals()}>
        <ModalOverlay />
        <ModalContent maxW={{ base: "90%", md: "80%", lg: "80%" }}>
          <ModalHeader>User Info</ModalHeader>
          <ModalCloseButton onClick={() => closeModals()} />
          <Grid templateColumns="repeat(12, 1fr)" px="6">
            <GridItem colSpan={{ base: "12", sm: "4", md: "9", lg: "9" }} order={{ base: "2", md: "1", lg: "1" }}>
              <Grid templateColumns="repeat(12, 1fr)" mb="4">
                <GridItem colSpan={{ base: "2", md: "1", lg: "1" }}>
                  {usersData?.profile_photo ? (
                    <Image
                      h="3em"
                      w="3em"
                      borderRadius="full"
                      src={
                        usersData?.profile_photo
                          ? `${process.env.REACT_APP_PROFILE_IMAGE_URL + usersData?.profile_photo}`
                          : require("../../../assets/userProfile.png")
                      }
                      alt="country-image"
                    />
                  ) : (
                    <ProfilePlaceHolder style={{ width: "40px", height: "40px" }} />
                  )}

                  {/* <Image h="3em" w="3em" borderRadius="full" src={"https://placekitten.com/100/100"} alt="country-image" /> */}
                </GridItem>
                <GridItem colSpan={{ base: "10", md: "11", lg: "11" }} ml={{ base: "2", md: "3", lg: "0" }}>
                  <Flex alignItems="center">
                    <Text fontSize="sm" fontWeight="bold">
                      {`${usersData?.firstName} ${usersData?.lastName}`}
                    </Text>

                    <Text fontSize="xs" color="darkred" ml="2">
                      {usersData?.status === "SUSPENDED" ? (
                        <Flex fontWeight="bold" alignItems="center">
                          <GoPrimitiveDot />
                          Suspended
                        </Flex>
                      ) : (
                        ""
                      )}
                    </Text>
                  </Flex>
                  <Text fontSize="xs" color="gray.500">
                    {usersData?.email}
                  </Text>
                </GridItem>
              </Grid>
              <UserInfo info={usersData} lessonProgress={userStats} averageDuration={userStats[0]?.average_duration} />
              <Grid templateColumns="repeat(12, 1fr)">
                <GridItem colSpan={12} height="20em">
                  <AgGrid data={userStats} columns={columns} />
                </GridItem>
              </Grid>
            </GridItem>

            {/* ------- */}

            <GridItem
              colSpan={{ base: "12", md: "3", lg: "3" }}
              order={{ base: "1", md: "2", lg: "2" }}
              p="5"
              borderLeft="1px solid lightGrey"
            >
              <Text fontSize="xs" color="gray.500" mb="2">
                Actions
              </Text>
              <Box display="flex" gap={{ base: "2", md: "2", lg: "2" }} flexDirection={{ base: "column", md: "column", lg: "column" }}>
                <UserInfoSideBar onClick={onOpenModify} icon={<FiEdit />} name="MODIFY" _hover={{ color: "orange" }} />
                <UserInfoSideBar onClick={resetOnOpen} icon={<IoIosRefresh />} name="RESET PASSWORD" _hover={{ color: "orange" }} />
                <UserInfoSideBar
                  icon={usersData?.status === "SUSPENDED" ? <RiPlayCircleLine /> : <HiOutlinePause />}
                  onClick={handleSuspendModal}
                  name={usersData?.status === "SUSPENDED" ? "UNSUSPEND" : "SUSPEND"}
                  _hover={{ color: "orange" }}
                />
                <UserInfoSideBar
                  icon={<RiDeleteBin6Line />}
                  name="DELETE USER"
                  color="darkred"
                  _hover={{ color: "darkred" }}
                  onClick={() => deleteQuestion()}
                  cursor="pointer"
                />
                <SuspendModal
                  isOpen={isOpenSuspend}
                  onClose={onCloseSuspend}
                  selectedUsers={null}
                  closeAddUserModal={props.onModalClose}
                  setUsersData={props.setUsersData}
                  userId={props.data}
                  userStats={getUserStats}
                  status={usersData?.status}
                  selectedUser={
                    usersData?.status === "ACTIVE"
                      ? { name: "SUSPEND_SINGLE_USER" }
                      : usersData?.status === "SUSPENDED"
                      ? { name: "UNSUSPEND_SINGLE_USER" }
                      : ""
                  }
                  name="COURSE_TEST_SUSPEND"
                  fetchUserAssessmentAnswers={props.fetchUserAssessmentAnswers}
                />
                <DeleteModal
                  isOpen={isOpenDelete}
                  onClose={onCloseDelete}
                  closeAddUserModal={props.onModalClose}
                  selectedUser={{ name: "DELETE_SINGLE_USER" }}
                  setUsersData={setUsersData}
                  userStats={getUserStats}
                  userId={props.data}
                  name="COURSE_TEST_DELETE"
                  fetchUserAssessmentAnswers={props.fetchUserAssessmentAnswers}
                />
                <ResetPasswordModal
                  closeAddUserModal={props.onModalClose}
                  isOpen={resetOpen}
                  onClose={resetOnClose}
                  userId={props.data}
                  setUsersData={setUsersData}
                  userStats={getUserStats}
                  fetchUserAssessmentAnswers={props.fetchUserAssessmentAnswers}
                  name="COURSE_TEST_RESET_PASSWORD"
                />
                <ModifyUserModal
                  isOpen={isOpenModify}
                  onClose={onCloseModify}
                  closeAddUserModal={props.onModalClose}
                  usersData={usersData}
                  setUsersData={setUsersData}
                  userStats={getUserStats}
                  name="COURSE_TEST_MODIFY"
                  fetchUserAssessmentAnswers={props.fetchUserAssessmentAnswers}
                />
              </Box>
            </GridItem>
          </Grid>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserInformationModal;
