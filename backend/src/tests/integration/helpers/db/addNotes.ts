import { faker } from "@faker-js/faker";
import { Note } from "@db/entities/Note";
import { INoteRepository } from "types/repositories/INoteRepository";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";
import { getOptionsOfTraceRelatedEntity } from "@helpers/getOptionsOfTraceRelatedEntity";

export const addNotes = async (
  notesToAdd: {
    id: number;
    value?: string;
    fileId: number;
    createdById?: number;
    workspaceId: number;
  }[]
) => {
  const notes: Note[] = [];

  const noteRepository = getInstanceOf<INoteRepository>(Di.NoteRepository);

  for (const noteToAdd of notesToAdd) {
    const { id, value, fileId, createdById, workspaceId } = noteToAdd;

    const noteEntity = noteRepository.createEntity({
      id,
      value: value || faker.lorem.words(10),
      file: {
        id: fileId,
      },
      createdBy: {
        id: createdById || 1,
      },
      updatedBy: {
        id: createdById || 1,
      },
    });

    const note = await noteRepository.primitiveSave(
      noteEntity,
      getOptionsOfTraceRelatedEntity({
        userId: createdById || 1,
        workspaceId,
      })
    );

    notes.push(note);
  }

  return notes;
};
