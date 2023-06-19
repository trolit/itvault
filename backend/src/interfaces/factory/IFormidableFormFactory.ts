import IncomingForm from "formidable/Formidable";

export interface IFormidableFormFactory {
  create(options: {
    basePath: string;
    multiples: boolean;
    destination?: string;
  }): Promise<IncomingForm>;
}
