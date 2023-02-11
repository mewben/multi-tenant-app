import { SubmitButton } from "@/components/buttons";
import {
  Form,
  RoleSelectField,
  SwitchField,
  TextField,
} from "@/components/form";
import { t } from "@/lib/i18n";
import {
  createUserProfileSchema,
  type CreateUserProfileInput,
} from "@/types/profile";
import { api } from "@/utils/api";
import { showNotification } from "@/utils/helpers/show-notification";
import type { Profile } from "@prisma/client";

interface Props {
  afterSuccess?: (data: Profile) => void;
}

export const CreateUserProfileForm = ({ afterSuccess }: Props) => {
  const apiContext = api.useContext();
  const mutation = api.profile.create.useMutation();

  const onSubmit = (formData: CreateUserProfileInput) => {
    mutation.mutate(formData, {
      onError(error) {
        showNotification({ message: error.message });
      },
      async onSuccess(data) {
        showNotification({
          color: "green",
          message: t("profile.create.success"),
        });
        await apiContext.profile.invalidate();
        afterSuccess?.(data);
      },
    });
  };

  return (
    <Form
      name="create-user-profile"
      schema={createUserProfileSchema}
      initialValues={{
        firstName: "",
        roleId: "",
        email: "",
        willInvite: false,
        image: "",
      }}
      onSubmit={onSubmit}
    >
      <TextField
        name="firstName"
        label={t("profile.firstName")}
        data-autofocus
      />
      <TextField name="email" label={t("user.email")} />
      <RoleSelectField name="roleId" label={t("role.title")} />
      <SwitchField name="willInvite" label={t("user.willInvite")} />
      <SubmitButton>{t("submit")}</SubmitButton>
    </Form>
  );
};
