import {
  forgotPasswordSchema,
  t,
  type ForgotPasswordInput,
} from "@acme/shared";
import { useState } from "react";
import { Form, SubmitButton, TextField } from "~/components/form";
import { api } from "~/utils/api";
import { showNotification } from "~/utils/helpers/show-notification";

export const ForgotPasswordForm = () => {
  const [isSuccess, setSuccess] = useState(false);
  const mutation = api.user.forgotPassword.useMutation();

  const onSubmit = (formData: ForgotPasswordInput) => {
    mutation.mutate(formData, {
      onError(error) {
        showNotification({ message: error.message });
      },
      onSuccess() {
        setSuccess(true);
      },
    });
  };

  if (isSuccess) {
    return <>{t("auth.forgotPassword.success")}</>;
  }

  return (
    <Form
      name="forgot-password"
      initialValues={{ email: "" }}
      schema={forgotPasswordSchema}
      onSubmit={onSubmit}
    >
      <TextField name="email" label={t("email")} />
      <SubmitButton>{t("submit")}</SubmitButton>
    </Form>
  );
};
