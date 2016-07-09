import test from "ava";
test.serial(async t => {
	await System.import("client/api/index");
});
test.todo("test this module");