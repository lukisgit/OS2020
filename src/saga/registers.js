import {fork, takeLatest} from "@redux-saga/core/effects";

function* watchSetRegister() {
  yield takeLatest('SET_REGISTER', () => {
  });
}

const RegistersSaga = [
  fork(watchSetRegister),
];

export default RegistersSaga;
