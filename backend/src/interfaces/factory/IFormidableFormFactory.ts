import formidable from "formidable";

import IncomingForm from "formidable/Formidable";

export interface IFormidableFormFactory {
  create(options: {
    destination?: string;
    filter?: (part: formidable.Part) => boolean;
  }): Promise<IncomingForm>;
}
