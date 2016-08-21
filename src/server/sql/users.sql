CREATE TABLE IF NOT EXISTS users (
	"uid" SERIAL PRIMARY KEY NOT NULL,
	"account_name" TEXT NOT NULL UNIQUE,
	"display_name" TEXT NOT NULL UNIQUE,
	"email" TEXT NOT NULL UNIQUE,
	"hash" TEXT NOT NULL,
	"team" team NOT NULL,
	"score" INT NOT NULL DEFAULT 0,
	"telegram_chat_id" TEXT UNIQUE,
	"webpush_subscription" TEXT UNIQUE
);