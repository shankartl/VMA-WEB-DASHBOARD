import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import { Button as ChakraButton } from "@chakra-ui/react";
import AgGrid from "../../utils/AgGrid";
import { ALL_STARTUP_UPDATES } from "../../../constants/apiRoutes";
import api from "../../../services/api";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import useCustomToastr from "../../../utils/useCustomToastr";
import { formattedTimestamp } from "../../../utils/formattedTimestamp";
import { Link, useLocation } from "react-router-dom";

const WaitingForApproval = () => {
  const [startupUpdatesData, setStartupUpdatesData] = React.useState([]);
  const [, setGridApi] = React.useState(null);
  const [, setGridColumnApi] = React.useState(null);
  const toast = useCustomToastr();
  const location = useLocation();

  const fetchStartupUpdates = () => {
    api
      .get(ALL_STARTUP_UPDATES)
      .then((response) => {
        setStartupUpdatesData(response);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
      });
  };

  const columns = [
    {
      header: "S.No",
      accessor: "sno",
      width: 100,
    },
    {
      header: "Startup name",
      accessor: "name",
      width: 300,
    },
    {
      header: "No of items",
      accessor: "items",
      width: 300,
    },
    {
      header: "Date",
      accessor: "date",
      width: 300,
    },
    {
      header: "Profile",
      accessor: "profile",
      width: 240,
      cellRenderer: (params) => (
        <Link to={location.pathname.split("/").slice(0, -1).join("/") + `/startups/${params.data.startupId}`}>
          <ChakraButton colorScheme="white" variant="outline" size="sm">
            View Profile
          </ChakraButton>
        </Link>
      ),
    },
  ];

  const rowData = React.useMemo(
    () =>
      startupUpdatesData.map((item, index) => ({
        ...item,
        items: item.updates?.length || 0,
        sno: index + 1,
        date: formattedTimestamp({ timestamp: item.updates[0]?.date }),
      })),
    [startupUpdatesData]
  );

  React.useEffect(() => {
    fetchStartupUpdates();
  }, []);

  return (
    <Box bg="white" borderRadius="0.5em" p="1em" width="100%">
      <Heading fontSize="lg" fontWeight="medium">
        Waiting for approval
      </Heading>
      <AgGrid rowHeight={80} columns={columns} data={rowData} setGridApi={setGridApi} setGridColumnApi={setGridColumnApi} />
    </Box>
  );
};
export default WaitingForApproval;
