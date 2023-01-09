import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import { STARTUP_ADMIN_USERS } from "../../../constants/apiRoutes";
import { WithPermissionWrapper } from "../../../hocs";
import api from "../../../services/api";
import { useAuth } from "../../../services/auth";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import { formattedTimestamp } from "../../../utils/formattedTimestamp";
import useCustomToastr from "../../../utils/useCustomToastr";
import { Layout, SectionHeader } from "../../common";
import AgGrid from "../../utils/AgGrid";
import StartupUsersForm from "./StartupUsersForm";
import DeleteUser from "./DeleteUser";
import EditUserForm from "./EditUserForm";

const StartupUsersPage = () => {
  const toast = useCustomToastr();
  const [usersData, setUsersData] = React.useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const { results: users = [], ...initialQuery } = usersData;
  const [usersQuery, setUsersQuery] = React.useState({
    page: searchParams.get("page") || initialQuery.page,
    limit: searchParams.get("limit") || initialQuery.limit,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();

  const fetchUsers = (query = {}) => {
    api
      .get(STARTUP_ADMIN_USERS + "?" + new URLSearchParams(query))
      .then((response) => {
        setUsersData(response);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
      });
  };

  // GRID STATES
  const [, setGridApi] = React.useState(null);
  const [, setGridColumnApi] = React.useState(null);

  const columns = [
    {
      header: "S. No",
      accessor: "sno",
      width: 70,
    },
    {
      header: "User Name",
      accessor: "name",
      width: 250,
      type: "filterableColumn",
    },
    {
      header: "Email",
      accessor: "email",
      width: 300,
      type: "filterableColumn",
    },
    {
      header: "Role",
      accessor: "role",
      width: 150,
    },
    {
      header: "Invited At",
      accessor: "createdAt",
      type: ["numberColumn"],
      width: 350,
    },
    {
      ...(user.role === "startupPrimary" && {
        header: "Actions",
        accessor: "actions",
        cellRenderer: (params) => (
          <Stack isInline>
            <EditUserForm id={`${params.data.id}`} pageRefresher={fetchUsers} />
            <DeleteUser id={`${params.data.id}`} pageRefresher={fetchUsers} />
          </Stack>
        ),
      }),
    },
  ];

  const rowData = React.useMemo(() => {
    let usersClone = users && users.slice();
    return usersClone.map((user, i) => ({
      ...user,
      sno: (usersData.page - 1) * usersData.limit + i + 1,
      name: user.name || "-",
      createdAt: formattedTimestamp({ timestamp: user.createdAt }),
    }));
  }, [users]);

  const handlePaginationChange = ({ page, size }) => {
    if (page !== usersQuery.page) {
      setSearchParams({ ...usersQuery, page });
      setUsersQuery({ ...usersQuery, page });
    }
    if (size !== usersQuery.limit) setUsersQuery({ ...usersQuery, page: 1, limit: size });
    return;
  };

  // API Calls are made in this useEffect
  React.useEffect(() => {
    const { page = 1, limit = 50 } = usersQuery;
    const startupId = user.startupId;
    fetchUsers({ page, limit, startupId });
  }, [usersQuery]);

  return (
    <Layout>
      <Flex justifyContent="space-between" alignItems="end">
        <Box>
          <SectionHeader>Admin List</SectionHeader>
        </Box>
        <Box>
          <Flex>
            <WithPermissionWrapper permission="startupPrimary">
              <Button colorScheme="darkBlue" ml="0.5em" onClick={onOpen}>
                <AiOutlinePlus />
                <Text ml={2}>Add new admins</Text>
              </Button>
            </WithPermissionWrapper>
            <Modal closeOnOverlayClick={false} isOpen={isOpen} size="6xl" onClose={onClose} w="100%">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader color="darkBlue.500">Add New Admin</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <StartupUsersForm fetchUsers={fetchUsers} onClose={onClose} />
                </ModalBody>
              </ModalContent>
            </Modal>
          </Flex>
        </Box>
      </Flex>
      <Flex height="75vh" borderRadius="1em">
        <AgGrid
          columns={columns}
          data={rowData}
          setGridApi={setGridApi}
          setGridColumnApi={setGridColumnApi}
          // Pagination
          manualPagination={usersData?.totalPages > 1 ? true : false}
          handlePaginationChange={handlePaginationChange}
          pageIndex={usersData.page}
          pageSize={usersData.limit}
          pageCount={usersData?.totalPages}
          sizeOptions={[50, 100, 200]}
        />
      </Flex>
    </Layout>
  );
};

export default StartupUsersPage;
