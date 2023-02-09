import type { Prisma } from "@acme/db";
import {
  throwError,
  type GlobalReject,
  type ShouldThrow,
  type WithContext,
} from "@acme/shared";

import { BaseModel } from "../base-model";
import { afterInsert } from "./helpers/after-insert";
import { processDoc, type ProcessDocProps } from "./helpers/process-doc";

export class WorkspaceModel extends BaseModel {
  _collection: Prisma.WorkspaceDelegate<GlobalReject>;

  constructor({ ctx }: WithContext) {
    super({ ctx });
    this._collection = this._db.workspace;
  }

  async findByDomain(domain: string, { shouldThrow }: ShouldThrow = {}) {
    const found = await this._collection.findUnique({
      where: { domain },
    });
    if (found) return found;

    return shouldThrow ? throwError(`tn.error:workspace.notFound`) : null;
  }

  async findById(id: string, { shouldThrow }: ShouldThrow = {}) {
    const found = await this._collection.findUnique({
      where: { id },
    });
    if (found) return found;

    return shouldThrow ? throwError(`tn.error:workspace.notFound`) : null;
  }

  async insert(data: Prisma.WorkspaceUncheckedCreateInput) {
    const newWorkspace = await this._collection.create({ data });

    // hooks
    await afterInsert(newWorkspace, { ctx: this._ctx });
    return newWorkspace;
  }

  async prepareDoc({ input, oldDoc }: ProcessDocProps) {
    return processDoc({ input, oldDoc, model: this });
  }
}
