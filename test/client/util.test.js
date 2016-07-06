import test from "ava";
import { capitalize } from "client/util";
test("first letter is capitalized", t => {
	t.is(capitalize("hello"), "Hello");
});
test("first symbol remains unchanged", t => {
	t.is(capitalize("·ello"), "·ello");
});