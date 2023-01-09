import { Button } from "@chakra-ui/react";
import { Field } from "formik";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

/* dropZone style */

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

const ImageQuestion = (props) => {
  // const [files, setFiles] = useState([]);
  // console.log(props, "props");

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".png", ".jpg"],
      "audio/mp3": [".mp3"],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      // console.log(acceptedFiles, "accepted Files");
      props.setFieldValue(
        `questionType[${props.index}].imageFile`,
        acceptedFiles,
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });
  console.log(props.props.questionType[0].imageFile, "props");

  const thumbs =
    props.props.questionType[0].imageFile &&
    props.props.questionType[0].imageFile.map((file) => (
      <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          <img
            src={file.preview}
            style={img}
            // Revoke data uri after image is loaded
            onLoad={() => {
              URL.revokeObjectURL(file.preview);
            }}
          />
        </div>
      </div>
    ));

  return (
    <section className="container">
      <div
        {...getRootProps({ className: "dropzone" })}
        style={{ cursor: "pointer", padding: "20px", border: "2px dotted gray", borderRadius: "5px" }}
      >
        <input {...getInputProps()} />
        <p>Drag drop some files here, or click to select files</p>
      </div>
      <aside style={thumbsContainer}>{thumbs}</aside>
      {/* <Button>Remove File</Button> */}
    </section>
  );
};

export default ImageQuestion;
