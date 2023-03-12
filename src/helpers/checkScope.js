const checkScope = (usersScope, scope) => {
  if (usersScope?.length < 0 || scope?.length < 0 || !scope) {
    return false;
  }

  let flag = false;
  scope.map((scope) => {
    let find = usersScope?.find((item) => item === scope);
    if (find) {
      flag = true;
    }
  });

  return flag;
};

export default checkScope;
