import formidable from "formidable";

export interface IFormDataFile {
  relativePath: string;

  file: formidable.File;
}
