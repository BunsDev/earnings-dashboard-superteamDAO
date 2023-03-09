const overflowText = (str: any, limit: number) => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  if (str.length < limit) {
    return str;
  }
  return str.slice(0, limit) + '...';
};

export default overflowText;
