import Fingerprint from "fingerprintjs2";
export default () => {
	return new Promise((resolve, reject) => {
		new Fingerprint().get((result, fp) => {
			console.log(result, fp);
			resolve(result, fp);
		});
	});
};