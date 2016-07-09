import test from "ava";
test.serial(async t => {
	global.capitalize = (await System.import("client/util")).capitalize;
});
test("first letter is capitalized", t => {
	t.is(capitalize("hello"), "Hello");
});
test("first symbol remains unchanged", t => {
	t.is(capitalize("·ello"), "·ello");
});