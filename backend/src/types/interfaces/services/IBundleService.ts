import { Bundle } from "@entities/Bundle";
import { IBody } from "@controllers/Bundle/StoreController";

export interface IBundleService {
  build(workspaceId: number, body: IBody, bundle: Bundle): Promise<void>;
}
