export enum Di {
  Redis = "Redis",
  RabbitMQ = "RabbitMQ",
  Publisher = "RabbitMQ Publisher",

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
  RabbitConnectionFactory = "IRabbitConnectionFactory",

  GenerateBundleConsumerHandler = "BundleConsumerHandler",
}
