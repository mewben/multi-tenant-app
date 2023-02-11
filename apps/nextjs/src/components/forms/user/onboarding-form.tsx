import {
  getDomainUrl,
  onboardingSchema,
  t,
  type OnboardingInput,
} from "@acme/shared";

import { api } from "~/utils/api";
import { showNotification } from "~/utils/helpers/show-notification";
import { SubmitButton } from "~/components/buttons";
import { Form, TextField } from "~/components/form";

export const OnboardingForm = () => {
  const mutation = api.user.onboard.useMutation();

  const onSubmit = (formData: OnboardingInput) => {
    mutation.mutate(formData, {
      onError(error) {
        showNotification({ message: error.message });
      },
      onSuccess(data) {
        window.location.replace(
          getDomainUrl({
            domain: data.domain,
          }),
        );
      },
    });
  };

  return (
    <Form
      name="onboard-user"
      schema={onboardingSchema}
      initialValues={{ firstName: "", workspaceTitle: "", workspaceDomain: "" }}
      onSubmit={onSubmit}
    >
      <TextField name="firstName" label={t("profile.firstName")} />
      <TextField name="workspaceTitle" label={t("workspace.title")} />
      <TextField name="workspaceDomain" label={t("workspace.domain")} />
      <SubmitButton loading={mutation.isLoading}>{t("submit")}</SubmitButton>
    </Form>
  );
};
