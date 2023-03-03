import { type ReactNode } from "react";
import { createFormContext } from "@mantine/form";
import { type ZodEffects, type ZodObject } from "zod";

import { zodResolver } from "./zod-resolver";

const [FormProvider, useFormContext, useForm] = createFormContext();

interface Props {
  name: string;
  initialValues: Record<string, any>;
  schema: ZodObject<any> | ZodEffects<ZodObject<any>>;
  onSubmit: (formData: any) => void;
  children: ReactNode;
}

const Form = ({ name, initialValues, schema, onSubmit, children }: Props) => {
  const form = useForm({
    initialValues,
    validate: zodResolver(schema),
  });

  return (
    <FormProvider form={form}>
      <form
        onSubmit={form.onSubmit((formData) => onSubmit(formData))}
        data-pw={`form-${name}`}
        className="space-y-4"
      >
        {children}
      </form>
    </FormProvider>
  );
};

export { Form, useFormContext };
