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
} from "@chakra-ui/react";
import { toTitleCase } from "../../../utils/commonUtil";
import ResponseSummary from "../../pages/admin/ResponseSummary";
import { BsDownload } from "react-icons/bs";
import { AiOutlineInfoCircle } from "react-icons/ai";

const ViewPostCourseInfoModal = (props) => {
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
  return (
    <Modal isOpen={props.isModalOpen} onClose={props.onModalClose}>
      <ModalOverlay />
      <ModalContent maxW={{ base: "90%", md: "80%", lg: "80%" }}>
        <ModalBody>
          <Box display="flex" alignItems="center">
            <Text fontWeight="bold">User Response</Text>
            <ModalCloseButton onClick={props.onModalClose} />
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
                      {toTitleCase("John Doe")}
                    </Text>
                    <Text fontSize="sm" color="gray">
                      {"johndoe@vma.com"}
                    </Text>
                  </Box>
                </Box>
                <Box sx={scrollStyle} maxH={"500px"} overflowY="scroll">
                  <ResponseSummary />
                </Box>
              </Box>
            </GridItem>
            <GridItem flex="1" ml="2">
              <Box display="flex" justifyContent={"space-between"} alignItems="center" flexDir="column" h={"100%"} w="100%">
                <Box display="flex" flexDirection="column" gap="10">
                  <Box>
                    <Text fontSize="xs" color="gray">
                      Post Course Score
                    </Text>
                    <Text>46/50</Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs">Test Duration</Text>
                    <Text fontWeight="bold" fontSize="xs">
                      10 mins
                    </Text>
                  </Box>
                </Box>
                <Box mb="5">
                  <Text fontSize="xs" color="gray">
                    Actions
                  </Text>
                  <Box display="flex" gap="2">
                    <BsDownload fontSize="xxxs" fontWeight="bold" />
                    <Text fontSize="xs" fontWeight="bold">
                      DOWNLOAD AS .CSV
                    </Text>
                  </Box>
                  <Box display="flex" gap="2">
                    <AiOutlineInfoCircle fontSize="xxxs" fontWeight="bold" />
                    <Text fontSize="xs" fontWeight="bold">
                      VIEW USER INFO
                    </Text>
                  </Box>
                </Box>
              </Box>
            </GridItem>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ViewPostCourseInfoModal;
