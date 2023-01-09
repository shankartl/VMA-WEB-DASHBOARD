import { Box, Flex, Image, Spinner, Text, useBoolean, useDisclosure } from "@chakra-ui/react";
import React, { useContext } from "react";
import { AiFillPlaySquare } from "react-icons/ai";
import { BsHandThumbsUp } from "react-icons/bs";
import LessonLockedModal from "../../utils/LessonLockedModal";
import { FaLock } from "react-icons/fa";
import { GET_ASSESSMENT_BY_TYPE, HAS_TEST_ATTENDED, START_LESSON, SUBMIT_ASSESSMENT_ANSWERS } from "../../../constants/apiRoutes";
import useCustomToastr from "../../../utils/useCustomToastr";
import api from "../../../services/api";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import { toTitleCase, getSession } from "../../../utils/commonUtil";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { TOTAL_LESSONS_COUNT, POST_COURSE, PRE_COURSE, SURVEY } from "../../../constants/common";
import { SessionContext } from "../../context/SessionContext";
import SessionCover from "../../common/SessionCover";
import AssesmentModal from "../../common/modal/AssesmentModal";
import { ROUTES } from "../../../constants/routes";
import { useAuth } from "../../../services/auth";

const CourseList = ({ lessons }) => {
  const { isOpen: isOpenLesson, onOpen: onOpenLesson, onClose: onCloseLesson } = useDisclosure();
  const toast = useCustomToastr();
  const { user } = useAuth();
  const navigate = useNavigate();
  const accessibleCourse = Object.values(user.accessibleCourses);
  //context
  const sessionContext = useContext(SessionContext);
  const {
    session,
    setSession,
    isFetchingPreAssesmentQuestion,
    getAssessmentbyPlacement,
    assessemntQuestions,
    getCompletedLessons,
    completedLessons,
  } = sessionContext;
  const assessmentId = getSession(session);
  //booleans
  const [openModal, iomState] = useBoolean(false);
  const [isSubmitting, isState] = useBoolean(false);
  const [isLoading, idlState] = useBoolean(false);

  //states
  const [placement, setPlacement] = React.useState("");
  const [preTestAttended, setPreTestAttended] = useState(null);
  const [postTestAttended, setPostTestAttended] = useState(null);
  const [surveyTestAttened, setSurveyTestAttened] = useState(null);

  const [isLoadingAssessment, ilaState] = useBoolean(false);
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    if (accessibleCourse[0] === "DRUMS") {
      setSession("drums");
    } else {
      setSession("guitar");
    }
  }, []);

  useEffect(() => {
    fetchAssessments();
  }, [session, placement]);

  async function fetchAssessments() {
    if (!placement || !session) {
      return;
    }

    try {
      ilaState.on();

      const response = await api.get(GET_ASSESSMENT_BY_TYPE(placement, session));
      setAssessments(response.assessments);
    } catch (e) {
      // silent API
    } finally {
      ilaState.off();
    }
  }

  const isTestAttended = async (courseType) => {
    try {
      const response = await api.get(HAS_TEST_ATTENDED(user.id, courseType, accessibleCourse));
      return response;
    } catch (error) {
      toast.showError(error);
    }
  };

  useEffect(() => {
    isTestAttended(PRE_COURSE)
      .then((res) => {
        setPreTestAttended(res.isAttended);
      })
      .catch((err) => {});
    getCompletedLessons(accessibleCourse);
  }, []);

  useEffect(() => {
    if (completedLessons.length === TOTAL_LESSONS_COUNT) {
      isTestAttended(SURVEY)
        .then((res) => {
          idlState.on();
          setSurveyTestAttened(res.isAttended);
        })
        .catch((err) => {})

        .finally(() => {
          idlState.off();
        });
    }
  }, [completedLessons]);

  useEffect(() => {
    if (completedLessons.length === TOTAL_LESSONS_COUNT) {
      isTestAttended(POST_COURSE)
        .then((res) => {
          idlState.on();
          setPostTestAttended(res.isAttended);
        })
        .catch((err) => {})
        .finally(() => {
          idlState.off();
        });
    }
  }, [completedLessons]);

  // useEffect(() => {
  //   if (openModal && placement) {
  //     getAssessmentbyPlacement(placement, session);
  //   }
  // }, [openModal]);

  const onSubmit = async (payload) => {
    try {
      isState.on();
      const response = await api.post(SUBMIT_ASSESSMENT_ANSWERS(placement, session), payload);
      iomState.off();

      if (placement === "SURVEY") {
        navigate(ROUTES.SURVEY_COMPLETED_SCREEN);
      } else {
        navigate(ROUTES.ASSESSMENT_COMPLETION_SCREEN);
      }
      return response;
    } catch (error) {
      toast.showError({ description: `${error?.message}` });
    } finally {
      isState.off();
    }
  };

  const renderAssessmentModal = () => {
    if (!openModal) {
      return;
    }
    return (
      <AssesmentModal
        isModalOpen={openModal}
        onClose={iomState.off}
        assessmentId={assessmentId}
        assessments={assessments}
        isFetchingQuestion={isFetchingPreAssesmentQuestion}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        placement={placement}
      />
    );
  };

  const startLessonHandler = (lesson) => {
    const { number: lessonNumber, id: lessonId } = lesson;
    if (preTestAttended) {
      api
        .post(START_LESSON, { module: accessibleCourse[0], lessonNumber: lessonNumber, lessonId: lessonId })
        .then((response) => {
          toast.showSuccess("Lesson Started. Please check your AR/VR device");

          if (lesson?.externalLink) {
            window.open(lesson.externalLink, "_blank", "noreferrer");
          }
        })
        .catch((error) => {
          const e = formattedErrorMessage(error);
          toast.showError(e);
        });
    } else {
      setPlacement(PRE_COURSE);
      iomState.on();
    }
  };

  const openPostCourseModal = () => {
    setPlacement(POST_COURSE);
    iomState.on();
  };

  const surveyModal = () => {
    setPlacement(SURVEY);
    iomState.on();
  };

  return (
    <Flex mt="3" gap="5" flexWrap="wrap">
      {lessons.map((lesson, index) => {
        return index === 0 ? (
          <Box position="relative" key={index}>
            <Box>
              <Image h="10em" w="19em" borderRadius="10px" objectFit="cover" src={lesson.image} fallbackSrc="coursePic1" />
            </Box>
            <Box position="absolute" top="5em" color="#ffff">
              <Box display="flex">
                <Box pb="0.4em" pl="0.4em">
                  <Text fontSize="xs" mt="1">
                    Lesson {lesson.number}
                  </Text>
                  <Text fontSize="md" fontWeight="500" mt="1">
                    {lesson.title}
                  </Text>
                  <Box display="flex" alignItems="center">
                    <Text fontSize="xs">{lesson.duration} minutes</Text>
                    {/* <BsDot /> */}
                    {/* <Text fontSize="xs">{lesson.difficulty}</Text> */}
                  </Box>
                </Box>
                <Box position="absolute" left="15em" top="1em">
                  <AiFillPlaySquare
                    fontSize="3.5em"
                    onClick={() => {
                      startLessonHandler(lesson);
                    }}
                  />
                </Box>
              </Box>
            </Box>
            <Box>
              <Text
                fontSize=".5em"
                bg="#6E1946"
                borderRadius="10px"
                color="#ffff"
                width="max-content"
                position="absolute"
                top="10%"
                left="70%"
                p="0.5em"
              >
                0% COMPLETE
              </Text>
            </Box>
          </Box>
        ) : (
          <Box onClick={onOpenLesson}>
            <Box position="relative">
              <Image h="7em" w="9em" src={lesson.image} fallbackSrc="coursePic1" borderRadius="10px" />
              <Box position="absolute" top="40%" left="40%" color="#f5f6f7">
                <FaLock fontSize="2em" />
              </Box>
            </Box>
            <Text fontSize="xs" mt="1">
              Lesson {lesson.number}
            </Text>
            <Text fontSize="0.8em" fontWeight="600">
              {toTitleCase(lesson.title)}
            </Text>
            <LessonLockedModal isOpen={isOpenLesson} onClose={onCloseLesson} />
          </Box>
        );
      })}
      <Box>
        <Box position="relative">
          <SessionCover h="7em" w="9em" fallbackSrc="coursePic1" borderRadius="10px" />
          {completedLessons.length === TOTAL_LESSONS_COUNT ? (
            <Box position="absolute" top="4em" left="0.5em" fontSize="0.8em" color="white">
              {isLoading ? (
                <Spinner />
              ) : postTestAttended ? (
                <BsHandThumbsUp fontSize="3.5em" />
              ) : (
                <AiFillPlaySquare fontSize="3.5em" onClick={openPostCourseModal} />
              )}
            </Box>
          ) : (
            <Box position="absolute" top="40%" left="40%" color="#f5f6f7">
              <FaLock fontSize="2em" />
            </Box>
          )}
        </Box>

        <Text fontSize="0.8em" fontWeight="600">
          {toTitleCase("Post Course")}
        </Text>
      </Box>
      <Box>
        <Box position="relative">
          <SessionCover h="7em" w="9em" fallbackSrc="coursePic1" borderRadius="10px" />
          {completedLessons.length === TOTAL_LESSONS_COUNT ? (
            <Box position="absolute" top="4em" left="0.5em" fontSize="0.8em" color="white">
              {isLoading ? (
                <Spinner />
              ) : surveyTestAttened ? (
                <BsHandThumbsUp fontSize="3.5em" />
              ) : (
                <AiFillPlaySquare fontSize="3.5em" onClick={surveyModal} />
              )}
            </Box>
          ) : (
            <Box position="absolute" top="40%" left="40%" color="#f5f6f7">
              <FaLock fontSize="2em" />
            </Box>
          )}
        </Box>

        <Text fontSize="0.8em" fontWeight="600">
          {toTitleCase("Survey")}
        </Text>
      </Box>
      {renderAssessmentModal()}
    </Flex>
  );
};

export default CourseList;
