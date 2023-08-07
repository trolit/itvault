// @TODO rename to AddNoteDto
export type AddEditNoteDto<T> = {
  text: string;

  resource: {
    id: number | string;

    name: T;
  };
};
