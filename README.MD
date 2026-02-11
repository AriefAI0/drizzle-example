## SETUP DRIZZLE
#### SETUP DRIZZLE DATABASE
- Create database first
```
mkdir my_db
```

- initialize NPM package manager
```
# cd to my_db first
npm init -y
```

- install dependency
```
//install drizzle orm client 
npm i drizzle-orm @libsql/client dotenv

//install  drizzle kit (we using typescript)
npm i -D drizzle-kit tsx @types/node
```

- Define your schema
    * Create a directory for your database logic. In Drizzle, your TypeScript code is your schema.
    * create File: src/db/schema.ts  
    * Example schema : [travis schema](./src/db/schema.ts)
```
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
```

- configuration drizzle
Drizzle Kit is the CLI tool that handles the "creation" of the actual .db file by looking at your schema.
    * create File:drizzle.config.ts  under root folder. [click me](drizzle.config.ts)
```
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite', // Use 'sqlite' for local .db files
  dbCredentials: {
    url: 'file:local.db', // This creates the "local.db" file in your root
  },
});
```
- Create the Database File
    * You don't manually create the .db file; Drizzle does it for you when you "push" your schema or run a migration.

Run this command to sync your TypeScript schema with a new SQLite file:
```
npx drizzle-kit push
```
* What happened? Drizzle Kit checked your drizzle.config.ts, saw that local.db didn't exist, created it, and added the users table automatically.

---
### Connect and Use
 - CRUD

- Now you can interact with your new .db file in your application code.
- create File: src/index.ts
- example [travis index.ts](./src/index.ts) - for db
```
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { users } from "./db/schema";

const client = createClient({ url: "file:local.db" });
const db = drizzle(client);

async function main() {
  // Insert a user
  await db.insert(users).values({
    name: "John Doe",
    email: "john@example.com",
  });

  // Query users
  const allUsers = await db.select().from(users);
  console.log("Users in DB:", allUsers);
}

main();
```
- RUN IT !
```
npx tsx src/index.ts
```
---
### Display Database

- Display standard table
```
npx drizzle-kit studio   
```


### How to display ERD Diagram

- install dependency
```
npm install drizzle-erd --save-dev
```

- Setup script to generate ERD in .svg image
    * must specify the path of generated img

```
"scripts": {
    "db:generate-erd": "drizzle-erd --in ./src/db/schema.ts --out erd.svg"
  }
```
 * --out erd.svg (output location)  <-- specify output path and file name
 * --in ./src/db/schema.ts <-- specify input schema


 RUN! the ERD generator 
```
 npm run db:generate-erd
```


---
Reference : https://joyalajohney.hashnode.dev/drizzleorm-migrations-guide