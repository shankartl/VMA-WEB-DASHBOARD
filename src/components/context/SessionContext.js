import { createContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import React from "react";
import api from "../../services/api";
import { COMPLETED_LESSONS } from "../../constants/apiRoutes";
import { useAuth } from "../../services/auth";
import { useBoolean } from "@chakra-ui/react";
import useCustomToastr from "../../utils/useCustomToastr";
import { GET_ASSESSMENT_BY_TYPE, GET_PRE_COURSE_THEORY_QUESTIONS } from "../../constants/apiRoutes";

export const SessionContext = createContext({
  session: "guitar",
  setSession: () => {},
  getCompletedLessons: async () => {},
  isFetchingCompletedLesson: false,
  completedLessons: [],
  fetchAssessmentQuestions: async (assessmentId) => {},
  isFetchingPreAssesmentQuestion: false,
  preAssessmentQuestions: [],
  getAssessmentbyPlacement: async (placement, currentSession) => {},
  isFetchingPostCourse: false,
  assessemntQuestions: [],
});

export const ContextProvider = (props) => {
  const toast = useCustomToastr();
  const [session, setSession] = useState("guitar");
  const [completedLessons, setCompletedLessons] = React.useState([]);

  // Booleans
  const [isFetchingCompletedLesson, ifclState] = useBoolean(false);
  const [isFetchingPreAssesmentQuestion, ifqState] = useBoolean(false);
  const [preAssessmentQuestions, setPreAssessmentQuestions] = useState([]);
  const [isFetchingPostCourse, ifpcState] = useBoolean(false);
  const [assessemntQuestions, setAssessemntQuestions] = useState([]);

  const getCompletedLessons = async (accessingCourse) => {
    try {
      ifclState.on();
      const response = await api.get(COMPLETED_LESSONS(accessingCourse));
      setCompletedLessons(response);
      return response;
    } catch (error) {
      toast.showError({ description: error });
    } finally {
      ifclState.off();
    }
  };

  const fetchAssessmentQuestions = async (assessmentId) => {
    try {
      ifqState.on();
      const response = await api.get(GET_PRE_COURSE_THEORY_QUESTIONS(assessmentId));
      const fetchedQuestions = response?.assessment;
      setPreAssessmentQuestions(fetchedQuestions);
      return response;
    } catch (error) {
      toast.showError({ description: `${error?.message}` });
    } finally {
      ifqState.off();
    }
  };

  const getAssessmentbyPlacement = async (placement, currentSession) => {
    try {
      ifpcState.on();
      const response = await api.get(GET_ASSESSMENT_BY_TYPE(placement, currentSession));
      const fetchedQuestions = response?.assessments;
      setAssessemntQuestions(fetchedQuestions);
      return response;
    } catch (error) {
      toast.showError({ description: `${error?.message}` });
    } finally {
      ifpcState.off();
    }
  };

  const mContext = {
    session,
    setSession,
    getCompletedLessons,
    isFetchingCompletedLesson,
    completedLessons,
    isFetchingPreAssesmentQuestion,
    fetchAssessmentQuestions,
    preAssessmentQuestions,
    getAssessmentbyPlacement,
    assessemntQuestions,
    isFetchingPostCourse,
  };

  return <SessionContext.Provider value={mContext}>{props.children}</SessionContext.Provider>;
};
