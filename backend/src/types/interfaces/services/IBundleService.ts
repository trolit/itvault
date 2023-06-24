import { BundleDto } from "@dtos/BundleDto";

export interface IBundleService {
  build(workspaceId: number, data: BundleDto[]): Promise<void>;
}
