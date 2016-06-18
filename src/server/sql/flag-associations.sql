CREATE TABLE IF NOT EXISTS "flag-associations" (
	"uid" BIGSERIAL PRIMARY KEY NOT NULL,
	"location" geometry UNIQUE NOT NULL,
	"radius" REAL NOT NULL,
	"flags" BIGINT[] NOT NULL
);