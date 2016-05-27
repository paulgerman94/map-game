import Fingerprint from "fingerprintjs2";
export default () => {
	return new Promise(resolve => {
		new Fingerprint().get((result, fp) => {
			console.log(result, fp);
			resolve(result, fp);
		});
	});
};