import { type Prisma } from "@acme/db";
import {
  throwError,
  type GlobalReject,
  type ShouldThrow,
  type WithContext,
} from "@acme/shared";

import { BaseModel } from "../base-model";
import { processDoc, type ProcessDocProps } from "./helpers/process-doc";

export class UserModel extends BaseModel {
  _collection: Prisma.UserDelegate<GlobalReject>;

  constructor({ ctx }: WithContext) {
    super({ ctx });
    this._collection = this._db.user;
  }

  async findByEmail(email: string, { shouldThrow }: ShouldThrow = {}) {
    const found = await this._collection.findUnique({
      where: { email },
    });
    if (found) return found;

    return shouldThrow ? throwError(`tn.error:user.notFound`) : null;
  }

  async findById(id: string, { shouldThrow }: ShouldThrow = {}) {
    const found = await this._collection.findUnique({
      where: {
        id,
      },
    });
    if (found) return found;
    return shouldThrow ? throwError(`tn.error:user.notFound`) : null;
  }

  async insert(data: Prisma.UserUncheckedCreateInput) {
    return this._collection.create({ data });
  }

  async prepareDoc({ input, oldDoc }: ProcessDocProps) {
    return await processDoc({ input, oldDoc, model: this });
  }

  async update(id: string, data: Prisma.UserUncheckedUpdateInput) {
    return this._collection.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }
}
