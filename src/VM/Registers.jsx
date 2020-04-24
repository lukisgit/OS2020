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
    { name: 'PC', value: memory.VM_PC },
    { name: 'R1', value: memory.R1 },
    { name: 'R2', value: memory.R2 },
    { name: 'C', value: memory.C },
  ];

  return (
    <Flex flexDirection={'column'} alignItems={'center'} style={{ padding: '10px', border: '1px solid grey', borderRadius: '5px' }}>
      <Box my={'10px'}>Virtualus procesorius</Box>
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
