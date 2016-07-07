CREATE TABLE IF NOT EXISTS "flag-associations" (
	"uid" BIGSERIAL PRIMARY KEY NOT NULL,
	"location" geometry UNIQUE NOT NULL,
	"pois" poi[] NOT NULL,
	"radius" REAL NOT NULL
);
/* Once Travis supports PostgreSQL 9.5, this should be CREATE INDEX IF NOT EXISTS. */
CREATE INDEX "pois-location" ON "flag-associations" USING btree ("location");