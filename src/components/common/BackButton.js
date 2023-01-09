import React from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const BackButton = () => {
  let navigate = useNavigate();
  return (
    <Button colorScheme="darkBlue" onClick={() => navigate(-1)} mb="1em">
      <BiArrowBack />
    </Button>
  );
};

export default BackButton;
