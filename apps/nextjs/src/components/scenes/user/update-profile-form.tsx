import { ActionIcon, Avatar, Input, Text } from "@mantine/core";
import { AUTH_PROVIDERS } from "@prisma/client";
import { IconPencil } from "@tabler/icons-react";
import { find } from "lodash";
import {
  t,
  updateUserProfileSchema,
  type UpdateUserProfileInput,
} from "@acme/shared";

import { api, type RouterOutputs } from "~/utils/api";
import { showNotification } from "~/utils/helpers/show-notification";
import { Form, SubmitButton, TextField } from "~/components/form";

interface Props {
  profile: RouterOutputs["profile"]["getById"] | undefined | null;
}

export const UpdateProfileForm = ({ profile }: Props) => {
  if (!profile) {
    return null;
  }

  const apiContext = api.useContext();
  const mutation = api.profile.update.useMutation();

  const onSubmit = (formData: UpdateUserProfileInput) => {
    mutation.mutate(formData, {
      onError(error) {
        showNotification({ message: error.message });
      },
      async onSuccess() {
        await apiContext.profile.getById.invalidate({ id: profile?.id });
      },
    });
  };

  const credentialsAccount = find(profile?.user?.accounts, {
    provider: AUTH_PROVIDERS.credentials,
  });

  const initialValues = {
    id: profile?.id,
    firstName: profile?.firstName || "",
    image: profile?.image || "",
  };

  return (
    <Form
      name="update-profile"
      schema={updateUserProfileSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      <div className="flex justify-between">
        <div className="space-y-4">
          <Input.Wrapper label={t("email")} className="group">
            <div className="flex">
              <Text c="dimmed" size="md">
                {profile?.user?.email}
              </Text>
              <span className="hidden group-hover:block">
                <ActionIcon variant="transparent" size="sm">
                  <IconPencil size="1rem" />
                </ActionIcon>
              </span>
            </div>
          </Input.Wrapper>
          {!!credentialsAccount && (
            <Input.Wrapper label={t("password")} className="group">
              <div className="flex">
                <Text c="dimmed" size="md">
                  ******
                </Text>
                <span className="hidden group-hover:block">
                  <ActionIcon variant="transparent" size="sm">
                    <IconPencil size="1rem" />
                  </ActionIcon>
                </span>
              </div>
            </Input.Wrapper>
          )}
        </div>
        <div>
          <Avatar src={profile?.image} radius="md" size="xl" />
        </div>
      </div>
      <TextField name="firstName" label={t("firstName")} />
      <TextField name="image" label={t("image")} />
      <SubmitButton>{t("update")}</SubmitButton>
    </Form>
  );
};
