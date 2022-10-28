const generateMD5 = () => {
  return Array.from({ length: 6 }, () => {
    return (new Date().getTime() * Math.random()).toString(16).replace(/[.]/g, "").slice(-4);
  }).join("");
};

module.exports = generateMD5;
