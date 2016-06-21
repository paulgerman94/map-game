import dispatcher from "../Dispatcher";
import { EventEmitter } from "crystal-event-emitter";
/**
* This class is a flux store that keeps a global view of entire component states so that players can navigate between them.
*/
class StateStore extends EventEmitter {
}
const stateStore = new StateStore();
dispatcher.register(::stateStore.handleActions);
export default stateStore;