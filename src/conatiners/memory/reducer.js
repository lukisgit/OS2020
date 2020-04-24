import {decToHex, hexToDec} from "../../utils";

const MAX_BLOCKS = 1024;
const MAX_WORDS_PER_BLOCK = 16;

const initialState = {
  memory: Array(MAX_BLOCKS).fill(Array(MAX_WORDS_PER_BLOCK).fill(decToHex(0))),
  pagination: [],
  paginationInHex: [],
  PTR: decToHex(0),
  CM: decToHex(0),
  R1: decToHex(0),
  R2: decToHex(0),
  BS: decToHex(65535),
  SI: '0',
  C: '0',
  PC: decToHex(0),
  VM_PC: decToHex(0),
  input: ['0FEE', '0155', '00E0'],
  output: []
};

function getPagination(PTR, CM){
  const temp = [];
  while(temp.length !== 16){
    const random = Math.floor(Math.random() * MAX_BLOCKS);
    if(temp.indexOf(random) === -1 && random !== PTR && random !== CM){ // avoid PTR
      temp.push(random);
    }
  }
  return temp;
}

function reducer(state = initialState, action){
  switch(action.type){
    case 'START_VM': {

      // Shared memory
      const DEFAULT_CM = 14;
      const CM = '00E0';

      // Virtual machine
      const DEFAULT_PTR = 15;
      const PTR = '00F0';
      const pagination = getPagination(DEFAULT_PTR, DEFAULT_CM);
      const paginationInHex = JSON.parse(JSON.stringify(pagination)).map(item => decToHex(item));

      const memory = JSON.parse(JSON.stringify(state.memory)); // deep copy

      memory[DEFAULT_PTR] = JSON.parse(JSON.stringify(paginationInHex));

      const payload = action.payload.data;

      payload.forEach((item, index) => {
        const row = Math.floor(index / 16);
        const column = ((index + 1) - (row * 16)) - 1;
        memory[pagination[row]][column] = item;
      });

      // Set PTR
      return { ...state,
        PTR,
        CM,
        pagination,
        paginationInHex,
        memory
      };
    }
    case 'SET_MEMORY_BLOCK': {
      const memory = JSON.parse(JSON.stringify(state.memory)); // deep copy
      const payload = action.payload.data;

      const row = hexToDec(action.payload.address[1]); // second byte ....
      payload.forEach((item, index) => {
        memory[state.pagination[row]][index] = item;
      });
      return { ...state, memory };
    }
    case 'SET_OUTPUT': {
      return { ...state, output: action.payload.output };
    }
    case 'SET_MEMORY_CELL': {
      const memory = JSON.parse(JSON.stringify(state.memory)); // deep copy

      const row = parseInt(action.payload.address.substr(0, 2), 16);
      const column = parseInt(action.payload.address.substr(2, 2), 16);
      memory[state.pagination[row]][column] = action.payload.data;
      return { ...state, memory };
    }
    case 'SET_SHARED_MEMORY_CELL': {
      const memory = JSON.parse(JSON.stringify(state.memory)); // deep copy
      const row = parseInt(action.payload.address.substr(0, 3), 16);
      const column = parseInt(action.payload.address.substr(3, 1), 16);
      memory[row][column] = action.payload.data;
      return { ...state, memory };
    }
    case 'SET_REGISTER': {
      return { ...state, [action.payload.name]: action.payload.data };
    }
    case 'CLEAR_VM': {
      return {
        ...state,
        SI: '3',
        PC: decToHex(0),
        VM_PC: decToHex(0),
        R1: decToHex(0),
        R2: decToHex(0),
        C: '0'
      };
    }
    default: {
      return state;
    }
  }
}

export default reducer;
