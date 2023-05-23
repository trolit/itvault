import IncomingForm from "formidable/Formidable";

export interface IFormidableFormFactory {
  create(destination?: string): Promise<IncomingForm>;
}
