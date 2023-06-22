import formidable from "formidable";

export interface IFormDataFile {
  key: string;

  file: formidable.File;
}
