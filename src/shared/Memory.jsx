import React, {useEffect, useState} from 'react';
import { Flex, Box } from '@rebass/grid';
import styled from 'styled-components';
import {useSelector} from "react-redux";
import {hexToDec} from "../utils";

const Table = styled.table`
  td, th {
    border: 1px solid grey;
    padding: 3px 10px;
    border-radius: 6px;
    max-height: 300px;
    overflow-y: auto;
  }
`;

const MAX_BLOCKS = 1;
const MAX_WORDS_PER_BLOCK = 16;

const Memory = () => {

  const memory = useSelector(state => state.memory);

  const [blocks, updateBlocks] = useState([]);

  useEffect(() => {
    updateBlocks(getSharedMemory(memory.memory, memory.CM.substr(0, 3)));
  }, [memory]);

  const getSharedMemory = (memory, pagination) => {
    return [memory[hexToDec(pagination)]];
  };

  const getStyle = (index) => {
    const BSinBinary = parseInt(memory.BS, 16).toString(2).padStart(16, '0');
    return BSinBinary[index] === '1';
  };

  return (
    <Flex flexDirection={'column'} alignItems={'center'} style={{ padding: '10px', border: '1px solid grey', borderRadius: '5px' }} mb={'15px'}>
      <Box my={'10px'}>Bendroji atmintis</Box>
      <Flex>
        <Box style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <Flex>
            <Box mt={'31px'}>
              <Table>
                <tbody>
                {
                  blocks.map((item, index) => <tr key={index}><th>{ index.toString(16).toUpperCase() }</th></tr>)
                }
                </tbody>
              </Table>
            </Box>
            <Box>
              <Table>
                <thead>
                <tr>
                  {
                    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'].map((label, i) => <th key={i}>{ label }</th>)
                  }
                </tr>
                </thead>
                <tbody>
                {
                  blocks.map((block, i) => <tr key={i}>
                    {
                      block.map((word, j) => <td key={j} style={getStyle(j) ? { background: 'red', color: 'white' } : { background: 'green', color: 'white' }}>{word}</td>)
                    }
                  </tr>)
                }
                </tbody>
              </Table>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Memory;
