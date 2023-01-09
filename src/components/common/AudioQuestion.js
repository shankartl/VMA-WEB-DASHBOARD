import { Box, Button, Flex, Input, InputGroup, InputRightElement, Stack, Text } from "@chakra-ui/react";
import { Field } from "formik";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { CgFileAdd } from "react-icons/cg";

export const AudioQuestion = (props) => {
  // console.log(props.index, "props Index ");
  // const [file, setFiles] = useState({});
  // console.log(file, "Filessssss");
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({
    // onDrop: (acceptedFiles) => {
    //   setFiles((prevFiles) =>
    //     acceptedFiles.reduce(
    //       (acc, file) =>
    //         console.log(
    //           acc,
    //           "acc"
    //         )({
    //           ...acc,
    //           [file.name]: {
    //             file,
    //             fileType: "",
    //           },
    //         }),
    //       prevFiles
    //     )
    //   );
    // },
    accept: {
      audio: [".mp3"],
    },
    maxFiles: 1, //accept one files
    multiple: false, // did not allow multiple files
  });
  // console.log(getInputProps, "getInputProps");

  const acceptedFileItems = acceptedFiles.map((file) => <p key={file.path}>{file.path}</p>);
  const fileRejectionItems = fileRejections.length;

  return (
    <>
      <section className="container">
        {/* <Flex {...getRootProps()} w={{ base: "100%", md: "50%", lg: "50%" }}>
          <input {...getInputProps()} />
          <Stack align="center" justifyContent="center" w="100%">
            <InputGroup>
              <Button bg="white" variant="solid" w="100%" justifyContent="left">
                Select a file...
              </Button>
              <InputRightElement>{<CgFileAdd />}</InputRightElement>
            </InputGroup>
          </Stack>
        </Flex> */}
        <input
          type="file"
          // name="file"
          name={`questionType[${props.index}].audioFile`}
          onChange={(event) => {
            props.setFieldValue(`questionType[${props.index}].audioFile`, event.currentTarget.files[0].name);
            // console.log(event.currentTarget.files[0], "event");
          }}
        />

        <Box py="3">
          <Text fontSize="sm">{acceptedFileItems}</Text>
          <Text fontSize="sm" color="red">
            {fileRejectionItems > 1 ? "Select one file in mp3" : ""}
          </Text>
        </Box>
      </section>
    </>
  );
};
AudioQuestion.defaultProps = {
  audio: "Upload audio",
  supportingQuestion: "Supporting Question",
};
