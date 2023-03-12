import Cookies from 'js-cookie';

export function setCookie(name, value) {
  if (name) {
    return Cookies.set(name, JSON.stringify(value));
  }
  return;
}

export function getCookie(name) {
  try {
    const token = Cookies.get(name);
    if (!token) {
      return (token = null);
    }
    return JSON.parse(token);
  } catch (err) {
    return null;
  }
}

export function removeCookie(name) {
  if (name) {
    return Cookies.remove(name);
  }
  return;
}
