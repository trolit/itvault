import formidable from "formidable";

export const forEachFormDataFile = (
  files: formidable.Files,
  callback: (path: string, file: formidable.File) => void
) => {
  for (const [path, value] of Object.entries(files)) {
    const arrayOfFiles = Array.isArray(value) ? value : [value];

    for (const file of arrayOfFiles) {
      callback(path, file);
    }
  }
};
