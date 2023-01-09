import React, { useState } from "react";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import { Flex, Image, Box, CloseButton, Text, Stack, Spinner, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { FILE, UPLOAD } from "../../constants/apiRoutes";
import useCustomToastr from "../../utils/useCustomToastr";
import { BsUpload } from "react-icons/bs";
import api from "../../services/api";
import { GrDocument, GrDocumentPdf, GrVideo } from "react-icons/gr";
import { Button } from "../common";

function FileUploader(props) {
  const [isHovered, setHover] = React.useState(false);
  const [uploadedFile, setUploadedFile] = useState(
    props.image
      ? { id: props.image.id, status: "preview", preview: props.image.url, name: props.image.fileName, mimeType: props.image.mimeType }
      : {}
  );
  const [isUploading, setIsUploading] = useState(false);
  const toast = useCustomToastr();

  const uploadFile = (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", props.startupId || "logo");
    api
      .post(UPLOAD, formData, { "Content-Type": "multipart/form-data" })
      .then((r) => {
        const { id, fileUrl } = r;
        setUploadedFile({ id, status: "success", preview: fileUrl, name: file.name, mimeType: file.type });
        props.setFile(id);
        toast.showSuccess({ description: "File added successfully" });
        setIsUploading(false);
      })
      .catch(() => {
        toast.showError({ description: "Error in Uploading" });
        setIsUploading(false);
      });
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onabort = () => toast.showError({ description: "Could not read file!" });
    reader.onerror = () => toast.showError({ description: "Error on reading file!" });
    reader.onload = () => uploadFile(file);
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    const toRemoveKey = uploadedFile.preview?.split("?key=")[1];
    setUploadedFile({});
    toRemoveKey && api.remove(FILE(toRemoveKey));
    props.remove();
  };

  return (
    <Formik enableReinitialize={true}>
      {() => (
        <Form autoComplete="off">
          <Flex my="2em" justifyContent="center" alignItems="center">
            {uploadedFile.mimeType ? (
              <Box pos="relative" align="center" maxW="16em" justifySelf="center">
                <Box pos="absolute" top="1" right="1" m="1" rounded="lg" background="red.500" color="white">
                  <CloseButton onClick={() => handleRemoveFile()} />
                </Box>
                {uploadedFile.mimeType.includes("image") ? (
                  <Image maxW="16em" maxH="12em" src={uploadedFile.preview} alt={uploadedFile.name} fallbackSrc="/logo.png" />
                ) : uploadedFile.mimeType.includes("video") ? (
                  <Box maxW="16em" m="2em" position="relative" onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                    <GrVideo size="12em" opacity={isHovered ? "0.2" : "1"} />
                    {isHovered && (
                      <Link href={uploadedFile.preview} target="_blank">
                        <Button
                          size="sm"
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: "20%",
                          }}
                          zIndex="1"
                        >
                          Click to view
                        </Button>
                      </Link>
                    )}
                  </Box>
                ) : uploadedFile.mimeType.includes("pdf") ? (
                  <GrDocumentPdf size="12em" />
                ) : (
                  <GrDocument size="12em" />
                )}
                <Text>{uploadedFile.name}</Text>
                <Text
                  fontSize="sm"
                  color="darkBlue.500"
                  _hover={{ cursor: "pointer", "text-decoration": "underline" }}
                  onClick={() => handleRemoveFile()}
                >
                  Remove File
                </Text>
              </Box>
            ) : isUploading ? (
              <Spinner />
            ) : (
              <Dropzone
                onDrop={onDrop}
                useFsAccessApi={false}
                accept={{
                  "image/jpeg": [".jpeg", ".png", ".jpg"],
                  "video/mp4": [".mp4"],
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <Flex
                    align="center"
                    justify="center"
                    {...getRootProps()}
                    border="1px"
                    borderRadius="md"
                    borderColor="blue.300"
                    borderStyle="dashed"
                    bg="white"
                    height="10em"
                    cursor="pointer"
                    maxW="16em"
                  >
                    <input {...getInputProps()} />
                    <Stack align="center" justifyContent="center">
                      <BsUpload size="2em" />
                      <Text mx="2" textAlign="center">
                        Drag and drop OR Click here to Upload a file
                      </Text>
                    </Stack>
                  </Flex>
                )}
              </Dropzone>
            )}
          </Flex>
        </Form>
      )}
    </Formik>
  );
}

FileUploader.defaultProps = {
  showHeader: true,
};

FileUploader.propTypes = {
  label: PropTypes.string,
};

export default FileUploader;
