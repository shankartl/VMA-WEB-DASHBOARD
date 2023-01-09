import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import AgGrid from "../../utils/AgGrid";
import { STARTUP_UPDATES } from "../../../constants/apiRoutes";
import api from "../../../services/api";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import useCustomToastr from "../../../utils/useCustomToastr";
import { formattedTimestamp } from "../../../utils/formattedTimestamp";
import { useAuth } from "../../../services/auth";
import BadgeApproval from "../../utils/BadgeApproval";

const StartupWaitingForApproval = () => {
  const [startupUpdatesData, setStartupUpdatesData] = React.useState([]);
  const [, setGridApi] = React.useState(null);
  const [, setGridColumnApi] = React.useState(null);
  const toast = useCustomToastr();
  const { user } = useAuth();

  const fetchStartupUpdates = () => {
    api
      .get(STARTUP_UPDATES(user.startupId))
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
      width: 70,
    },
    {
      header: "Name",
      accessor: "name",
      width: 150,
    },
    {
      header: "Date",
      accessor: "date",
      width: 250,
    },
    {
      header: "Status",
      accessor: "status",
      width: 140,
      cellRenderer: (params) => <BadgeApproval status={params.data.status} approval={params.data.status} />,
    },
  ];

  const rowData = React.useMemo(
    () =>
      Object.keys(startupUpdatesData)
        .filter((key) => startupUpdatesData[key])
        .map((key, index) => {
          return {
            sno: index + 1,
            name: key,
            date: formattedTimestamp({ timestamp: startupUpdatesData[key].createdAt }),
            status: startupUpdatesData[key]?.approvalStatus,
          };
        }),
    [startupUpdatesData]
  );

  React.useEffect(() => {
    fetchStartupUpdates();
  }, []);

  return (
    <Box bg="white" borderRadius="0.5em" p="1em" width="100%" height={{ base: "50vh", lg: "auto" }}>
      <Heading fontSize="lg" fontWeight="medium">
        Waiting for approval
      </Heading>
      <AgGrid rowHeight={80} columns={columns} data={rowData} setGridApi={setGridApi} setGridColumnApi={setGridColumnApi} />
    </Box>
  );
};
export default StartupWaitingForApproval;
