import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { t, verifyUserSchema, type VerifyUserInput } from "@acme/shared";

import { api } from "~/utils/api";
import { showNotification } from "~/utils/helpers/show-notification";
import { SubmitButton } from "~/components/buttons";
import { Form, TextField } from "~/components/form";

interface Props {
  userId: string;
  verificationCode?: string;
}

export const VerifyUserForm = ({ userId, verificationCode = "" }: Props) => {
  const mutation = api.user.verify.useMutation();
  const { data: session, status } = useSession();
  const [hasCode, setCode] = useState(!!verificationCode);

  const onSubmit = (formData: VerifyUserInput) => {
    mutation.mutate(formData, {
      onError(error: any) {
        setCode(false);
        showNotification({ message: error.message });
      },
      onSuccess(data: any) {
        showNotification({ color: "green", message: t("user.verify.success") });
        // login again if session.user.id is not the same as userId
        window.location.replace(
          data.id === session?.user?.id ? "/" : "/signout",
        );
      },
    });
  };

  // If verificationCode is present,
  // attempt verification automatically
  useEffect(() => {
    if (verificationCode && status !== "loading") {
      onSubmit({ id: userId, verificationCode });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verificationCode, status]);

  if (hasCode) {
    return <div>{t("verifying your code")}</div>;
  }

  return (
    <Form
      name="verify-user"
      schema={verifyUserSchema}
      initialValues={{ id: userId, verificationCode }}
      onSubmit={onSubmit}
    >
      <TextField name="verificationCode" label={t("auth.verificationCode")} />
      <SubmitButton loading={mutation.isLoading}>{t("submit")}</SubmitButton>
    </Form>
  );
};
