export enum Di {
  Redis = "Redis",
  S3Client = "S3Client",
  RabbitMQ = "RabbitMQ",
  EngineIO = "Engine.IO",
  Publisher = "RabbitMQ Publisher",
  MailTransporter = "MailTransporter",

  AuthService = "IAuthService",
  DateService = "IDateService",
  MailService = "IMailService",
  RoleService = "IRoleService",
  UserService = "IUserService",
  FileService = "IFileService",
  VariantService = "IVariantService",
  DataStoreService = "IDataStoreService",
  WorkspaceService = "IWorkspaceService",
  EntityMapperService = "IEntityMapperService",
  SocketServiceManager = "ISocketServiceManager",

  TagRepository = "ITagRepository",
  FileRepository = "IFileRepository",
  NoteRepository = "INoteRepository",
  RoleRepository = "IRoleRepository",
  UserRepository = "IUserRepository",
  BundleRepository = "IBundleRepository",
  BucketRepository = "IBucketRepository",
  VariantRepository = "IVariantRepository",
  BlueprintRepository = "IBlueprintRepository",
  DirectoryRepository = "IDirectoryRepository",
  WorkspaceRepository = "IWorkspaceRepository",
  PermissionRepository = "IPermissionRepository",

  JobFactory = "IJobFactory",
  ConsumerFactory = "IConsumerFactory",
  FormidableFormFactory = "IFormidableFormFactory",

  SendMailConsumerHandler = "MailConsumerHandler",
  GenerateBundleConsumerHandler = "BundleConsumerHandler",
}
