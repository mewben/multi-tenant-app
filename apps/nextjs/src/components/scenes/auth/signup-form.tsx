import { signupSchema, t, type SignupInput } from "@acme/shared";
import { signIn } from "next-auth/react";

import { SubmitButton } from "~/components/buttons";
import { Form, PasswordField, TextField } from "~/components/form";
import { showNotification } from "~/utils/helpers/show-notification";

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
      <TextField name="name" label={t("name")} size="md" />
      <TextField name="email" label={t("email")} size="md" />
      <PasswordField name="password" label={t("password")} size="md" />
      <div className="pt-4">
        <SubmitButton size="md" radius="md" fullWidth>
          {t("auth.signup.btn")}
        </SubmitButton>
      </div>
    </Form>
  );
};
