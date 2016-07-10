import test from "ava";
let cache;
test.serial(async t => {
	cache = (await System.import("client/cache")).default;
	t.pass();
});
test(`the uninitialized cache doesn't have a "data" property`, t => {
	t.false(localStorage.hasOwnProperty("data"));
});
test(`once initialized, the cache has a "data" property`, t => {
	cache.create();
	t.true(localStorage.hasOwnProperty("data"));
});
test(`values of arbitrary type can be saved in and loaded from the cache`, t => {
	cache.save("number", 3);
	cache.save("string", "hello");
	const object = {
		a: 4,
		b: "map-game"
	};
	cache.save("object", object);
	t.is(cache.load("number"), 3);
	t.is(cache.load("string"), "hello");
	t.deepEqual(cache.load("object"), object);
});
test(`the cache can be queried for property existence`, t => {
	cache.save("number", 3);
	t.true(cache.has("number"));
});
test(`removed properties are deleted from the cache`, t => {
	const key = "meow";
	cache.save(key, 3);
	t.true(cache.has(key));
	cache.remove(key);
	t.false(cache.has(key));
});