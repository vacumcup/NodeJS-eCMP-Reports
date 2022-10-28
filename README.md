# Node.js - eCMP Reports Backend

> Node.js and MySQL

## Initialize ENV Vars

- go to config folder
- remove `.temp` on `config.env.temp`
- copy and paste this variables below and initialize with your setup

```env
NODE_ENV="development"
PORT="5000"

# mysql config
DB_HOST="localhost"
DB_NAME="database_name"
DB_USER="your_username"
DB_PASS="your_password"

# json web token setup
JWT_SECRET="jwt_secret"
JWT_EXPIRE="1d"
JWT_COOKIE_EXPIRE="1"
```

## Usage

### Install npm packages

```bash
npm install
```

> `optional` - if there is any issue with the packages

```bash
npm install --legacy-peer-deps
```

```bash
npm audit fix --force
```

### Run in development mode

```bash
npm run dev
```

## Frontend

React.js - https://github.com/armdnks/ReactJS-eCMP-Reports
