import { signIn } from "next-auth/react";
import { signinSchema, t, type SigninInput } from "@acme/shared";

import { showNotification } from "~/utils/helpers/show-notification";
import { SubmitButton } from "~/components/buttons";
import { Form, PasswordField, TextField } from "~/components/form";

export const SigninForm = () => {
  const onSubmit = async (formData: SigninInput) => {
    const response = await signIn("credentials", {
      ...formData,
      redirect: false,
    });
    if (response?.error) {
      showNotification({
        message: response.error,
      });
    } else {
      window.location.replace("/");
    }
  };

  return (
    <Form
      name="signin"
      initialValues={{ email: "", password: "" }}
      schema={signinSchema}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={onSubmit}
    >
      <TextField name="email" label={t("email")} />
      <PasswordField name="password" label={t("password")} />
      <SubmitButton>{t("auth.signin.btn")}</SubmitButton>
    </Form>
  );
};
