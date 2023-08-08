export interface IVariantDto {
  id: string;

  name: string;

  filename: string;

  createdBy: string;

  size: { value: number; unit: string };
}
