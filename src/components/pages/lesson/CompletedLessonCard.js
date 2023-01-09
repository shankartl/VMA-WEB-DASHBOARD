import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Image,
  ListItem,
  Modal,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  SimpleGrid,
  Text,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";
import { format, formatDistance } from "date-fns";
import React from "react";
import { FiPlay } from "react-icons/fi";
import { FiArrowLeft } from "react-icons/fi";
import lessonOverview from "../../../assets/lesson-overview.png";
import { START_LESSON } from "../../../constants/apiRoutes";
import api from "../../../services/api";
import { useAuth } from "../../../services/auth";
import { toTitleCase } from "../../../utils/commonUtil";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import useCustomToastr from "../../../utils/useCustomToastr";

const CompletedLessonCard = (props) => {
  const Card = ({ lessonNumber, title }) => (
    <Box>
      <Text fontSize="xs">Lesson {lessonNumber}</Text>
      <Text fontSize={{ base: "sm", md: "md", lg: "lg" }} fontWeight="medium" mb="2">
        {title}
      </Text>
      <Text fontSize="xs">
        <span>{props.data.lesson.duration} minutes</span>
        {/* <span> • {props.data.lesson.difficulty}</span> */}
      </Text>
    </Box>
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClick = () => {
    onOpen();
  };

  const { user } = useAuth();
  const accessibleCourse = Object.values(user.accessibleCourses);
  const toast = useCustomToastr();

  const repeatLessonHandler = (lesson) => {
    const { number: lessonNumber, id: lessonId } = lesson;
    api
      .post(START_LESSON, { module: accessibleCourse[0], lessonNumber: lessonNumber, lessonId: lessonId })
      .then((response) => {
        toast.showSuccess("Lesson Started. Please check your AR/VR device");

        if (lesson?.externalLink) {
          window.open(lesson.externalLink, "_blank", "noreferrer");
        }
        onClose();
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
      });
  };

  return (
    <>
      <Grid templateColumns="repeat(7, 1fr)" gap={3} mb={{ base: "7", lg: "6" }}>
        <GridItem colSpan={{ base: "3", lg: "1" }}>
          <Image src={props.data.lesson.image} h="70px" w="100px" borderRadius="0.6em" />
        </GridItem>
        <GridItem colSpan={{ base: "4", lg: "2" }}>
          <Card lessonNumber={props.data.lesson.number} title={props.data.lesson.title} />
        </GridItem>
        <GridItem colSpan={{ base: "3", lg: "2" }} alignSelf="center">
          <Text fontSize="xs" color="primary">
            {props.data.endedAt ? formatDistance(new Date(props.data.endedAt), new Date()) : new Date()}
          </Text>
        </GridItem>
        <GridItem colSpan={{ base: "4", lg: "2" }} alignSelf="center" textAlign={{ base: "left", lg: "end" }}>
          <Button fontSize="sm" onClick={() => repeatLessonHandler(props.data.lesson)}>
            <Box mr="2">
              <FiPlay />
            </Box>
            Repeat lesson
          </Button>
        </GridItem>
      </Grid>

      <Modal isOpen={isOpen} size="xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={{ base: "80%", md: "55%", lg: "55%" }}>
          <SimpleGrid columns={[1, 2]} spacing={5} mt="2em" px="4">
            <Box>
              <Box mb="7">
                <Heading fontSize="sm">Lesson {props.data.lesson.number}</Heading>
                <Text fontSize="2xl" fontWeight="bold" color="orange">
                  {props.data.lesson.title}
                </Text>
                <Text fontSize="xs">
                  <span>{props.data.lesson.duration} minutes</span>
                  {/* <span> • {props.data.lesson.difficulty}</span> */}
                </Text>
              </Box>
              <Box mb="7">
                <Text fontSize="xs">
                  A chord diagram (or chart) is a form of musical notation that describes the basic harmonic and rhythmic information for a
                  song or tune. One of the first skills that all guitarists learn is how to read a chord diagram.
                </Text>
              </Box>
              <Box mb="5">
                <Heading fontSize="sm" mb="3">
                  What you will learn
                </Heading>
                <UnorderedList>
                  <ListItem fontSize="xs" mb="3">
                    These diagrams are very helpful when it comes to showing chord shapes and their fingerings.
                  </ListItem>
                  <ListItem fontSize="xs">
                    Improve your motor skills when it comes to reading & interpreting a chord diagram and actually playing it.
                  </ListItem>
                </UnorderedList>
              </Box>
            </Box>
            <Box>
              <Image src={props.data.lesson.image} objectFit={"cover"} alt="Dan Abramov" borderRadius="2xl" />
            </Box>
          </SimpleGrid>

          <ModalFooter justifyContent="left" display={{ base: "block", md: "flex", lg: "flex" }}>
            <Button
              mb={{ base: "3", md: "0", lg: "0" }}
              mr={3}
              onClick={onClose}
              bg="dark"
              _hover={{ bg: "#243946" }}
              color="white"
              fontSize="sm"
              w={{ base: "100%", lg: "40%" }}
              h="3.5em"
            >
              <Box mr="2">
                <FiArrowLeft />
              </Box>
              Go back home
            </Button>
            <Button
              bg="orange"
              _hover={{ bg: "#EA7B65" }}
              color="white"
              fontSize="sm"
              w={{ base: "100%", lg: "70%" }}
              h="3.5em"
              // onClick={() => repeatLessonHandler(props.data.lesson.number, props.data.lesson.id)}
            >
              <Box mr="2">
                <FiPlay />
              </Box>
              Calibrate & start lesson
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
CompletedLessonCard.defaultProps = {
  image: "https://via.placeholder.com/75X50",
  lessonHeading: "Lesson 1",
  minutes: "minutes ",
  difficulty: "easy",
  completed: "completed date",
};
export default CompletedLessonCard;
