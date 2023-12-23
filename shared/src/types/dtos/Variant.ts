export interface IVariantDto {
  id: string;

  name: string;

  filename: string;

  createdAt: string;

  size: { value: number; unit: string };
}
