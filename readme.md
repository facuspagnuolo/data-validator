# JS Object Data Validator

## Example
1. Define a model
```js
  const FileModel = {
    id: {
      type: DataTypes.INTEGER,
      nullable: false,
    },
    url: {
      type: DataTypes.STRING,
      nullable: false,
    },
  }

  const UserModel = { 
    id: {
      type: DataTypes.INTEGER,
      nullable: false,
    },
    name: {
      type: DataTypes.STRING,
      nullable: false,
    },
    nicknames: {
      type: DataTypes.STRING,
      many: true,
    },
    birthDate: {
      type: DataTypes.DATE,
      dateFormat: 'DD/MM/YYYY',
      nullable: false,
    },
    verified: {
      type: DataTypes.BOOLEAN
    },
    document: {
      type: FileModel
    }
  }
```

2. Validate
```js
  const user = {
    id: 1,
    name: 'Carlos',
    birthDate: '15/08/1991',
    verified: false,
    nicknames: ['Perez', 'Sanchez'],
    document: {
      id: 1, 
      url: 'www.google.com'
    },
  }
  const validator = new DataValidator(UserModel, user)
  const errors = validator.call()
  console.log(errors)
```
