export const handleFormatMoney = (money) => {
  const convertString = money + '';
  const value = '' + convertString?.replaceAll('.', '');
  const format = value?.replace(/\B(?=(\d{3})+(?!\d))/g, '.') || '';
  return format;
};
