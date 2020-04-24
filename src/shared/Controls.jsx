import React, {useRef, useState} from 'react';
import { Flex, Box } from '@rebass/grid';
import styled from 'styled-components';
import {useDispatch, useSelector} from "react-redux";
import {decToHex, getBlock, getNextPC, getNextVMPC, getWord, hexToDec, replaceChar} from "../utils";

const Button = styled.button`
  padding: 5px 20px;
  background: rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: 5px;
  margin: 50px 10px 25px 10px;
  cursor: pointer;
  transition: all .25s;
  
  &:hover {
    opacity: 0.75;
  }
`;

const Input = styled.input`
  display: none;
`;

const Label = styled.label`
  background: rgba(0,0,0,0.25);
  border-radius: 5px;
  padding: 5px 20px;
  transition: all .25s;
  cursor: pointer;
  
  &:hover {
    opacity: 0.75;
  }
`;

const Command = styled.div`
  display: block;
  width: 50%;
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: 5px;
  padding: 5px 10px;
  
  &:first-child {
    margin-right: 5px;
  }
  
  &:last-child {
    margin-left: 5px;
  }
`;

const IO = styled.div`
  display: block;
  width: 100%;
  height: auto;
  padding: 15px;
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: 5px;
`;

const Controls = () => {

  const fileRef = useRef(null);

  const memory = useSelector(state => state.memory);

  const dispatch = useDispatch();

  const [currentCommand, setCurrentCommand] = useState('-');
  const [previousCommand, setPreviousCommand] = useState('-');

  const onHandlingFile = () => {
    const reader = new FileReader();
    reader.readAsText(fileRef.current.files[0]);
    reader.onloadend = (e) => {
      const data = e.target.result.split('\n');
      if(data[data.length - 1] === ""){
        data.pop();
      }
      const isValidFileFormat = data[0] === "$BDY" && data[data.length - 1] === "$END";
      if(!isValidFileFormat){
        data.shift();
        data.pop();
        dispatch({ type: 'START_VM', payload: { data }});
        console.log(data);
        window.alert('VM programa sėkmingai užkrauta!');
      } else {
        window.alert('Blogas failo formatas!');
        console.log(data);
      }
    };
  };

  const getInput = () => {
    return memory.input.join(', ');
  };

  const getOutput = () => {
    return memory.output.join(', ');
  };

  const skipCommandArgument = (VM_PC) => {
    const OLD_VM_PC = VM_PC;
    VM_PC = getNextVMPC(OLD_VM_PC);
    const PC = getNextPC(memory.pagination, OLD_VM_PC);
    dispatch({ type: 'SET_REGISTER', payload: { name: 'VM_PC', data: VM_PC }});
    dispatch({ type: 'SET_REGISTER', payload: { name: 'PC', data: PC }});
  };

  const execCommand = (VM_PC, PC, current) => {
    dispatch({ type: 'SET_REGISTER', payload: { name: 'VM_PC', data: VM_PC }});
    dispatch({ type: 'SET_REGISTER', payload: { name: 'PC', data: PC }});
    setCurrentCommand(current);
  };

  const onRun = () => {
    let current = getWord(memory.memory, memory.pagination, memory.VM_PC);
    let VM_PC = getNextVMPC(memory.VM_PC);
    let PC = getNextPC(memory.pagination, memory.VM_PC);

    dispatch({ type: 'SET_REGISTER', payload: { name: 'SI', data: '0' }});

    if(currentCommand !== '-'){
      setPreviousCommand(currentCommand);
    }

    switch(current.trim()){
      case 'GD': {
        setCurrentCommand(current);
        current = getWord(memory.memory, memory.pagination, VM_PC);
        dispatch({ type: 'SET_REGISTER', payload: { name: 'SI', data: '2' }});
        dispatch({ type: 'SET_MEMORY_BLOCK', payload: { address: current, data: memory.input }});

        skipCommandArgument(VM_PC);
        break;
      }
      case 'PD': {
        setCurrentCommand(current);
        current = getWord(memory.memory, memory.pagination, VM_PC);
        const currentBlock = getBlock(memory.memory, memory.pagination, current);
        dispatch({ type: 'SET_REGISTER', payload: { name: 'SI', data: '1' }});
        dispatch({ type: 'SET_OUTPUT', payload: { output: currentBlock }});

        skipCommandArgument(VM_PC);
        break;
      }
      case 'UNL': {
        setCurrentCommand(current);
        current = getWord(memory.memory, memory.pagination, VM_PC);
        let BSinBinary = parseInt(memory.BS, 16).toString(2).padStart(16, '0');
        current = current.trim();
        const index = current[current.length - 1];
        console.log(BSinBinary);
        BSinBinary = replaceChar(BSinBinary, '0', parseInt(index));
        console.log(BSinBinary);
        const BSinHex = decToHex(parseInt(BSinBinary, 2));
        dispatch({ type: 'SET_REGISTER', payload: { name: 'BS', data: BSinHex }});
        skipCommandArgument(VM_PC);
        break;
      }
      case 'LX': {
        setCurrentCommand(current);

        let BSinBinary = parseInt(memory.BS, 16).toString(2).padStart(16, '0');

        current = getWord(memory.memory, memory.pagination, VM_PC);
        current = current.trim();
        const columnToWrite = current[current.length - 1];
        const addressToWrite = replaceChar(memory.CM, columnToWrite, 3);

        if(BSinBinary[hexToDec(columnToWrite)] === '1'){
          dispatch({ type: 'SET_REGISTER', payload: { name: 'SI', data: '4' }});
        } else {
          dispatch({ type: 'SET_SHARED_MEMORY_CELL', payload: { address: addressToWrite, data: memory.R1 }});
        }

        skipCommandArgument(VM_PC);
        break;
      }
      case 'LY': {
        setCurrentCommand(current);
        current = getWord(memory.memory, memory.pagination, VM_PC);
        current = current.trim();
        const column = current[current.length - 1];
        const result = memory.memory[hexToDec(memory.CM.substr(0, 3))][column];
        dispatch({ type: 'SET_REGISTER', payload: { name: 'R1', data: result }});

        skipCommandArgument(VM_PC);
        break;
      }
      case 'ZX': {
        setCurrentCommand(current);

        let BSinBinary = parseInt(memory.BS, 16).toString(2).padStart(16, '0');

        current = getWord(memory.memory, memory.pagination, VM_PC);
        current = current.trim();
        const columnToWrite = current[current.length - 1];
        const addressToWrite = replaceChar(memory.CM, columnToWrite, 3);

        if(BSinBinary[hexToDec(columnToWrite)] === '1'){
          dispatch({ type: 'SET_REGISTER', payload: { name: 'SI', data: '4' }});
        } else {
          dispatch({ type: 'SET_SHARED_MEMORY_CELL', payload: { address: addressToWrite, data: memory.R2 }});
        }

        skipCommandArgument(VM_PC);
        break;
      }
      case 'ZY': {
        setCurrentCommand(current);
        current = getWord(memory.memory, memory.pagination, VM_PC);
        current = current.trim();
        const column = current[current.length - 1];
        const result = memory.memory[hexToDec(memory.CM.substr(0, 3))][column];
        dispatch({ type: 'SET_REGISTER', payload: { name: 'R2', data: result }});

        skipCommandArgument(VM_PC);
        break;
      }
      case 'LCK': {
        setCurrentCommand(current);
        current = getWord(memory.memory, memory.pagination, VM_PC);
        let BSinBinary = parseInt(memory.BS, 16).toString(2).padStart(16, '0');
        current = current.trim();
        const index = current[current.length - 1];
        console.log(BSinBinary);
        BSinBinary = replaceChar(BSinBinary, '1', parseInt(index));
        console.log(BSinBinary);
        const BSinHex = decToHex(parseInt(BSinBinary, 2));
        dispatch({ type: 'SET_REGISTER', payload: { name: 'BS', data: BSinHex }});
        skipCommandArgument(VM_PC);
        break;
      }
      case 'JZ': {
        setCurrentCommand(current);
        current = getWord(memory.memory, memory.pagination, VM_PC);
        VM_PC = current;
        PC = current;
        dispatch({ type: 'SET_REGISTER', payload: { name: 'VM_PC', data: VM_PC }});
        dispatch({ type: 'SET_REGISTER', payload: { name: 'PC', data: PC }});
        setCurrentCommand(current);
        break;
      }
      case 'JP': {
        setCurrentCommand(current);
        current = getWord(memory.memory, memory.pagination, VM_PC);
        if(memory.C === '1' || memory.C === 1) {
          VM_PC = current;
          PC = current;
          dispatch({type: 'SET_REGISTER', payload: {name: 'VM_PC', data: VM_PC}});
          dispatch({type: 'SET_REGISTER', payload: {name: 'PC', data: PC}});
          setCurrentCommand(current);
        } else {
          skipCommandArgument(VM_PC);
        }
        break;
      }
      case 'WR': {
        setCurrentCommand(current);
        current = getWord(memory.memory, memory.pagination, VM_PC);
        const row = hexToDec(current.substr(0, 2));
        const column = hexToDec(current.substr(2, 2));
        const result = memory.memory[memory.pagination[row]][column];
        dispatch({ type: 'SET_REGISTER', payload: { name: 'R1', data: result }});

        skipCommandArgument(VM_PC);
        break;
      }
      case 'WM': {
        setCurrentCommand(current);
        current = getWord(memory.memory, memory.pagination, VM_PC);
        dispatch({ type: 'SET_MEMORY_CELL', payload: { address: current, data: memory.R1 }});

        skipCommandArgument(VM_PC);
        break;
      }
      case 'LR': {
        setCurrentCommand(current);
        current = getWord(memory.memory, memory.pagination, VM_PC);
        const row = hexToDec(current.substr(0, 2));
        const column = hexToDec(current.substr(2, 2));
        const result = memory.memory[memory.pagination[row]][column];
        dispatch({ type: 'SET_REGISTER', payload: { name: 'R2', data: result }});

        skipCommandArgument(VM_PC);
        break;
      }
      case 'LM': {
        setCurrentCommand(current);
        current = getWord(memory.memory, memory.pagination, VM_PC);
        dispatch({ type: 'SET_MEMORY_CELL', payload: { address: current, data: memory.R2 }});

        skipCommandArgument(VM_PC);
        break;
      }
      case 'ADD': {
        let R1 = hexToDec(memory.R1);
        let R2 = hexToDec(memory.R2);
        R1 = R1 + R2;
        R1 = R1.toString(16);
        R1 = R1.length > 4 ? R1.substr(R1.length - 5, 4) : R1;
        R1 = decToHex(R1);
        dispatch({ type: 'SET_REGISTER', payload: { name: 'R1', data: R1 }});
        execCommand(VM_PC, PC, current);
        break;
      }
      case 'SUB': {
        let R1 = hexToDec(memory.R1);
        let R2 = hexToDec(memory.R2);
        R1 = Math.abs(R1 - R2);
        R1 = R1.toString(16);
        R1 = R1.length > 4 ? R1.substr(R1.length - 5, 4) : R1;
        R1 = decToHex(R1);
        dispatch({ type: 'SET_REGISTER', payload: { name: 'R1', data: R1 }});
        execCommand(VM_PC, PC, current);
        break;
      }
      case 'CMP': {
        let R1 = hexToDec(memory.R1);
        let R2 = hexToDec(memory.R2);
        const result = R1 === R2 ? '1' : '0';
        dispatch({ type: 'SET_REGISTER', payload: { name: 'C', data: result }});
        execCommand(VM_PC, PC, current);
        break;
      }
      case 'HALT': {
        dispatch({ type: 'CLEAR_VM' });
        execCommand(VM_PC, PC, current);
        break;
      }
      default: {
        execCommand(VM_PC, PC, current);
        break;
      }
    }
  };

  return (
    <Flex flexDirection={'column'}>

      <Flex flexDirection={'row'} justifyContent={'center'}>
        <Box>
          <Button style={{background: 'red', color: 'white'}}>Stop</Button>
        </Box>
        <Box>
          <Button style={{background: 'green', color: 'white'}} onClick={onRun}>Run</Button>
        </Box>
        <Box>
          <Button>Reset</Button>
        </Box>
        <Box>
          <Button>Load</Button>
        </Box>
      </Flex>

      <Flex justifyContent={'center'}>
        <Box>
          <Input ref={fileRef} type="file" id={'flash'} onChange={onHandlingFile} />
          <Label htmlFor={'flash'}>Įkelti failą (.txt)</Label>
        </Box>
      </Flex>

      <Flex mt={'50px'} style={{ boxSizing: 'border-box' }}>
        <Command>
          <Box>Buvusi komanda:</Box>
          <Box>{ previousCommand }</Box>
        </Command>
        <Command>
          <Box>Einanti komanda:</Box>
          <Box>{ currentCommand }</Box>
        </Command>
      </Flex>

      <Flex mt={'25px'} style={{ boxSizing: 'border-box' }}>
        <IO>
          <Box>Input:</Box>
          <Box>{ getInput() }</Box>
        </IO>
      </Flex>

      <Flex mt={'25px'} style={{ boxSizing: 'border-box' }}>
        <IO>
          <Box>Output:</Box>
          <Box>{ getOutput() }</Box>
        </IO>
      </Flex>

    </Flex>
  );
};

export default Controls;
