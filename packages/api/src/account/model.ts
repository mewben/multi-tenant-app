import type { AUTH_PROVIDERS, Prisma } from "@acme/db";
import { throwError } from "@acme/shared";

import { BaseModel } from "~/api/base-model";
import { processDoc, type ProcessDocProps } from "./helpers/process-doc";

const COLLECTION_NAME = "account";

interface FindByProviderAndProviderAccountIdProps {
  provider: AUTH_PROVIDERS;
  providerAccountId: string;
  shouldThrow?: boolean;
}

export class AccountModel extends BaseModel {
  async findByProviderAndProviderAccountId({
    provider,
    providerAccountId,
    shouldThrow,
  }: FindByProviderAndProviderAccountIdProps) {
    const found = await this._db[COLLECTION_NAME].findUnique({
      where: {
        provider_providerAccountId: { provider, providerAccountId },
      },
    });
    if (found) return found;
    return shouldThrow ? throwError(`tn.error:account.notFound`) : null;
  }

  async insert(data: Prisma.AccountUncheckedCreateInput) {
    return this._db[COLLECTION_NAME].create({ data });
  }

  async prepareDoc({ input, oldDoc }: ProcessDocProps) {
    return processDoc({ input, oldDoc, model: this });
  }
}
