import React from "react";

// similar to useEffect, but only runs from the second render onwards
const useDidUpdate = (func, deps) => {
  const didMount = React.useRef(false);
  React.useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps]);
};

export default useDidUpdate;
