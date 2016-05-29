import "babel-polyfill";
import "source-map-support/register";
import { err } from "./util";
import "./index";
for (const event of ["unhandledRejection", "uncaughtException"]) {
	process.on(event, error => {
		err(error);
	});
}