import {
  Box,
  Flex,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Grid,
  GridItem,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { IoMdNotifications } from "react-icons/io";
import { Button as ChakraButton } from "@chakra-ui/react";
import TimeLapsed from "./TimeLapsed";
import { MARK_NOTIFICATIONS_READ } from "../../constants/apiRoutes";
import api from "../../services/api";
import useCustomToastr from "../../utils/useCustomToastr";
import { formattedErrorMessage } from "../../utils/formattedErrorMessage";

const NotificationCard = (props) => {
  const toast = useCustomToastr();
  const [isLoading, setLoading] = React.useState(false);
  const { onOpen, onClose, isOpen } = useDisclosure();

  const handleClick = () => {
    setLoading(true);
    api
      .post(MARK_NOTIFICATIONS_READ, {
        notificationIds: props.notifications.map((notification) => notification.id),
      })
      .then(() => {
        props.fetchNotifications();
        setLoading(false);
        onClose();
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
        setLoading(false);
      });
  };

  return (
    <Popover placement="bottom-start" closeOnBlur={true} isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <ChakraButton bg="tertiary" _hover={{ bg: "tertiary" }} _active={{ bg: "tertiary" }} pr="1">
          <IoMdNotifications size="1.5em" />
          {props.notifications.length > 0 && <Box as="span" backgroundColor="red" width={2} height={2} borderRadius={"100%"} />}
        </ChakraButton>
      </PopoverTrigger>
      <PopoverContent minW={{ base: "100%", lg: "max-content" }} borderRadius="0.5em">
        <PopoverBody boxShadow="2xl" maxH="50vh" overflowY="auto">
          {props.notifications.length > 0 ? (
            <>
              <Flex justify="space-between" align="center" p="2">
                <Text fontSize="md" fontWeight="medium">
                  Notifications
                </Text>
                <ChakraButton size="xs" colorScheme="green" onClick={handleClick} isLoading={isLoading}>
                  Mark all as Read
                </ChakraButton>
              </Flex>
              {props.notifications.map((element, i) => (
                <Grid templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(3, 1fr)" }} spacing="1em" paddingY="1em" key={i} pr="1em">
                  <GridItem flex={2} colSpan="2">
                    <Flex align="center">
                      <Image src={element?.destinationId?.logoId?.url} w="3em" h="2em" borderRadius="5px" />
                      <Box pl="5">
                        <Text fontSize={{ base: "sm", md: "md" }} fontWeight="medium">
                          {element.title}
                        </Text>
                        <Text fontSize="sm">{element.content}</Text>
                      </Box>
                    </Flex>
                  </GridItem>
                  <GridItem>
                    <Text fontSize="xs" color="gray.700" mr="5" letterSpacing="-0.02em" textAlign="end">
                      <TimeLapsed timestamp={element.createdAt} />
                    </Text>
                  </GridItem>
                </Grid>
              ))}
            </>
          ) : (
            <Box>
              <Text fontSize="sm" color="gray.500" py="3em" px="6em">
                No new notifications!
              </Text>
            </Box>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
NotificationCard.defaultProps = {
  image: "https://via.placeholder.com/60X40",
};

export default NotificationCard;
