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

  TagRepository = "ITagRepository",
  FileRepository = "IFileRepository",
  NoteRepository = "INoteRepository",
  RoleRepository = "IRoleRepository",
  UserRepository = "IUserRepository",
  BundleRepository = "IBundleRepository",
  BucketRepository = "IBucketRepository",
  VariantRepository = "IVariantRepository",
  BlueprintRepository = "IBlueprintRepository",
  WorkspaceRepository = "IWorkspaceRepository",

  ConsumerFactory = "IConsumerFactory",
  FormidableFormFactory = "IFormidableFormFactory",

  GenerateBundleConsumerHandler = "BundleConsumerHandler",
}
