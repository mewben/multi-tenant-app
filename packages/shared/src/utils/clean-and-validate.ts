import { each, get, isEmpty, values } from "lodash";
import { type ZodEffects, type ZodObject } from "zod";

import { t } from "../i18n";
import { throwError } from "./throw-error";

interface Props {
  schema: ZodObject<any> | ZodEffects<ZodObject<any>>;
  input: Record<string, any> | undefined;
  shouldThrow?: boolean;
}
// cleans/strips an input to conform to the schema
// validates the input
// @return [errors, data]
export const cleanAndValidate = ({
  schema,
  input,
  shouldThrow = true,
}: Props) => {
  const parsed = schema.safeParse(input);

  const errors: Record<string, any> = {};

  if (!parsed.success) {
    each(parsed.error?.errors, (error) => {
      const path = error.path.join(".") || "root";

      let errorCode: string = error.code;
      if (isEmpty(get(input, path))) {
        errorCode = "required";
      }

      errors[path] = t(`tn.error:${path}.${errorCode}`, error); // { message: errorMsg, meta: error };
    });

    if (shouldThrow && !isEmpty(errors)) {
      throwError(values(errors)[0] as string);
    }

    return { errors };
  }

  // success
  return { data: parsed.data, errors: null };
};
