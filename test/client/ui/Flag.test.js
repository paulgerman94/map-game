import test from "ava";
let Flag, Restaurant, School, Player;
test.serial(async t => {
	const module = await System.import("client/ui/Flag");
	Flag = module.default;
	Restaurant = module.Restaurant;
	School = module.School;
	Player = module.Player;
	t.pass();
});
const nodeDescriptor = {
	metadata: {
		id: 1337,
		tags: {
			name: "Awesome Foods",
			amenity: "restaurant"
		},
		type: "node",
		lat: 45,
		lon: 40
	},
	team: "blue"
};
const wayDescriptor = {
	metadata: {
		id: 1338,
		tags: {
			name: "University of Technology",
			amenity: "university"
		},
		type: "way",
		center: {
			lat: 46,
			lon: 40.5
		}
	},
	team: null
};
function testFlag({
	className,
	typeName,
	specializedIcon,
	flag,
	t
}) {
	const { specialized } = flag;
	const { icon: iconContainer } = specialized.marker.options;
	const { icon, markerColor } = iconContainer.options;
	t.truthy(specialized, "the specialization of a flag is always defined");
	t.true(specialized instanceof Flag, "the specialization of a flag is always an instance of `Flag`");
	t.true(specialized instanceof className, "the amenity should have determined the flag's class");
	t.true(specialized.icon === specializedIcon, "a flag's class should have determined its icon");
	t.true(specialized.typeName === typeName, "a flag's class should have determined its typeName");
	t.is(flag.latitude, specialized.latitude, "a flag's latitude should be inherited");
	t.is(flag.longitude, specialized.longitude, "a flag's longitude should be inherited");
	t.not(flag.latitude, null, "a flag must have a valid latitude");
	t.not(flag.longitude, null, "a flag must have a valid longitude");
	t.truthy(flag.marker, "a marker must exist");
	t.is(flag.icon, "question", "generic Flag instances have no particular icon");
	t.is(icon, specialized.icon, "a marker must reflect the Flag's icon");
	t.is(markerColor, specialized.team || "purple", "a marker must reflect the Flag's team");
	t.pass();
}
test("nodes are initialized properly", t => testFlag({
	t,
	className: Restaurant,
	flag: new Flag(nodeDescriptor),
	typeName: "restaurant",
	specializedIcon: "cutlery"
}));
test("ways are initialized properly", t => testFlag({
	t,
	className: School,
	flag: new Flag(wayDescriptor),
	typeName: "school",
	specializedIcon: "university"
}));
// test("players are initialized properly", t => testFlag({
// 	t,
// 	className: Player,
// 	flag: new Player({
// 		latitude: 40,
// 		longitude: 50,
// 		user: {
// 			displayName: "Some cool guy"
// 		}
// 	}),
// 	typeName: "player",
// 	specializationIcon: "male"
// }));