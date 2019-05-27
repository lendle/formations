import { createStore, applyMiddleware } from "redux"
import reducer from "./reducer"
import { composeWithDevTools } from "redux-devtools-extension"
import * as storage from "redux-storage"
import createEngine from "redux-storage-engine-localstorage"

const storageReduxer = storage.reducer(reducer)
const engine = createEngine("redux-state")
const middleware = storage.createMiddleware(engine)
const store = createStore(
  storageReduxer,
  composeWithDevTools(applyMiddleware(middleware))
)
const load = storage.createLoader(engine)
// load(store)

export default () => {
  return store
}
