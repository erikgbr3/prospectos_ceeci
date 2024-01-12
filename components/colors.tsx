const pastelColors = [
  "#a0c9c7",
  ];
  
  let currentIndex = 0;
  
  const getNextColor = () => {
    const color = pastelColors[currentIndex];
    currentIndex = (currentIndex + 1) % pastelColors.length;
    return color;
  };
  
  export { pastelColors, getNextColor };
  