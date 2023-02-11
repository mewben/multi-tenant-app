import { signIn } from "next-auth/react";
import { signupSchema, t, type SignupInput } from "@acme/shared";

import { showNotification } from "~/utils/helpers/show-notification";
import { SubmitButton } from "~/components/buttons";
import { Form, PasswordField, TextField } from "~/components/form";

export const SignupForm = () => {
  const onSubmit = async (formData: SignupInput) => {
    const response = await signIn("credentials", {
      ...formData,
      action: "signup",
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
      name="signup"
      initialValues={{
        name: "",
        email: "",
        password: "",
      }}
      schema={signupSchema}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={onSubmit}
    >
      <TextField name="name" label={t("name")} />
      <TextField name="email" label={t("email")} />
      <PasswordField name="password" label={t("password")} />
      <SubmitButton>{t("auth.signup.btn")}</SubmitButton>
    </Form>
  );
};
