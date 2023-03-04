import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { signinSchema, t, type SigninInput } from "@acme/shared";

import { showNotification } from "~/utils/helpers/show-notification";
import { SubmitButton } from "~/components/buttons";
import { Form, PasswordField, TextField } from "~/components/form";

export const SigninForm = () => {
  const router = useRouter();
  const redirect = router.query.redirect as string;

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
      // get redirect
      let redirectUrl = "/";
      if (redirect && redirect.startsWith("/")) {
        redirectUrl = redirect;
      }

      window.location.replace(redirectUrl);
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
