import {
  createWorkspaceSchema,
  getDomainUrl,
  t,
  type CreateWorkspaceInput,
} from "@acme/shared";

import { SubmitButton } from "~/components/buttons";
import { Form, TextField } from "~/components/form";
import { api } from "~/utils/api";
import { showNotification } from "~/utils/helpers/show-notification";

export const CreateWorkspaceForm = () => {
  const mutation = api.workspace.create.useMutation();

  const onSubmit = (formData: CreateWorkspaceInput) => {
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
      name="create-workspace"
      schema={createWorkspaceSchema}
      initialValues={{ title: "", domain: "" }}
      onSubmit={onSubmit}
    >
      <TextField name="title" label={t("workspace.title")} />
      <TextField name="domain" label={t("workspace.domain")} />
      <SubmitButton loading={mutation.isLoading} fullWidth>
        {t("submit")}
      </SubmitButton>
    </Form>
  );
};
