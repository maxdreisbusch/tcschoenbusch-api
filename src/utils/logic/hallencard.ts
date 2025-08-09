export const createHallencardCode = () => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 15) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    if (counter === 4 || counter === 9) result += "-";
    counter++;
  }
  return result;
};

export const createHallencardPin = () => Math.floor(100000 + Math.random() * 900000);
