START TRANSACTION;
  CREATE TABLE "user" (
      id serial PRIMARY KEY,
      fname varchar NOT NULL,
      lname varchar NOT NULL,
      username varchar NOT NULL,
      email varchar NOT NULL,
      password varchar NOT NULL
  );
COMMIT;