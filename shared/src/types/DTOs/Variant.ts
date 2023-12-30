export interface IVariantDTO {
  id: string;

  name: string;

  filename: string;

  createdAt: string;

  size: { value: number; unit: string };
}

export interface IAddVariantDTO {
  name: string;

  fileId: number;
}
