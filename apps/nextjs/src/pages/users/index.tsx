import { type NextPage } from "next";
import { Table, Tabs } from "@mantine/core";
import { map } from "lodash";
import { randomCuid, t } from "@acme/shared";

import { api } from "~/utils/api";
import { showNotification } from "~/utils/helpers/show-notification";
import { Button } from "~/components/buttons";
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
      popupId,
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
      <div className="box mt-4 mb-2 flex items-center justify-between">
        <span className="title text-2xl font-bold">Users</span>
        <div>
          <Button onClick={onClickCreate}>Create new user</Button>
        </div>
      </div>
      <div className="mb-3">
        <Tabs radius="xs" defaultValue="all">
          <Tabs.List>
            <Tabs.Tab value="all">All</Tabs.Tab>
            <Tabs.Tab value="archived">Archived</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="all">
            <ProfilesCell
              render={({ data }) => {
                return (
                  <Table verticalSpacing="xs" highlightOnHover>
                    <thead>
                      <tr>
                        <th className="w-full">Name</th>
                        <th className="min-w-[300px]">&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      {map(data, (item) => {
                        return (
                          <tr key={item.id}>
                            <td>{item.firstName}</td>
                            <td>
                              <button
                                type="button"
                                onClick={() => onClickRemove(item.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                );
              }}
            />
          </Tabs.Panel>
          <Tabs.Panel value="archived">
            <ProfilesCell
              render={({ data }) => {
                return (
                  <Table verticalSpacing="xs" highlightOnHover>
                    <thead>
                      <tr>
                        <th className="w-full">Name (Archived)</th>
                        <th className="min-w-[300px]">&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      {map(data, (item) => {
                        return (
                          <tr key={item.id}>
                            <td>{item.firstName}</td>
                            <td>
                              <button
                                type="button"
                                onClick={() => onClickRemove(item.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                );
              }}
            />
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  );
};

export default UsersPage;
