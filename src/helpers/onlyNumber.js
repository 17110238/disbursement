export const onlyNumber = (event) => {
  const keyCode = event.keyCode || event.which;
  const keyValue = String.fromCharCode(keyCode);
  if (!/[0-9]/.test(keyValue)) event.preventDefault();
};
