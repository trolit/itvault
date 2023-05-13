# Suggestions

### Create table

```
Init<entity-name>Table;
```

e.g. `InitUsersTable`

<br/>

### Update table /\*more than 1 change\*/

```
Update<entity-name>Table
```

e.g. `UpdateUsersTable`

<br/>

### Add attribute to table

```
Expand<entity-name>TableWith<attribute-name>Attribute
```

e.g. `ExpandUsersTableWithPasswordAttribute`

<br/>

### Update table's attribute

```
Update<attribute-name>AttributeOf<entity-name>Table
```

e.g. `UpdatePasswordAttributeOfUsersTable`

<br/>

### Remove table's attribute

```
Remove<attribute-name>AttributeFrom<entity-name>Table
```

e.g. `RemovePasswordAttributeFromUsersTable`
