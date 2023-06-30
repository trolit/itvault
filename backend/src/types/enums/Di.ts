export enum Di {
  Redis = "Redis",
  RabbitMQ = "RabbitMQ",

  AuthService = "IAuthService",
  DateService = "IDateService",
  UserService = "IUserService",
  FileService = "IFileService",
  BundleService = "IBundleService",
  VariantService = "IVariantService",
  DataStoreService = "IDataStoreService",
  EntityMapperService = "IEntityMapperService",

  RoleRepository = "IRoleRepository",
  UserRepository = "IUserRepository",
  FileRepository = "IFileRepository",
  BundleRepository = "IBundleRepository",
  BucketRepository = "IBucketRepository",
  VariantRepository = "IVariantRepository",
  BlueprintRepository = "IBlueprintRepository",
  WorkspaceRepository = "IWorkspaceRepository",

  ConsumerFactory = "IConsumerFactory",
  FormidableFormFactory = "IFormidableFormFactory",
}
