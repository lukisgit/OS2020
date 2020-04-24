import React from 'react';
import { Flex, Box } from '@rebass/grid';
import styled from 'styled-components';
import {useSelector} from "react-redux";

const Table = styled.table`
  td {
    border: 1px solid grey;
    padding: 3px 10px;
    border-radius: 6px;
  }
`;

const Registers = () => {

  const memory = useSelector(state => state.memory);

  const registers = [
    { name: 'PTR', value: memory.PTR },
    { name: 'PC', value: memory.PC },
    { name: 'R1', value: memory.R1 },
    { name: 'R2', value: memory.R2 },
    { name: 'CM', value: memory.CM },
    { name: 'BS', value: memory.BS },
    { name: 'S', value: '0' },
    { name: 'SI', value: memory.SI },
    { name: 'PI', value: '0' },
    { name: 'TI', value: '0' },
    { name: 'C', value: memory.C },
    { name: 'MODE', value: '0' },
  ];

  return (
    <Flex flexDirection={'column'} alignItems={'center'} style={{ padding: '10px', border: '1px solid grey', borderRadius: '5px' }} mb={'15px'}>
      <Box my={'10px'}>Centrinis procesorius</Box>
      <Box>
      <Table>
        <tbody>
        {
          registers.map((reg, i) => <tr key={i}>
            <td>{reg.name}</td>
            <td>{reg.value.toUpperCase()}</td>
          </tr>)
        }
        </tbody>
      </Table>
      </Box>
    </Flex>
  );
};

export default Registers;
