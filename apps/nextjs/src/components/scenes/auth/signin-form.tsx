import { signinSchema, t, type SigninInput } from "@acme/shared";
import { signIn } from "next-auth/react";

import { SubmitButton } from "~/components/buttons";
import { Form, PasswordField, TextField } from "~/components/form";
import { showNotification } from "~/utils/helpers/show-notification";

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
      <TextField name="email" label={t("email")} size="md" />
      <PasswordField name="password" label={t("password")} size="md" />
      <div className="pt-4">
        <SubmitButton size="md" radius="md" fullWidth>
          {t("auth.signin.btn")}
        </SubmitButton>
      </div>
    </Form>
  );
};
