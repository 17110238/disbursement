const convertTextVNToEN = (str) => {
  if (str) {
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    str = str.replace(/[đ]/g, 'd');
    str = str.replace(/[Đ]/g, 'D');
    str = str.replace(/(\s+)/g, ' ');
    str = str.replace(/-+/g, '-');
  }

  return str;
};
export default convertTextVNToEN;
