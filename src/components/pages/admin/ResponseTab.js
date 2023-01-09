import { Box, Grid, GridItem, Image, Text, useBoolean } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { BsDownload } from "react-icons/bs";
import { ProfilePlaceHolder } from "../../../constants/IconData";
import { toTitleCase } from "../../../utils/commonUtil";

import { Button } from "../../common";
import UserAgGrid from "../../utils/UserAgGrid";
import UserScoreRenderer from "../../utils/UserScoreRenderer";
// import { CSVLink, CSVDownload } from "react-csv";
import ViewPreCourseInfoModal from "../../common/modal/ViewPreCourseInfoModal";
import { convertSecondsToMinutes } from "../../utils/DateFormat";
import { CSVLink } from "react-csv";

const ResponseTab = ({ placement = "PRE_COURSE", assessments: assessmentAnwers, fetchUserAssessmentAnswers }) => {
  const [openModal, iomState] = useBoolean(false);
  const [userInformation, setUserInformation] = useState([]);
  const [preCourseAssessmentInfo, setpreCourseAssessmentInfo] = useState([]);
  const [showDownloadSelected, setShowDownloadSelected] = useBoolean(false);

  //
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [selectedUserAssessment, setSelectedUserAssessment] = useState(null);

  const handleView = (id, _assessmentData) => {
    setSelectedAssessmentId(id);
    setSelectedUserAssessment(_assessmentData);
    iomState.on();

    // setUserInformation(data);
  };
  const columns = [
    {
      header: "Student",
      accessor: "firstName",
      width: 300,
      type: ["checkBoxSelection", "sortableColumn"],
      cellRenderer: (params) => {
        return (
          <Box display="flex" gap="3" alignItems="center">
            <Box>
              {params.data?.user?.profile_photo ? (
                <Image
                  src={
                    params.data?.profile_photo
                      ? `${process.env.REACT_APP_PROFILE_IMAGE_URL + params.data?.profile_photo}`
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
                {toTitleCase(params.data?.user?.firstName)}
              </Text>
              <Text fontSize="sm" color="gray">
                {params.data?.user?.email}
              </Text>
            </Box>
          </Box>
        );
      },
    },
    {
      header: "Score",
      accessor: "assessmentAnswers.assessmentUserAnswers",
      width: 300,
      cellRenderer: (params) => {
        return <UserScoreRenderer data={params.data} />;
      },
    },
    {
      header: "Test Duration",
      accessor: "testDuration",
      cellRenderer: (params) => {
        return <Text>{convertSecondsToMinutes(params.data?.timeSpent)}</Text>;
      },
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
                handleView(params.data?.assessmentId, params.data);
              }}
            >
              VIEW RESPONSE
            </Button>
          </Box>
        );
      },
    },
  ];

  const headers = [
    { label: "Student", key: "user.firstName" },
    { label: "Email", key: "user.email" },
    { label: "Score", key: "totalScore" },
    { label: "TotalMarks", key: "totalMarks" },
    { label: "testDuration", key: "timeSpent" },
  ];

  return (
    <Grid templateColumns="repeat(12, 1fr)" justifyContent="space-between" mb="10" height="25em" w="100%">
      <GridItem colSpan={{ base: "12", md: "12", lg: "12" }} position="relative">
        <UserAgGrid
          rowData={assessmentAnwers}
          columnDefs={columns}
          preCourseAssessmentInfo={{ getUserAssessmentInfo: setpreCourseAssessmentInfo, setDownloadSelected: setShowDownloadSelected }}
        />
        <Box position="absolute" top="20%" left="110%">
          <Text fontSize="xxs" color="gray">
            Export as .CSV
          </Text>
          <Box display="flex" alignItems="center" gap="2" mt="2">
            <BsDownload fontSize="xxs" fontWeight="bold" />
            <Text fontSize="xxs" width={"max-content"} fontWeight="bold">
              <CSVLink filename={`${placement.toLowerCase()}_user_responses.csv`} data={assessmentAnwers} headers={headers}>
                DOWNLOAD ALL RESPONSES
              </CSVLink>
            </Text>
          </Box>
          {showDownloadSelected && (
            <Box display="flex" alignItems="center" gap="2" mt="2">
              <BsDownload fontSize="xxs" fontWeight="bold" />
              <Text fontSize="xxs" width={"max-content"} fontWeight="bold">
                <CSVLink filename={`${placement.toLowerCase()}_user_responses.csv`} data={preCourseAssessmentInfo} headers={headers}>
                  DOWNLOAD SELECTED RESPONSES
                </CSVLink>
              </Text>
            </Box>
          )}
        </Box>
      </GridItem>

      {openModal && (
        <ViewPreCourseInfoModal
          isModalOpen={openModal}
          isModalClose={iomState.off}
          assessmentData={selectedUserAssessment}
          assessmentId={selectedAssessmentId}
          placement={placement}
          fetchUserAssessmentAnswers={fetchUserAssessmentAnswers}
        />
      )}
    </Grid>
  );
};

export default ResponseTab;

ResponseTab.defaultProps = {
  responses: "responses",
  number: "4",
};
