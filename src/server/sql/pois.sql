CREATE TABLE IF NOT EXISTS "pois" (
	"uid" BIGSERIAL PRIMARY KEY NOT NULL,
	"id" BIGINT UNIQUE NOT NULL,
	"metadata" json NOT NULL
);