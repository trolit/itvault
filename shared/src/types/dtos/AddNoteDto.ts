export type AddNoteDto<T> = {
  text: string;

  resource: {
    id: number | string;

    name: T;
  };
};
