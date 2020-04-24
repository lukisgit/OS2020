import RegistersSaga from "./registers";
import {all} from "@redux-saga/core/effects";

export default function* rootSaga() {
  // Run in parallel
  yield all([
    ...RegistersSaga
  ]);
}
