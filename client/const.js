export const URL_REGEX = new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);
export const ERROR = {
  UNEXISTING_COMMAND: -1,
  INVALID_ADDRESS: -2,
};
export const ERROR_MSG = {
  UNEXISTING_COMMAND: "error: unexisting command",
  INVALID_ADDRESS: "error: invalid address",
};
const MIN = 1000*60;
export const ATTACK_TIMEOUT_MS =  10;

export const DOS_HTTP_REQ_COUNT = 100;

export const DOS_PING_FLOOD_REQ_COUNT = 10;

export const SIGKILL = 9;
