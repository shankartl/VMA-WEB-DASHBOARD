import { Box, Grid, GridItem, Image, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useBoolean } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { BsDownload } from "react-icons/bs";
import { ProfilePlaceHolder } from "../../../constants/IconData";
import { toTitleCase } from "../../../utils/commonUtil";
import { Button } from "../../common";
import UserAgGrid from "../../utils/UserAgGrid";
import UserScoreRenderer from "../../utils/UserScoreRenderer";
import { CSVLink, CSVDownload } from "react-csv";
import ViewPostCourseInfoModal from "../../common/modal/ViewPostCourseInfoModal";

const PostCourseResponseTab = (props) => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [openModal, iomState] = useBoolean(false);
  const [userInformation, setUserInformation] = useState([]);
  const [assessmentInfo, setAssessmentInfo] = useState([]);
  const [showDownloadSelected, setShowDownloadSelected] = useBoolean(false);
  const [tempData, setTempData] = useState("");

  const handleView = (id, data) => {
    iomState.on();
    setSelectedUserId(id);
    setUserInformation(data);
  };

  const columns = [
    {
      header: "Student",
      accessor: "student",
      width: 300,
      type: ["checkBoxSelection", "sortableColumn"],
      cellRenderer: (params) => {
        return (
          <Box display="flex" gap="3" alignItems="center">
            <Box>
              {tempData?.profile_photo ? (
                <Image
                  src={
                    tempData?.profile_photo
                      ? `${process.env.REACT_APP_PROFILE_IMAGE_URL + tempData?.profile_photo}`
                      : require("../../../assets/userProfile.png")
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
                {toTitleCase("jose")}
              </Text>
              <Text fontSize="sm" color="gray">
                {"test@email.com"}
              </Text>
            </Box>
          </Box>
        );
      },
    },
    {
      header: "Score",
      accessor: "score",
      width: 300,
      cellRenderer: (params) => {
        return <UserScoreRenderer data={params} />;
      },
    },
    {
      header: "Test Duration",
      accessor: "testDuration",
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
              p="6"
              _hover={{
                background: "white",
                color: "black",
              }}
              onClick={() => {
                handleView(params.data?.id, params.data);
              }}
            >
              VIEW RESPONSE
            </Button>
          </Box>
        );
      },
    },
  ];
  const status = [
    {
      id: 1,
      student: "Mark",
      score: 50,
      testDuration: "4 mins",
    },
    {
      id: 2,
      student: "Zucker",
      score: 40,
      testDuration: "4 mins",
    },
    {
      id: 3,
      student: "Berg",
      score: 30,
      testDuration: "4 mins",
    },
  ];
  const headers = [
    { label: "Student", key: "student" },
    { label: "score", key: "score" },
    { label: "testDuration", key: "testDuration" },
  ];

  return (
    <Grid templateColumns="repeat(12, 1fr)" justifyContent="space-between" mb="10" height="20em" w="100%">
      <GridItem colSpan={{ base: "12", md: "12", lg: "12" }} position="relative">
        <UserAgGrid
          rowData={status}
          columnDefs={columns}
          postCourseAssessmentInfo={{ getUserAssessmentInfo: setAssessmentInfo, setDownloadSelected: setShowDownloadSelected }}
        />
        <Box position="absolute" top="20%" left="110%">
          <Text fontSize="xxs" color="gray">
            Export as .CSV
          </Text>
          <Box display="flex" alignItems="center" gap="2" mt="2">
            <BsDownload fontSize="xxs" fontWeight="bold" />
            <Text fontSize="xxs" width={"max-content"} fontWeight="bold">
              <CSVLink data={status} headers={headers}>
                DOWNLOAD ALL RESPONSES
              </CSVLink>
            </Text>
          </Box>
          {showDownloadSelected && (
            <Box display="flex" alignItems="center" gap="2" mt="2">
              <BsDownload fontSize="xxs" fontWeight="bold" />
              <Text fontSize="xxs" width={"max-content"} fontWeight="bold">
                <CSVLink data={assessmentInfo} headers={headers}>
                  DOWNLOAD SELECTED RESPONSES
                </CSVLink>
              </Text>
            </Box>
          )}
        </Box>
      </GridItem>

      <ViewPostCourseInfoModal isModalOpen={openModal} onModalClose={iomState.off} />
    </Grid>
  );
};

export default PostCourseResponseTab;

PostCourseResponseTab.defaultProps = {
  responses: "responses",
  number: "4",
};
