CREATE TABLE IF NOT EXISTS "pois" (
	"uid" BIGSERIAL PRIMARY KEY NOT NULL,
	"poi" poi UNIQUE NOT NULL,
	"owner" TEXT,
	"captured_at" TIMESTAMP WITH TIME ZONE,
	"locked_until" TIMESTAMP WITH TIME ZONE,
	"metadata" json NOT NULL
);
/* Once Travis supports PostgreSQL 9.5, this should be CREATE INDEX IF NOT EXISTS. */
CREATE INDEX "pois-id-element" ON "pois" USING btree (((poi).id), ((poi).element));