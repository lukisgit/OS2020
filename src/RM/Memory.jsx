import React, {useEffect, useState} from 'react';
import { Flex, Box } from '@rebass/grid';
import styled from 'styled-components';
import {useSelector} from "react-redux";

const Table = styled.table`
  td, th {
    border: 1px solid grey;
    padding: 3px 10px;
    border-radius: 6px;
    max-height: 300px;
    overflow-y: auto;
  }
`;

const Memory = () => {

  const blocks = useSelector(state => state.memory.memory);

  return (
    <Flex flexDirection={'column'} alignItems={'center'} style={{ padding: '10px', border: '1px solid grey', borderRadius: '5px' }} mb={'15px'}>
      <Box my={'10px'}>Reali atmintis</Box>
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
                      block.map((word, j) => <td key={j}>{word.toUpperCase()}</td>)
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
