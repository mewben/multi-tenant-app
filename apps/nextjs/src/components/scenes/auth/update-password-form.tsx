import {
  t,
  updatePasswordSchema,
  type UpdatePasswordInput,
} from "@acme/shared";

import { api } from "~/utils/api";
import { showNotification } from "~/utils/helpers/show-notification";
import { Form, PasswordField, SubmitButton } from "~/components/form";

interface Props {
  afterSuccess?: () => void;
}

export const UpdatePasswordForm = ({ afterSuccess }: Props) => {
  const mutation = api.user.updatePassword.useMutation();

  const onSubmit = (formData: UpdatePasswordInput) => {
    mutation.mutate(formData, {
      onError(error) {
        showNotification({ message: error.message });
      },
      onSuccess() {
        showNotification({
          color: "green",
          message: t("password.update.success"),
        });
        afterSuccess?.();
      },
    });
  };

  return (
    <Form
      name="update-password"
      schema={updatePasswordSchema}
      onSubmit={onSubmit}
      initialValues={{
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }}
    >
      <PasswordField
        name="currentPassword"
        label={t("current_password")}
        data-autofocus
      />
      <PasswordField name="newPassword" label={t("new_password")} />
      <PasswordField name="confirmPassword" label={t("confirm_password")} />
      <SubmitButton>{t("update")}</SubmitButton>
    </Form>
  );
};
