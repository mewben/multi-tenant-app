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

interface FindByWorkspaceAndUserProps extends ShouldThrow {
  workspaceId: string;
  userId: string;
}

interface InsertProps {
  data: Prisma.ProfileUncheckedCreateInput;
  skipBase?: boolean;
}

export class ProfileModel extends BaseModel {
  _collection: Prisma.ProfileDelegate<GlobalReject>;

  constructor({ ctx }: WithContext) {
    super({ ctx });
    this._collection = this._db.profile;
  }

  async deleteOne(id: string, { shouldThrow }: ShouldThrow = {}) {
    // we use deleteMany so we don't have to index both id and workspaceId
    const result = await this._collection.deleteMany({
      where: {
        id,
        workspaceId: this._currentProfile.workspace.id,
      },
    });

    if (result.count === 1) return true;
    return shouldThrow ? throwError("tn.error:remove.failed") : false;
  }

  async findById(id: string, { shouldThrow = true }: ShouldThrow = {}) {
    const found = await this._collection.findUnique({
      where: { id },
    });
    if (!found || found.workspaceId !== this._workspaceId) {
      return shouldThrow ? throwError(`tn.error:role.notFound`) : null;
    }

    return found;
  }

  async findByWorkspaceAndUser({
    workspaceId,
    userId,
    shouldThrow,
  }: FindByWorkspaceAndUserProps) {
    const found = await this._collection.findUnique({
      where: {
        workspaceId_userId: { workspaceId, userId },
      },
    });
    if (found) return found;
    return shouldThrow ? throwError(`tn.error:profile.notFound`) : null;
  }

  async insert({ data, skipBase }: InsertProps) {
    const baseData = skipBase ? {} : prepareInsertBaseData(this._ctx);

    // TODO: hooks send email invitation

    return this._collection.create({
      data: {
        ...data,
        ...baseData,
      },
    });
  }

  // TODO: exclude invitationCode e.g
  async list() {
    return await this._collection.findMany({
      where: { workspaceId: this._currentProfile?.workspace.id },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        role: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { firstName: "asc" },
    });
  }

  async prepareDoc({ input, oldDoc }: ProcessDocProps) {
    return processDoc({ input, oldDoc, model: this });
  }

  async update(id: string, data: Prisma.ProfileUncheckedUpdateInput) {
    return this._collection.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
        updatedBy: this._currentProfile.id,
      },
    });
  }
}
