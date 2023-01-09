import React from "react";
import { USER } from "../../../constants/apiRoutes";
import api from "../../../services/api";
import { useAuth } from "../../../services/auth";
import { alert } from "../../../utils/commonUtil";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import useCustomToastr from "../../../utils/useCustomToastr";
import { Button } from "../../common";

const DeleteUser = ({ id, pageRefresher }) => {
  const auth = useAuth();
  const toast = useCustomToastr();

  const handleClick = () => {
    if (id === auth.user?.id) return alert({ title: "Not allowed!", icon: "error", text: "You can't delete yourself!" });
    alert({
      title: "Are you sure?",
      text: "Do you want to delete this user? You will not be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No.",
      confirmButtonText: "Yes!",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .remove(USER(id))
          .then(() => {
            alert({ title: "Success", text: "User deleted!" });
            pageRefresher();
          })
          .catch((error) => {
            const e = formattedErrorMessage(error);
            toast.showError(e);
          });
      }
    });
  };
  return (
    <Button size="xs" colorScheme="red" onClick={handleClick}>
      Delete
    </Button>
  );
};

export default DeleteUser;
