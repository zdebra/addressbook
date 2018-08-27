# Address book
The app is running [here](https://zdebra-address-book-deploy.herokuapp.com/).

## Commands
- `npm run doc` - generates api documentation
- `NODE_ENV=testEnv npm run server` - runs server locally without deps
- `npm start` - runs the server in production, you need to provide certain env variables, see below

## Used env variables
- `NODE_ENV` - set to `prodEnv` or `testEnv`
- `DATABASE_URL` - use postgress connection URI
- `FIREBASE_CONFIG` - provide stringified JSON firebase configuration (This is used because the repository is public)
- `PORT` - port where server will be running

### What I didn't do
- _logging_ 