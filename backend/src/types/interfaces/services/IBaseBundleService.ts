import { BundleDto } from "@dtos/BundleDto";

export interface IBaseBundleService {
  build(workspaceId: number, data: BundleDto[]): Promise<void>;
}
