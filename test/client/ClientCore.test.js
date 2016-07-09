import test from "ava";
test.serial(async t => {
	await System.import("client/ClientCore");
});
test.todo("test this module");