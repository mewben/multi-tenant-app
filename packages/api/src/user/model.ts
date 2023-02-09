import type { Prisma } from "@prisma/client";
import { throwError } from "@acme/shared";

import { BaseModel } from "../base-model";
import { processDoc, type ProcessDocProps } from "./helpers/process-doc";

const COLLECTION_NAME = "user";

interface FindByEmailProps {
  email: string;
  shouldThrow?: boolean;
}

interface FindByIdProps {
  id: string;
  shouldThrow?: boolean;
}

export class UserModel extends BaseModel {
  async findByEmail({ email, shouldThrow }: FindByEmailProps) {
    const found = await this._db[COLLECTION_NAME].findUnique({
      where: { email },
    });
    if (found) return found;

    return shouldThrow ? throwError(`tn.error:user.notFound`) : null;
  }

  async findById({ id, shouldThrow }: FindByIdProps) {
    const found = await this._db[COLLECTION_NAME].findUnique({
      where: {
        id,
      },
    });
    if (found) return found;
    return shouldThrow ? throwError(`tn.error:user.notFound`) : null;
  }

  async insert(data: Prisma.UserUncheckedCreateInput) {
    return this._db[COLLECTION_NAME].create({ data });
  }

  async prepareDoc({ input, oldDoc }: ProcessDocProps) {
    return await processDoc({ input, oldDoc, model: this });
  }

  async update(id: string, data: Prisma.UserUncheckedUpdateInput) {
    return this._db[COLLECTION_NAME].update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }
}
