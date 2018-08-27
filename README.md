# Address book

## Commands
`npm run doc` - generates api documentation
`NODE_ENV=testEnv npm run server` - runs server locally without deps
`npm start` - runs the server in production, you need to provide certain env variables, see below

## Used env variables
`NODE_ENV` - set to `prodEnv` or `testEnv`
`DATABASE_URL` - use postgress connection URI
`FIREBASE_CONFIG` - provide stringified JSON firebase configuration (This is used because the repository is public)

### Todo
- _logging_ In production environment, there should be.
- _ESlint_ I just wrote the code without any prettifiers.
- 