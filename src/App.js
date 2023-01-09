import React from "react";

// CSS Imports
import "./App.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "./fonts/Intel/IntelOneDisplayRegular.ttf";
import "react-datepicker/dist/react-datepicker.css";
import customTheme from "./styles/theme";

//Other Imports
import { ChakraProvider } from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./components/pages/auth";
import { Lost } from "./components/pages";
import { ResponseInterceptor } from "./components/utils/ResponseInterceptor";
import { WithAdminPrimary, WithAdminSecondary } from "./hocs";
import { useAuth } from "./services/auth";
import api from "./services/api";
import { HomeMain } from "./components/pages/home";
import CompletedLessonMain from "./components/pages/lesson/CompletedLessonMain";
import SettingsMain from "./components/pages/setting/SettingsMain";
import AdminHomeMain from "./components/pages/admin/AdminHomeMain";
import PreLessonTest from "./components/pages/admin/PreLessonTest";
import CourseSurvey from "./components/adminCourse/CourseSurvey";
import UserManagement from "./components/adminCourse/UserManagement";
import WithAdmin from "./hocs/WithAdmin";
import WithUser from "./hocs/WithUser";
import AdminLoginDrums from "./components/pages/auth/AdminLoginDrums";
import AdminLoginGuitar from "./components/pages/auth/AdminLoginGuitar";
import PostLessonTest from "./components/pages/admin/PostLessonTest";
import PostCourse from "./components/pages/admin/PostCourse";
import ScoreCompare from "./components/pages/admin/ScoreCompare";
import AssesmentCompletionStatus from "./components/pages/assesment/AssesmentCompletionStatus";
import SurveyQuestions from "./components/pages/admin/SurveyQuestions";
import SurveyCompletionStatus from "./components/pages/assesment/SurveyCompletionStatus";

const App = () => {
  const { token } = useAuth();
  api.setHeader(token);

  return (
    <ChakraProvider resetCSS theme={customTheme}>
      <ResponseInterceptor />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="login" element={<AdminLoginGuitar />} />
        <Route path="drumsLogin" element={<AdminLoginDrums />} />
        <Route path="admin" element={<WithAdmin />}>
          <Route path="home" element={<AdminHomeMain />} />
          <Route path="lessontest" element={<PreLessonTest />} />
          <Route path="postLessonTest" element={<PostLessonTest />} />
          <Route path="survey" element={<SurveyQuestions />} />
          {/* <Route path="postCourse" element={<PostCourse />} /> */}
          <Route path="scoreComparison" element={<ScoreCompare />} />
          <Route path="completion" element={<CourseSurvey />} />
          <Route path="userManagement" element={<UserManagement />} />
        </Route>
        <Route path="student" element={<WithUser />}>
          <Route path="home" element={<HomeMain />} />
          <Route path="completed" element={<CompletedLessonMain />} />
          <Route path="settings" element={<SettingsMain />} />
          <Route path="assessments/completed" element={<AssesmentCompletionStatus />} />
          <Route path="survey/completed" element={<SurveyCompletionStatus />} />
        </Route>

        <Route path="*" element={<Lost />} />
      </Routes>
    </ChakraProvider>
  );
};

export default App;
