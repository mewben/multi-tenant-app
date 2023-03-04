import type { User } from "@prisma/client";
import { getObjectDifference, throwError } from "@acme/shared";

import type { UserModel } from "../model";

export type ProcessDocProps = {
  input: Partial<User>;
  oldDoc?: User;
};

interface Props extends ProcessDocProps {
  model: UserModel;
}

export const processDoc = async ({ input, oldDoc, model }: Props) => {
  const isInsert = !oldDoc;

  const upd = getObjectDifference(input, oldDoc) as Partial<User>;

  // if (isInsert && upd.email) {
  //   // check for duplicate email
  //   // we explicitly do this to throw our own error message
  //   const foundUser = await model.findByEmail(upd.email);
  //   if (foundUser) {
  //     return throwError(`tn.error:email.duplicate`);
  //   }
  // }

  return upd;
};
