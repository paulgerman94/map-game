import { Dispatcher } from "flux";
const dispatcher = new Dispatcher();
export default dispatcher;
/**
* Publishes an event via a `flux` dispatcher
* @param {symbol} type
* 	A type that indicates which kind of event has occurred
* @param {object} [payload={}]
* 	A payload that will be provided alongside the event
*/
export function publish(type, payload = {}) {
	const event = {
		type
	};
	Object.assign(event, payload);
	dispatcher.dispatch(event);
}