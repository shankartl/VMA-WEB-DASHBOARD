import React from "react";
import {
  Box,
  Button,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  Grid,
  Image,
  Toast,
  useBoolean,
  Switch,
} from "@chakra-ui/react";
import { getSession, toTitleCase } from "../../../utils/commonUtil";
import ResponseSummary from "../../pages/admin/ResponseSummary";
import { BsDownload } from "react-icons/bs";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useEffect } from "react";
import api from "../../../services/api";
import { ASSESSMENT_USER_RESPONSE } from "../../../constants/apiRoutes";
import { SessionContext } from "../../context/SessionContext";
import { useContext } from "react";
import { useState } from "react";
import useCustomToastr from "../../../utils/useCustomToastr";
import { CSVLink } from "react-csv";
import UserInformationModal from "./UserInformationModal";
import { POST_COURSE, PRE_COURSE, SURVEY } from "../../../constants/common";

const ViewPreCourseInfoModal = (props) => {
  const { placement } = props;
  const { assessmentData = {} } = props;

  const selectedUser = assessmentData.user;

  const sessionContext = useContext(SessionContext);
  const { session, setSession } = sessionContext;
  const assessmentId = getSession(session);
  const [assessmentAnswers, setAssessmentAnswers] = useState([]);
  const [isFetchingUserInfo, ifuiState] = useBoolean(false);
  const [openUserInfoModal, iouimState] = useBoolean(false);
  const [showResponseModal, srmState] = useBoolean(false);
  const toast = useCustomToastr();
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

  const fetchPreCourseUserInfo = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      ifuiState.on();
      const response = await api.get(ASSESSMENT_USER_RESPONSE(placement, session, selectedUser.id));

      const transformedAssessment = response.assessment.map((r) => {
        let objectToReturn = { ...r };
        let transformedAssessmentAnswers = [];
        objectToReturn.answers.forEach((aa) => {
          {
            if (aa?.metadata?.givenAnswers) {
              const answerLabel = aa?.metadata?.givenAnswers?.map((g) => g.label).join(",");

              transformedAssessmentAnswers.push({
                ...aa,
                answerLabel,
              });
            } else {
              const answerLabel = aa?.answer;

              transformedAssessmentAnswers.push({
                ...aa,
                answerLabel,
              });
            }
          }
        });

        objectToReturn.answers = transformedAssessmentAnswers;

        return objectToReturn;
      });
      setAssessmentAnswers(transformedAssessment);
    } catch (error) {
      toast.showError(error);
    } finally {
      ifuiState.off();
    }
  };
  useEffect(() => {
    if (props.isModalOpen) {
      fetchPreCourseUserInfo();
    }
  }, [props.isModalOpen]);

  const headers = [
    { label: "Question Type", key: "question.type" },
    { label: "Question", key: "question.question" },
  ];

  headers.push({
    label: "Is Correct?",
    key: "isCorrect",
  });

  headers.push({
    label: "Given Answers",
    key: "answerLabel",
  });
  const viewUserInformation = () => {
    // props.isModalClose();
    srmState.on();
    iouimState.on();
  };
  const renderTitle = () => {
    switch (placement) {
      case PRE_COURSE:
        return "Pre Course Score";
      case POST_COURSE:
        return "Post Course Score";
      default:
        break;
    }
  };

  return (
    <>
      <Modal isOpen={props.isModalOpen} onClose={props.isModalClose}>
        <ModalOverlay display={showResponseModal ? "none" : "block"} />
        <ModalContent display={showResponseModal ? "none" : "block"} maxW={{ base: "90%", md: "80%", lg: "80%" }}>
          <ModalBody>
            <Box display="flex" alignItems="center">
              <Text fontWeight="bold">User Response</Text>
              <ModalCloseButton onClick={props.isModalClose} />
            </Box>
            <Grid display="flex" mt="5">
              <GridItem flex="3">
                <Box>
                  <Box display="flex" gap="3" alignItems="center">
                    <Box>
                      <Image src={require("../../../assets/userProfile.png")} borderRadius="50%" h="40px" w="40px" />
                    </Box>
                    <Box display="flex" flexDirection="column" lineHeight="2em">
                      <Text fontSize="md" fontWeight="bold">
                        {toTitleCase(`${selectedUser.firstName} ${selectedUser.lastName}`)}
                      </Text>
                      <Text fontSize="sm" color="gray">
                        {selectedUser.email}
                      </Text>
                    </Box>
                  </Box>
                  <Box sx={scrollStyle} maxH={"500px"} overflowY="scroll">
                    <ResponseSummary assessmentAnswers={assessmentAnswers} />
                  </Box>
                </Box>
              </GridItem>
              <GridItem flex="1" ml="2">
                <Box display="flex" justifyContent={"space-between"} alignItems="center" flexDir="column" h={"100%"} w="100%">
                  <Box display="flex" flexDirection="column" gap="10">
                    <Box>
                      <Text fontSize="xs" color="gray">
                        {renderTitle()}
                      </Text>
                      <Text>{placement !== SURVEY ? `${assessmentData.totalScore} / ${assessmentData.totalMarks}` : ""} </Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs">Test Duration</Text>
                      <Text fontWeight="bold" fontSize="xs">
                        {assessmentData.timeSpent} s
                      </Text>
                    </Box>
                  </Box>
                  <Box mb="5">
                    <Text fontSize="xs" color="gray" mb={3}>
                      Actions
                    </Text>
                    <Button bgColor={"transparent"} display="flex" gap="2">
                      <BsDownload fontSize="xxxs" fontWeight="bold" />
                      <CSVLink
                        filename={`user_response.csv`}
                        data={assessmentAnswers.length ? assessmentAnswers[0]?.answers : ""}
                        headers={headers}
                      >
                        <Text fontSize="xs" fontWeight="bold">
                          DOWNLOAD AS .CSV
                        </Text>
                      </CSVLink>
                    </Button>
                    <Button bgColor={"transparent"} display="flex" gap="2" mb={3}>
                      <AiOutlineInfoCircle fontSize="xxxs" fontWeight="bold" />
                      <Text fontSize="xs" fontWeight="bold" onClick={() => viewUserInformation()}>
                        VIEW USER INFO
                      </Text>
                    </Button>
                  </Box>
                </Box>
              </GridItem>
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
      {openUserInfoModal && (
        <UserInformationModal
          closeAllModal={srmState.off}
          isModalOpen={openUserInfoModal}
          onModalClose={iouimState.off}
          data={selectedUser.id}
          fetchUserAssessmentAnswers={props.fetchUserAssessmentAnswers}
        />
      )}
    </>
  );
};

export default ViewPreCourseInfoModal;
