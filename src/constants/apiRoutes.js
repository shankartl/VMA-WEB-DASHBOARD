// Common
export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const NOTIFICATIONS = "/notifications";
export const MARK_NOTIFICATIONS_READ = "/notifications/markAsRead";

// Auth
export const LOGIN = "/auth/login";

// OTP
export const SEND_OTP = "/otp/send";
export const RESEND_OTP = "/otp/resend";
export const VERIFY_OTP = "/otp/verify";
export const UPDATE_PASSWORD_WITH_OTP = "/otp/updatePassword";

// Users
export const USERS = "/users";
export const BULK_DELETE = "/users/bulkDelete";
export const BULK_SUSPEND = "/users/bulkSuspend";
export const SUSPEND = (id) => `/users/${id}/suspend`;
export const USER = (id) => `/users/${id}`;
export const USER_STATISTICS = `/users/statistics`;
export const UPDATE_USER = (userId) => `/users/${userId}`;
export const USER_LESSON_STATISTICS = (userId) => `/users/user/${userId}/stats`;
export const USER_LESSON_DETAILS = (userId) => `/users/${userId}/userLessonDetails`;
// upload profile picture
export const UPLOAD_PROFILE_PICTURE = (userId) => `/files/upload/${userId}`;

export const ADMIN_USERS = "/users/admins";
export const STARTUP_ADMIN_USERS = "/users/startupAdmins";

//Lessons
export const LESSONS = (accessibleCourse) => `/lessons/${accessibleCourse}`;
export const COMPLETED_LESSONS = (accessibleCourse) => `/lessons/completed/${accessibleCourse}`;
export const START_LESSON = `lessons/start-lesson`;
export const LESSON_PROGRESS = (id) => `/lessons/progress/${id}`;
export const RESET_LESSON = (userId) => `/lessons/resetLesson/${userId}`;

// Startups
export const STARTUPS = "/startups";
export const STARTUP = (startupId) => `/startups/${startupId}`;
export const ALL_STARTUP_UPDATES = "/startups/updates";
export const STARTUPS_BULK_UPDATE = "/startups/bulkUpdate";
export const STARTUP_UPDATES = (startupId) => `/startups/${startupId}/updates`;
export const STARTUP_LOCATIONS = (startupId) => `/startups/${startupId}/locations`;
export const STARTUP_SOLUTIONS = (startupId) => `/startups/${startupId}/solutions`;
export const STARTUP_VIDEOS = (startupId) => `/startups/${startupId}/videos`;
export const STARTUP_TESTIMONIES = (startupId) => `/startups/${startupId}/testimonies`;

// Industries
export const INDUSTRIES = "/industries";
export const INDUSTRY = (industryId) => `/industries/${industryId}`;
export const INDUSTRIES_BULK_UPDATE = "/industries/bulkUpdate";

// Enquiries
export const ENQUIRIES = "/enquiries";
export const ENQUIRY = (enquiryId) => `/enquiries/${enquiryId}`;

// Media
export const UPLOAD = "/files/upload";
export const FILES = "/files";
export const FILE = (fileId) => `/files/fetch?key=${fileId}`;

// assesments
export const CREATE_PRE_COURSE_THEORY = (assesmentId) => `/assessments/${assesmentId}/questions/create`;
export const CREATE_POST_COURSE_THEORY = (assesmentId) => `/assessments/${assesmentId}/questions/create`;
export const CREATE_POST_COURSE_PRACTICAL = (assesmentId) => `/assessments/${assesmentId}/questions/create`;
export const GET_PRE_COURSE_THEORY_QUESTIONS = (assesmentId) => `/assessments/${assesmentId}`;
export const UPDATE_QUESTIONS = (assesmentId) => `/assessments/${assesmentId}`;
export const UPDATE_CURRENT_USER = () => `/users/me`;

export const SUBMIT_ASSESSMENT_ANSWERS = (placement, module) => `/assessments/answers?placement=${placement}&module=${module}`;
export const ALL_USERS_ASSESSMENT_ANSWERS = (assessmentId) => `/assessments/answers/${assessmentId}/users`;
export const ASSESSMENT_ANSWERS_SINGLE_USER = (assessmentId, userId) => `/assessments/answers/${assessmentId}/users/${userId}`;

export const ASSESSMENT_USER_RESPONSES = `/assessments/responses`;
export const ASSESSMENT_USER_RESPONSE = (placement, module, userId) =>
  `/assessments/users/${userId}/response?placement=${placement}&module=${module}`;
export const HAS_TEST_ATTENDED = (userId, placement, module) =>
  `/assessments/users/${userId}/attended?placement=${placement}&module=${module}`;
export const GET_ASSESSMENT_SCORE_COMPARE = (module) => `/assessments/score/compare?module=${module}`;
export const GET_ASSESSMENT_BY_TYPE = (placement, module) => `/assessments/view?placement=${placement}&module=${module}`;
