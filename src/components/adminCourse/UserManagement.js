import React, { useContext, useState } from "react";
import { Button, Layout } from "../common";
import { Box, Flex, Grid, GridItem, Image, Input, InputGroup, InputLeftElement, Text, useBoolean, useDisclosure } from "@chakra-ui/react";
import UserAgGrid from "../utils/UserAgGrid";
import { FiUserPlus } from "react-icons/fi";
import { BsDot } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import { FiPauseCircle } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import StatusText from "../utils/StatusText";
import ProgressBar from "../utils/ProgressBar";
import UserView from "../utils/UserView";
import DeleteModal from "../utils/DeleteModal";
import SuspendModal from "../utils/SuspendModal";
import UserModal from "../common/UserModal";
import AddUserModal from "../utils/AddUserModal";
import ModifyUserModal from "../utils/ModifyUserModal";
import { useEffect } from "react";
import api from "../../services/api";
import { USERS } from "../../constants/apiRoutes";
import { toTitleCase } from "../../utils/commonUtil";
import { ProfilePlaceHolder } from "../../constants/IconData";
import { digitalTime } from "../utils/DateFormat";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { SessionContext } from "../context/SessionContext";
const UserManagement = () => {
  const [, setGridApi] = React.useState(null);
  const [, setGridColumnApi] = React.useState(null);
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
  const { isOpen: isOpenSuspend, onOpen: onOpenSuspend, onClose: onCloseSuspend } = useDisclosure();
  const { isOpen: isOpenAddUser, onOpen: onOpenAddUser, onClose: onCloseAddUser } = useDisclosure();
  const [showDeletebutton, setShowDeleteButton] = useBoolean(false);
  const [userIds, setUserIds] = useState([]);
  const [usersData, setUsersData] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const sessionContext = useContext(SessionContext);
  const { session, setSession } = sessionContext;
  const [selectedUserId, setSelectedUserId] = useState("");
  const [openModal, iomState] = useBoolean(false);
  const [userInformation, setUserInformation] = useState([]);

  useEffect(() => {
    api.get(`${USERS}?search=${search}&session=${session}`).then((res) => {
      setUsersData(res);
    });
  }, [search, session]);
  const suspendedUsers = usersData.filter((data) => {
    return data.status === "SUSPENDED";
  });
  const handleView = (id, data) => {
    iomState.on();
    setSelectedUserId(id);
    setUserInformation(data);
  };

  const userProfileRenderer = ({ data }) => {
    return (
      <Box display="flex" gap="3" alignItems="center">
        <Box>
          {data?.profile_photo ? (
            <Image
              src={
                data?.profile_photo
                  ? `${process.env.REACT_APP_PROFILE_IMAGE_URL + data?.profile_photo}`
                  : require("../../assets/userProfile.png")
              }
              borderRadius="50%"
              h="40px"
              w="40px"
            />
          ) : (
            <ProfilePlaceHolder style={{ width: "40px", height: "40px" }} />
          )}
        </Box>
        <Box display="flex" flexDirection="column" lineHeight="2em">
          <Text fontSize="md" fontWeight="bold">
            {toTitleCase(`${data.firstName} ${data.lastName}`)}
          </Text>
          <Text fontSize="sm" color="gray">
            {data.email}
          </Text>
        </Box>
      </Box>
    );
  };
  const columns = [
    {
      header: "Name & Email",
      accessor: "firstName",
      width: 300,
      cellRenderer: (params) => {
        return userProfileRenderer(params);
      },
      type: ["checkBoxSelection"],
    },
    {
      header: "Lesson Progress",
      accessor: "lesson",
      width: 350,
      type: ["sortableColumn"],

      cellRenderer: (params) => <ProgressBar value={params.data} />,
    },
    {
      header: "Average Duration",
      accessor: "lesson.averageDuration",
      cellRenderer: (params) => {
        const average = params.data.averageDuration;

        return (
          <Box>
            <Text>{isNaN(average) ? 0 : digitalTime(average)}</Text>
          </Box>
        );
      },
    },
    // {
    //   header: "Average Pace",
    //   accessor: "averagePace",
    //   cellRenderer: () => {
    //     return 0;
    //   },
    // },
    {
      header: "Account Status",
      accessor: "status",
      cellRenderer: (params) => <StatusText accountStatus={params.data} />,
    },
    {
      header: "",
      accessor: "view",
      cellRenderer: (params) => {
        return (
          <Box className="viewBtn">
            <Button
              fontSize="xs"
              bg="white"
              color="black"
              border="0.5px solid lightgrey"
              leftIcon={<AiOutlineInfoCircle fontSize="16px" />}
              p="6"
              _hover={{
                background: "white",
                color: "black",
              }}
              onClick={() => {
                handleView(params.data?.id, params.data);
              }}
            >
              VIEW
            </Button>
          </Box>
        );
      },
    },
  ];
  return (
    <Layout>
      <Flex gap="3" align="baseline" mb="4">
        <Text fontSize="3xl" fontWeight="bold">
          Users
        </Text>
        <Text fontSize="sm" color="gray">
          {usersData?.length} in total
        </Text>
        <Text fontSize="sm" color="gray">
          <Flex align="center">
            <BsDot />
            <Text>{suspendedUsers.length} suspended</Text>
          </Flex>
        </Text>
      </Flex>
      <Grid templateColumns="repeat(12,1fr)" w={{ base: "100%", sm: "100%", md: "100%", lg: "95%" }} gap="3" alignItems="center">
        <GridItem colSpan={{ base: "12", md: "3", lg: "5" }}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <IoSearchOutline />
            </InputLeftElement>

            <Input
              type="text"
              variant="flushed"
              placeholder="Search by name or email"
              fontSize="sm"
              w="60%"
              borderColor="gray.300"
              borderWidth="0 0 2px"
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </GridItem>
        <GridItem colSpan={{ base: "12", md: "9", lg: "7" }} textAlign={{ base: "center", md: "right", lg: "right" }}>
          <Grid templateColumns="repeat(12,1fr)" gap={{ base: "4", sm: "4", md: "4", lg: "2" }}>
            <GridItem colSpan={{ base: "6", sm: "4", md: "4", lg: "4" }}>
              {showDeletebutton && (
                <Button
                  w="100%"
                  onClick={onOpenDelete}
                  fontSize="xs"
                  bg="white"
                  color="black"
                  border="0.5px solid lightgrey"
                  leftIcon={<RiDeleteBinLine fontSize="16px" />}
                  p="6"
                  size="xs"
                  _hover={{
                    background: "white",
                    color: "black",
                  }}
                >
                  DELETE USERS
                </Button>
              )}
            </GridItem>
            <GridItem colSpan={{ base: "6", sm: "4", md: "4", lg: "4" }}>
              {showDeletebutton && (
                <Button
                  w="100%"
                  onClick={onOpenSuspend}
                  fontSize="xs"
                  bg="white"
                  color="black"
                  border="0.5px solid lightgrey"
                  leftIcon={<FiPauseCircle fontSize="16px" />}
                  p="6"
                  _hover={{
                    background: "white",
                    color: "black",
                  }}
                >
                  SUSPEND USERS
                </Button>
              )}
            </GridItem>
            <GridItem colSpan={{ base: "12", sm: "4", md: "4", lg: "4" }}>
              <Button
                w="100%"
                onClick={onOpenAddUser}
                fontSize="xs"
                bg="orange"
                color="white  "
                leftIcon={<FiUserPlus fontSize="16px" />}
                p="6"
                _hover={{
                  background: "#0F2837",
                  color: "#ffff",
                }}
              >
                <Text fontSize="sm" fontWeight="medium">
                  ADD USER
                </Text>
              </Button>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
      <DeleteModal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        selectedUser={{ name: "DELETE_USERS" }}
        userId={userIds}
        setUsersData={setUsersData}
        showButton={{ setShowDeleteButton: setShowDeleteButton }}
      />
      <SuspendModal
        isOpen={isOpenSuspend}
        onClose={onCloseSuspend}
        setUsersData={setUsersData}
        selectedUser={{ name: "SUSPEND_USERS" }}
        showButton={{ setShowDeleteButton: setShowDeleteButton }}
        userId={userIds}
      />
      <AddUserModal isOpen={isOpenAddUser} onClose={onCloseAddUser} setUsersData={setUsersData} usersData={usersData} />
      <Flex height="80vh" w={{ base: "100%", sm: "100%", md: "100%", lg: "95%" }} mt="5">
        <UserAgGrid
          rowData={usersData}
          columnDefs={columns}
          showbutton={{ setShowDeleteButton: setShowDeleteButton, getUserIds: setUserIds }}
        />
      </Flex>
      {/* ------ */}
      <UserModal
        isModalOpen={openModal}
        onModalClose={iomState.off}
        data={selectedUserId}
        setUsersData={setUsersData}
        usersData={usersData}
        showButton={{ setShowDeleteButton: setShowDeleteButton }}
        userInformation={userInformation}
      />
    </Layout>
  );
};
export default UserManagement;
