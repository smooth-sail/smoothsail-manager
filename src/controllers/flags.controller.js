// import EventEmitter from "events";
import Clients from "../models/sse-clients";
import pg from "../db/flags";
import Flag from "../models/flags";

let clients = new Clients();

export const getAllFlags = async (req, res) => {
  let flags;
  try {
    flags = await pg.getAllFlags();
  } catch (err) {
    res.status(500).json({ error: "Internal error occurred." });
  }

  res.status(200).json(flags);
};

export const getFlagById = async (req, res) => {
  const flagId = req.params.id;

  let flag;
  try {
    flag = await pg.getFlag(flagId);
  } catch (err) {
    res.status(500).json({ error: "Internal error occurred." });
  }

  if (!flag) {
    res.status(404).json({ error: `Flag with id ${flagId} does not exist` });
  }

  res.status(200).json(flag);
};

export const createFlag = async (req, res) => {
  try {
    console.log(req.body);
    let newFlag = new Flag(req.body);
    let flag = await pg.createFlag(newFlag);
    res.status(200).json(flag);
    let sseMsg = { type: "new-flag", payload: flag };
    return clients.sendNotificationToAllClients(sseMsg);
  } catch (error) {
    res.status(500).json({ error: "Internal error occurred." });
  }
};

export const deleteFlag = async (req, res) => {
  const flagId = req.params.id;

  let flag;
  try {
    flag = await pg.deleteFlag(flagId);
    if (!flag) {
      res.status(404).json({ error: `Flag with id ${flagId} does not exist.` });
      return;
    }

    res.status(200).json({ message: "Flag successfully deleted." });
    let sseMsg = { type: "deleted-flag", payload: flag };
    return clients.sendNotificationToAllClients(sseMsg);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal error occurred. Could not delete flag." });
  }
};

export const updateFlag = async (req, res) => {
  const flagId = req.params.id;

  let flag;
  try {
    flag = await pg.getFlag(flagId);
  } catch (error) {
    res.status(500).json({ error: "Internal error occurred." });
  }

  if (!flag) {
    res.status(404).json({ error: `Flag with id ${flagId} does not exist.` });
  }

  let newFlag = new Flag(flag);
  newFlag.updateProps(req.body);
  try {
    let updatedFlag = await pg.updateFlag(flagId, newFlag);
    res.status(200).json(updatedFlag);
    let sseMsg = { type: "update", payload: updatedFlag };
    return clients.sendNotificationToAllClients(sseMsg);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal error occurred. Could not update flag." });
  }
};

export const sseNotifications = (req, res) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);

  const clientId = clients.addNewClient(res);

  const connectMsg = `SSE connection established with client id: ${clientId}`;
  console.log(connectMsg);

  let data = `data: ${JSON.stringify({ msg: connectMsg })}\n\n`;
  res.write(data);

  req.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients.closeClient(clientId);
  });
};

// router.get('/status', (req, res) => res.json({clients: clients.length})); // tmp route
