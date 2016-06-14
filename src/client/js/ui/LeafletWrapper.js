/**
* Since `Leaflet.awesome-markers` is written in an extremely dirty way, we had to modify it and wrap it here. Basically, the problem was that it relied on globals and knows nothing about modules. There also were some obvious code smells that we fixed. The purpose of this file is to export a leaflet object that includes `AwesomeMarkers`.
*/
import L from "leaflet";
L.AwesomeMarkers = {};
L.AwesomeMarkers.Icon = L.Icon.extend({
	options: {
		iconSize: [35, 45],
		iconAnchor: [17, 42],
		popupAnchor: [1, -32],
		shadowAnchor: [10, 12],
		shadowSize: [36, 16],
		className: "awesome-marker",
		prefix: "glyphicon",
		spinClass: "fa-spin",
		extraClasses: "",
		icon: "home",
		markerColor: "blue",
		iconColor: "white"
	},
	initialize(options) {
		this.options = L.Util.setOptions(this, options);
	},
	createIcon() {
		const div = document.createElement("div");
		if (this.options.icon) {
			div.innerHTML = this.createInner();
		}
		if (this.options.bgPos) {
			div.style.backgroundPosition = `${-this.options.bgPos.x} px ${-this.options.bgPos.y} px`;
		}
		this.setIconStyles(div, `icon-${this.options.markerColor}`);
		return div;
	},
	createInner() {
		let iconClass;
		let iconSpinClass = "";
		let iconColorClass = "";
		let iconColorStyle = "";
		const options = this.options;
		if (options.icon.slice(0, options.prefix.length + 1) === `${options.prefix}-`) {
			iconClass = options.icon;
		}
		else {
			iconClass = `${options.prefix}-${options.icon}`;
		}
		if (options.spin && typeof options.spinClass === "string") {
			iconSpinClass = options.spinClass;
		}
		if (options.iconColor) {
			if (options.iconColor === "white" || options.iconColor === "black") {
				iconColorClass = `icon-${options.iconColor}`;
			}
			else {
				iconColorStyle = `style="color: ${options.iconColor}"`;
			}
		}
		return `<i ${iconColorStyle} class="${options.extraClasses} ${options.prefix} ${iconClass} ${iconSpinClass} ${iconColorClass}"/>`;
	},
	setIconStyles(img, name) {
		const options = this.options;
		const size = L.point(options[name === "shadow" ? "shadowSize" : "iconSize"]);
		let anchor;
		if (name === "shadow") {
			anchor = L.point(options.shadowAnchor || options.iconAnchor);
		}
		else {
			anchor = L.point(options.iconAnchor);
		}
		if (!anchor && size) {
			anchor = size.divideBy(2, true);
		}
		img.className = `awesome-marker-${name} ${options.className}`;
		if (anchor) {
			img.style.marginLeft = `${-anchor.x}px`;
			img.style.marginTop = `${-anchor.y}px`;
		}
		if (size) {
			img.style.width = `${size.x}px`;
			img.style.height = `${size.y}px`;
		}
	},
	createShadow() {
		const div = document.createElement("div");
		this.setIconStyles(div, "shadow");
		return div;
	}
});
L.AwesomeMarkers.icon = options => {
	return new L.AwesomeMarkers.Icon(options);
};
export default L;