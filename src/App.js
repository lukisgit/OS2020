import React, {useEffect} from 'react';
import { Flex } from '@rebass/grid';
import Controls from './shared/Controls';
import SharedMemory from './shared/Memory';
import {makeStore, sagaMiddleware} from "./store";
import rootSaga from "./saga";
import {Provider} from "react-redux";

// Virtual machine

import VMRegisters from './VM/Registers';
import VMMemory from './VM/Memory';

// Real machine

import RMRegisters from './RM/Registers';
import RMMemory from './RM/Memory';

const store = makeStore();

function App() {

  useEffect(() => {
    sagaMiddleware.run(rootSaga);
  }, []);

  return (
    <Provider store={store}>
      <div className="App" style={{ padding: '30px' }}>
        <Flex style={{ boxSizing: 'border-box' }}>
          <Flex flexDirection={'column'} width={'25%'} style={{ marginRight: '15px' }}>
            <RMRegisters />
            <VMRegisters />
            <Controls />
          </Flex>
          <Flex flexDirection={'column'} width={'75%'} style={{ marginLeft: '15px' }}>
            <RMMemory />
            <VMMemory />
            <SharedMemory />
          </Flex>
        </Flex>
      </div>
    </Provider>
  );
}

export default App;
