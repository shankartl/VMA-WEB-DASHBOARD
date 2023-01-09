import { Box, Grid, GridItem, InputGroup, Text, Input, InputLeftElement, Image, useBoolean } from "@chakra-ui/react";
import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { CSVLink } from "react-csv";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BsDownload } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import { GET_ASSESSMENT_SCORE_COMPARE } from "../../../constants/apiRoutes";
import { ProfilePlaceHolder } from "../../../constants/IconData";
import api from "../../../services/api";
import { toTitleCase } from "../../../utils/commonUtil";
import useCustomToastr from "../../../utils/useCustomToastr";
import { Button, Layout, Switch } from "../../common";
import ViewPostCourseResponseModal from "../../common/modal/ViewPostCourseResponseModal";
import ViewPreCourseResponseModal from "../../common/modal/ViewPreCourseResponseModal";
import { SessionContext } from "../../context/SessionContext";
import UserAgGrid from "../../utils/UserAgGrid";
import UserScoreRenderer from "../../utils/UserScoreRenderer";
import profilePic from "../../../assets/userProfile.png";

const ScoreCompare = () => {
  // toast
  const toast = useCustomToastr();

  // session context
  const { session } = useContext(SessionContext);

  const [scoreComparisonDwdOpt, setScoreComparisonDwdOpt] = useBoolean(false);
  const [scoreComparisonInfo, setScoreComparisonInfo] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, iomState] = useBoolean(false);
  const [filteredScoreData, setFilteredScoreData] = useState([]);

  // score data
  const [scoreData, setScoreData] = useState([]);
  const [isLoadingScores, ilsState] = useBoolean(false);

  async function fetchScores() {
    try {
      ilsState.on();
      const response = await api.get(GET_ASSESSMENT_SCORE_COMPARE(session));
      setScoreData(response.scores);
    } catch (e) {
      toast.showError({
        description: e.toString(),
      });
    } finally {
      ilsState.off();
    }
  }

  const searchUser = () => {
    if (search === "") {
      setFilteredScoreData(scoreData);
    } else {
      setFilteredScoreData(
        scoreData.filter(
          (data) =>
            data.email.toLowerCase().startsWith(search.toLowerCase()) || data.firstName.toLowerCase().startsWith(search.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    searchUser();
  }, [search, scoreData]);

  React.useEffect(() => {
    fetchScores();
  }, [session]);

  const scrollStyle = {
    "&::-webkit-scrollbar": {
      width: "2px",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 4px lightGrey",
      width: "4px",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "grey",
      borderRadius: "4px",
    },
    // '::-webkit-scrollbar': {
    //   display: 'none',
    // },
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
              {params.data?.profile_photo ? (
                <Image
                  src={
                    // eslint-disable-next-line no-undef
                    params.data?.profile_photo ? `${process.env.REACT_APP_PROFILE_IMAGE_URL} + ${params.data?.profile_photo}` : profilePic
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
                {toTitleCase(params.data?.firstName)}
              </Text>
              <Text fontSize="sm" color="gray">
                {params.data?.email}
              </Text>
            </Box>
          </Box>
        );
      },
    },
    {
      header: "Pre-course Score",
      accessor: "preCourseScore",
      width: 200,
      cellRenderer: (params) => {
        const courseData = params.data?.PRE_COURSE;

        if (!courseData) {
          return (
            <>
              <Text fontSize="xxs">Assessment course not taken</Text>
            </>
          );
        }
        return (
          <>
            <Text>
              {courseData.totalScore}/{courseData.totalMarks}
            </Text>
          </>
        );
      },
    },
    {
      header: "Post-course Score",
      accessor: "postCourseScore",
      width: 200,
      cellRenderer: (params) => {
        const postCourseData = params.data?.POST_COURSE;

        if (!postCourseData) {
          return (
            <>
              <Text fontSize="xxs">Assessment course not yet taken</Text>
            </>
          );
        }

        return (
          <Text>
            {postCourseData.totalScore}/{postCourseData.totalMarks}
          </Text>
        );
      },
    },
    {
      header: "",
      accessor: "empty",
      width: 230,
    },
    // {
    //   header: "",
    //   accessor: "view",
    //   cellRenderer: (params) => {
    //     return (
    //       <Box className="viewBtn">
    //         <Button
    //           fontSize="xs"
    //           bg="white"
    //           color="black"
    //           border="0.5px solid lightgrey"
    //           p="6"
    //           _hover={{
    //             background: "white",
    //             color: "black",
    //           }}
    //           size="sm"
    //           onClick={() => {
    //             handleViewPreCourseResponse(params.data?.id, params.data);
    //           }}
    //         >
    //           VIEW RESPONSE
    //         </Button>
    //       </Box>
    //     );
    //   },
    // },

    //
    // {
    //   header: "",
    //   accessor: "view",
    //   cellRenderer: (params) => {
    //     return (
    //       <Box className="viewBtn">
    //         <Button
    //           fontSize="xs"
    //           bg="white"
    //           color="black"
    //           border="0.5px solid lightgrey"
    //           p="6"
    //           _hover={{
    //             background: "white",
    //             color: "black",
    //           }}
    //           onClick={() => {
    //             handleViewPostCourseResponse(params.data?.id, params.data);
    //           }}
    //         >
    //           VIEW RESPONSE
    //         </Button>
    //       </Box>
    //     );
    //   },
    // },
    // {
    //   header: "",
    //   accessor: "view",
    //   width: 250,
    //   cellRenderer: (params) => {
    //     return (
    //       <Box className="viewBtn">
    //         <Button
    //           fontSize="xs"
    //           bg="white"
    //           color="black"
    //           border="0.5px solid lightgrey"
    //           p="6"
    //           leftIcon={<AiOutlineInfoCircle fontSize="16px" />}
    //           _hover={{
    //             background: "white",
    //             color: "black",
    //           }}
    //         //   onClick={() => {
    //         //     handleView(params.data?.id, params.data);
    //         //   }}
    //         >
    //           VIEW USER INFO
    //         </Button>
    //       </Box>
    //     );
    //   },
    // },
  ];

  const headers = [
    { label: "Student", key: "firstName" },
    { label: "Email", key: "email" },
    { label: "Score", key: "totalScore" },
    { label: "Pre Course Score", key: "PRE_COURSE.totalScore" },
    { label: "Pre Course Total Marks", key: "PRE_COURSE.totalMarks" },
    { label: "Post Course Total Marks", key: "POST_COURSE.totalMarks" },
    { label: "Post Course Score", key: "POST_COURSE.totalScore" },
  ];
  /* Pre Course Score, Pre Course Total Marks, Post Course Score, Post Course Total Marks*/
  const handleViewPreCourseResponse = (id, data) => {
    iomState.on();
  };
  const handleViewPostCourseResponse = (id, data) => {
    iomState.on();
  };

  const debounceSearch = (fn, delay) => {
    let timer;
    return function (...args) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  return (
    <Layout>
      <Box>
        <Text fontSize="sm">Assessments</Text>
        <Text fontWeight="bold">Score Comparison</Text>
      </Box>
      <Grid mt="5">
        <Box display="flex">
          <GridItem flex="2">
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
                onChange={debounceSearch((e) => {
                  setSearch(e.target.value);
                }, 500)}
              />
            </InputGroup>
          </GridItem>
          <GridItem flex="2">
            {/* <Box display="flex" alignItems="center" gap="2">
              <Switch size="sm" />
              <Text>Show only users with both assessment complete</Text>
            </Box> */}
          </GridItem>
        </Box>
        <Grid h="28em">
          <Box display="flex" mt="5">
            <Box flex="3">
              <UserAgGrid
                rowData={filteredScoreData}
                columnDefs={columns}
                scoreCompareInfo={{ getScoreComparisonInfo: setScoreComparisonInfo, setScoreComparisonDwdOpt: setScoreComparisonDwdOpt }}
              />
            </Box>
            <Box flex="1" ml="5" alignItems="center">
              <Box display="flex" flexDirection="column" gap="2">
                <Text fontSize="xxs">Export as .CSV</Text>
                <Box display="flex" gap="2">
                  <BsDownload fontSize="xxs" fontWeight="bold" />
                  <Text fontSize="xxs" width={"max-content"} fontWeight="bold">
                    <CSVLink filename={"user_responses.csv"} data={filteredScoreData} headers={headers}>
                      DOWNLOAD ALL RESPONSES
                    </CSVLink>
                  </Text>
                </Box>
                {scoreComparisonDwdOpt && (
                  <Box display="flex" gap="2">
                    <BsDownload fontSize="xxs" fontWeight="bold" />
                    <Text fontSize="xxs" width={"max-content"} fontWeight="bold">
                      <CSVLink filename={"user_responses.csv"} data={filteredScoreData} headers={headers}>
                        DOWNLOAD SELECTED RESPONSES
                      </CSVLink>
                    </Text>
                  </Box>
                )}
              </Box>
              {/* <ViewPreCourseResponseModal isModalOpen={openModal} onModalClose={iomState.off} />
              <ViewPostCourseResponseModal isModalOpen={openModal} onModalClose={iomState.off} /> */}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default ScoreCompare;
