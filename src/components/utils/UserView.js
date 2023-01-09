import { Button } from "@chakra-ui/react";
import React from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";

const UserView = ({ data }) => {
  const viewUser = () => {};
  return (
    <>
      <Button
        fontSize="xs"
        bg="white"
        color="black"
        border="0.5px solid lightgrey"
        leftIcon={<AiOutlineInfoCircle fontSize="16px" />}
        p="6"
        _hover={{
          background: "white",
          color: "black",
        }}
        onClick={viewUser}
      >
        VIEW
      </Button>
    </>
  );
};

export default UserView;
