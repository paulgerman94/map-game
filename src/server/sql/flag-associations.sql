CREATE TABLE IF NOT EXISTS "flag-associations" (
	"uid" BIGSERIAL PRIMARY KEY NOT NULL,
	"location" geometry UNIQUE NOT NULL,
	"pois" poi[] NOT NULL,
	"radius" REAL NOT NULL
);
CREATE INDEX IF NOT EXISTS "pois-location" ON "flag-associations" USING btree ("location");