export function tcp2ws(address) {
  const addr = address.match(/([0-9]{1,3}\.){3}[0-9]{1,3}/)[0];
  const port = Number(address.match(/[0-9]{1,6}$/)[0]);

  return addr + ':' + (port + 1);
}