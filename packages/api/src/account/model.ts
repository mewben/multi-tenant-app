import type { AUTH_PROVIDERS, Prisma } from "@acme/db";
import {
  throwError,
  type GlobalReject,
  type ShouldThrow,
  type WithContext,
} from "@acme/shared";

import { BaseModel } from "~/api/base-model";
import { processDoc, type ProcessDocProps } from "./helpers/process-doc";

interface FindByProviderAndProviderAccountIdProps extends ShouldThrow {
  provider: AUTH_PROVIDERS;
  providerAccountId: string;
}

export class AccountModel extends BaseModel {
  _collection: Prisma.AccountDelegate<GlobalReject>;

  constructor({ ctx }: WithContext) {
    super({ ctx });
    this._collection = this._db.account;
  }

  async findByProviderAndProviderAccountId({
    provider,
    providerAccountId,
    shouldThrow,
  }: FindByProviderAndProviderAccountIdProps) {
    const found = await this._collection.findUnique({
      where: {
        provider_providerAccountId: { provider, providerAccountId },
      },
    });
    if (found) return found;
    return shouldThrow ? throwError(`tn.error:account.notFound`) : null;
  }

  async insert(data: Prisma.AccountUncheckedCreateInput) {
    return this._collection.create({ data });
  }

  async prepareDoc({ input, oldDoc }: ProcessDocProps) {
    return processDoc({ input, oldDoc, model: this });
  }
}
