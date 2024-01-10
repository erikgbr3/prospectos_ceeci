const pastelColors = [
    
    "#ff6961",
    "#77dd77",
    "#FFD700",
    "#84b6f4",
    "#ba9df4",
    "#F7CAC9",
    "#a3ffac",
    "#FAD7A0",
  ];
  
  let currentIndex = 0;
  
  const getNextColor = () => {
    const color = pastelColors[currentIndex];
    currentIndex = (currentIndex + 1) % pastelColors.length;
    return color;
  };
  
  export { pastelColors, getNextColor };
  