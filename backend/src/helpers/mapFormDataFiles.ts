import formidable from "formidable";

export const mapFormDataFiles = (
  files: formidable.Files
): { key: string; file: formidable.File }[] => {
  const result = [];

  for (const [key, value] of Object.entries(files)) {
    const arrayOfFiles = Array.isArray(value) ? value : [value];

    for (const file of arrayOfFiles) {
      result.push({
        key,
        file,
      });
    }
  }

  return result;
};
