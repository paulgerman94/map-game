import { Dispatcher } from "flux";
const dispatcher = new Dispatcher();
export default dispatcher;
export function publish(action, content = {}) {
	const event = {
		type: action
	};
	Object.assign(event, content);
	dispatcher.dispatch(event);
}