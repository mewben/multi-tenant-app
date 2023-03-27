import { type NextPage } from "next";
import {
  ActionIcon,
  Avatar,
  Badge,
  Group,
  Menu,
  ScrollArea,
  Table,
  Tabs,
  Text,
} from "@mantine/core";
import { PROFILE_STATUS } from "@prisma/client";
import {
  IconDots,
  IconMessages,
  IconNote,
  IconPencil,
  IconReportAnalytics,
  IconTrash,
} from "@tabler/icons-react";
import { map } from "lodash";
import { randomCuid, t } from "@acme/shared";

import { api } from "~/utils/api";
import { showNotification } from "~/utils/helpers/show-notification";
import { Button } from "~/components/buttons";
import { ProfilesCell } from "~/components/cells/profiles";
import { Header } from "~/components/layouts/header";
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
      <Header>
        <div>Users</div>
        <div>
          <Button onClick={onClickCreate}>Create new user</Button>
        </div>
      </Header>
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
                  <ScrollArea>
                    <Table verticalSpacing="sm" highlightOnHover>
                      <thead>
                        <tr>
                          <th className="w-full">Name</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th className="min-w-[100px]">&nbsp;</th>
                        </tr>
                      </thead>
                      <tbody>
                        {map(data, (item) => {
                          return (
                            <tr key={item.id}>
                              <td>
                                <Group spacing="sm">
                                  <Avatar
                                    size={40}
                                    src={item.image}
                                    radius={40}
                                  />
                                  <div>
                                    <Text fz="sm" fw={500}>
                                      {item.firstName}
                                    </Text>
                                    <Text fz="xs" c="dimmed">
                                      {item.user?.email}
                                    </Text>
                                  </div>
                                </Group>
                              </td>
                              <td>
                                <Text>{item.role.title}</Text>
                              </td>
                              <td>
                                {item.status === PROFILE_STATUS.active ? (
                                  <Badge fullWidth color="green">
                                    {item.status}
                                  </Badge>
                                ) : item.status === PROFILE_STATUS.pending ? (
                                  <Badge fullWidth color="yellow">
                                    {item.status}
                                  </Badge>
                                ) : (
                                  <Badge fullWidth color="gray">
                                    {item.status}
                                  </Badge>
                                )}
                              </td>
                              <td>
                                <Group spacing={0} position="right">
                                  <ActionIcon>
                                    <IconPencil size="1rem" stroke={1.5} />
                                  </ActionIcon>
                                  <Menu
                                    transitionProps={{ transition: "pop" }}
                                    withArrow
                                    position="bottom-end"
                                    withinPortal
                                  >
                                    <Menu.Target>
                                      <ActionIcon>
                                        <IconDots size="1rem" stroke={1.5} />
                                      </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                      <Menu.Item
                                        icon={
                                          <IconMessages
                                            size="1rem"
                                            stroke={1.5}
                                          />
                                        }
                                      >
                                        Send message
                                      </Menu.Item>
                                      <Menu.Item
                                        icon={
                                          <IconNote size="1rem" stroke={1.5} />
                                        }
                                      >
                                        Add note
                                      </Menu.Item>
                                      <Menu.Item
                                        icon={
                                          <IconReportAnalytics
                                            size="1rem"
                                            stroke={1.5}
                                          />
                                        }
                                      >
                                        Analytics
                                      </Menu.Item>
                                      <Menu.Item
                                        icon={
                                          <IconTrash size="1rem" stroke={1.5} />
                                        }
                                        color="red"
                                        onClick={() => onClickRemove(item.id)}
                                      >
                                        Delete
                                      </Menu.Item>
                                    </Menu.Dropdown>
                                  </Menu>
                                </Group>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </ScrollArea>
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
