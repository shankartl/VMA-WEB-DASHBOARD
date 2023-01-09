import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import AgGrid from "../../utils/AgGrid";
import ImageIcon from "../../utils/ImageIcon";

const HighestViewedStartup = () => {
  const [, setGridApi] = React.useState(null);
  const [, setGridColumnApi] = React.useState(null);
  const columns = [
    {
      header: "S.No",
      accessor: "sno",
      width: 100,
      bg: "white",
    },
    {
      header: "Startup name",
      accessor: "startupname",
      width: 240,
      cellRenderer: (params) => <ImageIcon name={params.data.startupname} />,
    },
    {
      header: "Overall view time",
      accessor: "viewtime",
      width: 240,
    },
  ];
  const rowData = [
    {
      sno: "1",
      startupname: "Cam Com",
      viewtime: "120 H",
    },
    {
      sno: "2",
      startupname: "SwitchON",
      viewtime: "100 H",
    },
    {
      sno: "3",
      startupname: "ONU Labs",
      viewtime: "50 H",
    },
    {
      sno: "4",
      startupname: "Simyog",
      viewtime: "40 H",
    },
  ];
  return (
    <Box bg="white" borderRadius="0.5em" p="1em" h={{ base: "50vh", lg: "auto" }}>
      <Heading fontSize="lg" fontWeight="medium">
        Highest Viewed Startup
      </Heading>
      <AgGrid rowHeight={80} columns={columns} data={rowData} setGridApi={setGridApi} setGridColumnApi={setGridColumnApi} />
    </Box>
  );
};
export default HighestViewedStartup;
