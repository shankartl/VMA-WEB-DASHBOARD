import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import AgGrid from "../../utils/AgGrid";

const HighestViewedIndustries = () => {
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
      header: "Industries name",
      accessor: "industriesname",
      width: 380,
    },
    {
      header: "Most Viewed",
      accessor: "mostviewed",
      width: 380,
    },
    {
      header: "Viewed Time",
      accessor: "viewedtime",
      width: 380,
    },
  ];
  const rowData = [
    {
      sno: "1",
      industriesname: "Farming",
      mostviewed: "Qnlabs",
      viewedtime: "20H",
    },
    {
      sno: "2",
      industriesname: "Information",
      mostviewed: "Simyog",
      viewedtime: "18 H",
    },
    {
      sno: "3",
      industriesname: "Health",
      mostviewed: "Cam Com",
      viewedtime: "16 H",
    },
    {
      sno: "4",
      industriesname: "Information",
      mostviewed: "SwitchON",
      viewedtime: "10 H",
    },
  ];

  return (
    <Box bg="white" borderRadius="0.5em" p="1em" my="5" width="100%">
      <Heading fontSize="lg" fontWeight="medium">
        Highest viewed Industries
      </Heading>
      <AgGrid rowHeight={80} columns={columns} data={rowData} setGridApi={setGridApi} setGridColumnApi={setGridColumnApi} />
    </Box>
  );
};
export default HighestViewedIndustries;
