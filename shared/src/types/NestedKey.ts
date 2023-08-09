export type NestedKey<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKey<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];
