import type { Prisma } from "@acme/db";
import {
  throwError,
  type GlobalReject,
  type ShouldThrow,
  type WithContext,
} from "@acme/shared";

import { prepareInsertBaseData } from "~/api/utils/prepare-base-data";
import { BaseModel } from "../base-model";
import { processDoc, type ProcessDocProps } from "./helpers/process-doc";

interface FindByWorkspaceAndTitleProps extends ShouldThrow {
  workspaceId: string;
  title: string;
}

interface InsertProps {
  data: Prisma.RoleUncheckedCreateInput;
  skipBase?: boolean;
}

export class RoleModel extends BaseModel {
  _collection: Prisma.RoleDelegate<GlobalReject>;

  constructor({ ctx }: WithContext) {
    super({ ctx });
    this._collection = this._db.role;
  }

  async findById(id: string, { shouldThrow }: ShouldThrow = {}) {
    const found = await this._collection.findUnique({
      where: { id },
    });
    if (found) return found;
    return shouldThrow ? throwError(`tn.error:role.notFound`) : null;
  }

  async findByWorkspaceAndTitle({
    workspaceId,
    title,
    shouldThrow,
  }: FindByWorkspaceAndTitleProps) {
    const found = await this._collection.findUnique({
      where: {
        workspaceId_title: {
          workspaceId,
          title,
        },
      },
    });
    if (found) return found;
    return shouldThrow ? throwError(`tn.error:role.notFound`) : null;
  }

  async insert({ data, skipBase }: InsertProps) {
    const baseData = skipBase ? {} : prepareInsertBaseData(this._ctx);

    return this._collection.create({
      data: {
        ...data,
        ...baseData,
      },
    });
  }

  async list() {
    return await this._collection.findMany({
      where: { workspaceId: this._currentProfile?.workspace.id },
      orderBy: { title: "asc" },
    });
  }

  async listByWorkspace(workspaceId: string) {
    return this._collection.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "asc" },
    });
  }

  async prepareDoc({ input, oldDoc }: ProcessDocProps) {
    return processDoc({ input, oldDoc, model: this });
  }
}
