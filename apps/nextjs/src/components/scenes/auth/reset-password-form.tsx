import { resetPasswordSchema, t, type ResetPasswordInput } from "@acme/shared";
import { useState } from "react";
import { Form, PasswordField, SubmitButton } from "~/components/form";
import { api } from "~/utils/api";
import { showNotification } from "~/utils/helpers/show-notification";

interface Props {
  email: string;
  resetToken: string;
}

export const ResetPasswordForm = ({ email, resetToken }: Props) => {
  const [isSuccess, setSuccess] = useState(false);
  const mutation = api.user.resetPassword.useMutation();

  const onSubmit = (formData: ResetPasswordInput) => {
    mutation.mutate(formData, {
      onError(error) {
        showNotification({ message: error.message });
      },
      onSuccess() {
        setSuccess(true);
      },
    });
  };

  if (!email) {
    return <>{t("email.notFound")}</>;
  }

  if (!resetToken) {
    return <>{t("resetToken.notFound")}</>;
  }

  if (isSuccess) {
    return <>{t("auth.resetPassword.success")}</>;
  }

  return (
    <Form
      name="reset-password"
      initialValues={{ email, resetToken, newPassword: "" }}
      schema={resetPasswordSchema}
      onSubmit={onSubmit}
    >
      <PasswordField name="newPassword" label={t("newPassword")} size="md" />
      <SubmitButton
        loading={mutation.isLoading}
        size="md"
        radius="md"
        fullWidth
      >
        {t("submit")}
      </SubmitButton>
    </Form>
  );
};
