CREATE TABLE IF NOT EXISTS "pois" (
	"uid" BIGSERIAL PRIMARY KEY NOT NULL,
	"poi" poi UNIQUE NOT NULL,
	"owner" TEXT,
	"captured_at" TIMESTAMP WITH TIME ZONE,
	"metadata" json NOT NULL
);
CREATE INDEX IF NOT EXISTS "pois-id-element" ON "pois" USING btree (((poi).id), ((poi).element));