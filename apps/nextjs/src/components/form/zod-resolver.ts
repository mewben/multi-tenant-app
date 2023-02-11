import { isEmpty } from "lodash";
import { type ZodObject } from "zod";
import { cleanAndValidate } from "@acme/shared";

// return objects of error messages if failed in schema
export const zodResolver = (schema: ZodObject<any>) => {
  return (values: Record<string, unknown>) => {
    const { errors } = cleanAndValidate({
      schema,
      input: values,
      shouldThrow: false,
    });

    if (isEmpty(errors)) return {};

    return errors;
  };
};
