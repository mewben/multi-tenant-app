import { type NextPage } from "next";
import { map } from "lodash";
import { randomCuid, t } from "@acme/shared";

import { api } from "~/utils/api";
import { showNotification } from "~/utils/helpers/show-notification";
import { ProfilesCell } from "~/components/cells/profiles";
import { usePopupContext } from "~/components/popup";
import { CreateUserProfileForm } from "~/components/scenes/user/create-user-profile-form";

const UsersPage: NextPage = () => {
  const { openPopup, closePopup } = usePopupContext();
  const mutation = api.profile.remove.useMutation();
  const apiContext = api.useContext();

  const onClickCreate = () => {
    const popupId = randomCuid();
    openPopup({
      modalId: popupId,
      drawerId: popupId,
      title: t("user.create.title"),
      children: (
        <CreateUserProfileForm afterSuccess={() => closePopup(popupId)} />
      ),
    });
  };

  const onClickRemove = (id: string) => {
    // TODO: show confirm modal
    mutation.mutate([id], {
      onError(error) {
        showNotification({ message: error.message });
      },
      async onSuccess(data) {
        // TODO: optmize by removing the removedIds from the list
        if (data.warning) {
          showNotification({ color: "yellow", message: data.warning });
        }
        await apiContext.profile.list.invalidate();
      },
    });
  };

  return (
    <>
      <h1>Users Page</h1>
      <button onClick={onClickCreate}>Create new user</button>
      <div>List of users here</div>
      <ProfilesCell
        render={({ data }) => {
          return (
            <>
              {map(data, (item) => {
                return (
                  <div
                    key={item.id}
                    className="border-solid border-gray-200 p-4"
                  >
                    <div>{item.id}</div>
                    <div>{item.firstName}</div>
                    <button
                      type="button"
                      onClick={() => onClickRemove(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </>
          );
        }}
      />
    </>
  );
};

export default UsersPage;
