# Playground

Test environment for working with the Bloko driver.

## Setup

```bash
cd playground
npm install
```

## Using the Driver

Run inline commands from this directory:

```bash
node -e "
import { createBloko } from 'bloko';

const bloko = createBloko({
  db: {
    host: 'localhost',
    port: 5432,
    database: 'bloko',
    user: 'admin',
    password: 'password',
  },
});

// Your code here

await bloko.disconnect();
"
```

For driver API reference, see `/docs/driver/`.
