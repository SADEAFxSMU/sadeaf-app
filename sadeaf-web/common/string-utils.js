export const StringUtils = {
  toTitleCase(word) {
    return word.split(' ')
      .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
      .join(' ');
  },
};
