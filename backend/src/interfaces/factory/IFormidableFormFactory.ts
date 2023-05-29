import IncomingForm from "formidable/Formidable";

export interface IFormidableFormFactory {
  create(options: { destination?: string }): Promise<IncomingForm>;
}
