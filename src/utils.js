export function decToHex(decimal){
  const hex = decimal.toString(16);
  if(hex.length > 4){
    return hex.substr(0, 4);
  } else if(hex.length < 4) {
    return Array(4 - hex.length).fill('0').join('') + hex;
  }
  return hex;
}

export function hexFixed(hex){
  if(hex.length > 4){
    return hex.substr(0, 4);
  } else if(hex.length < 4) {
    return Array(4 - hex.length).fill('0').join('') + hex;
  }
  return hex;
}

export function replaceChar(origString, replaceChar, index){
  let firstPart = origString.substr(0, index);
  let lastPart = origString.substr(index + 1);

  let newString = firstPart + replaceChar + lastPart;
  return newString;
}

export function hexToDec(hexadecimal){
  return parseInt(hexadecimal, 16);
}

export function getWord(memory, pagination, PC){
  const row = parseInt(PC.substr(0, 2), 16);
  const column = parseInt(PC.substr(2, 2), 16);
  return memory[pagination[row]][column];
}

export function getBlock(memory, pagination, PC){
  const row = parseInt(PC.substr(0, 2), 16);
  return memory[pagination[row]];
}

export function getNextVMPC(PC){
  let row = parseInt(PC.substr(0, 2), 16);
  let column = parseInt(PC.substr(2, 2), 16);
  if(column >= 15){
    ++row;
    column = 0;
  } else {
    column++;
  }
  row = row.toString(16);
  column = column.toString(16);
  row = row.length === 2 ? row : Array(2 - row.length).fill('0') + row;
  column = column.length === 2 ? column : Array(2 - column.length).fill('0') + column;
  return row + column;
}

export function getNextPC(pagination, PC){
  let row = parseInt(PC.substr(0, 2), 16);
  let column = parseInt(PC.substr(2, 2), 16);
  if(column >= 15){
    ++row;
    column = 0;
  } else {
    column++;
  }
  row = pagination[row];
  row = row.toString(16);
  column = column.toString(16);
  row = row.length === 3 ? row : Array(3 - row.length).fill('0') + row;
  return row + column;
}
