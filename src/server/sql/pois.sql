CREATE TABLE IF NOT EXISTS "pois" (
	"uid" BIGSERIAL PRIMARY KEY NOT NULL,
	"poi" poi UNIQUE NOT NULL,
	"metadata" json NOT NULL
);
CREATE INDEX IF NOT EXISTS "pois-id-element" ON "pois" USING btree (((poi).id), ((poi).element));