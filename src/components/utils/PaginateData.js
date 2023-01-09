import { Box } from "@chakra-ui/react";
import React from "react";

const PaginateData = (currentItems) => {
  return (
    <Box>
      {currentItems &&
        currentItems.map((item) => (
          <>
            <Box>
              <h3>Item #{item}</h3>
            </Box>
          </>
        ))}
    </Box>
  );
};

export default PaginateData;
