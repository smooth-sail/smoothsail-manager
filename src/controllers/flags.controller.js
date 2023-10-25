import Clients from "../models/sse-clients";
import pg from "../db/flags";
import pgS from "../db/segments";
import Flag from "../models/flags";

let clients = new Clients();

const parseSegmRows = (segments) => {
  let result = [];
  segments.forEach((s) => {
    if (result.length === 0 || result[result.length - 1].s_key !== s.s_key) {
      let newSeg = {
        s_key: s.s_key,
        title: s.title,
        description: s.description,
        rules_operator: s.rules_operator,
        rules: [],
      };

      if (s.r_key) {
        newSeg.rules.push({
          r_key: s.r_key,
          a_key: s.a_key,
          type: s.type,
          operator: s.operator,
          value: s.value,
        });
      }
      result.push(newSeg);
    } else {
      if (s.r_key) {
        result[result.length - 1].rules.push({
          r_key: s.r_key,
          a_key: s.a_key,
          type: s.type,
          operator: s.operator,
          value: s.value,
        });
      }
    }
  });
  return result;
};

export const getAllFlags = async (req, res) => {
  let flags;
  try {
    flags = await pg.getAllFlags();
    flags.forEach((f) => {
      delete f.id;
    });

    res.status(200).json({ payload: flags });
  } catch (err) {
    res.status(500).json({ error: "Internal error occurred." });
  }
};

export const getFlagById = async (req, res) => {
  const flagKey = req.params.f_key;

  let flag;
  try {
    flag = await pg.getFlag(flagKey);
  } catch (err) {
    return res.status(500).json({ error: "Internal error occurred." });
  }

  if (!flag) {
    res.status(404).json({ error: `Flag with id ${flagKey} does not exist` });
  }

  delete flag.id;
  res.status(200).json({ payload: flag });
};

export const createFlag = async (req, res) => {
  let { f_key, title, description } = req.body;
  let newFlag;
  try {
    newFlag = new Flag({ f_key, title, description });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    let existingFlag = await pg.getFlag(f_key);
    if (existingFlag) {
      return res
        .status(400)
        .json({ error: "Flag with the same key already exists." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal error occurred." });
  }

  try {
    let flag = await pg.createFlag(newFlag);
    delete flag.id;

    let sseMsg = { type: "new-flag", payload: flag };
    clients.sendNotificationToAllClients(sseMsg);

    return res.status(200).json({ payload: flag });
  } catch (error) {
    return res.status(500).json({ error: "Internal error occurred." });
  }
};

export const deleteFlag = async (req, res) => {
  const flagKey = req.params.f_key;

  let flag;
  try {
    flag = await pg.deleteFlag(flagKey);
    if (!flag) {
      res
        .status(404)
        .json({ error: `Flag with id ${flagKey} does not exist.` });
      return;
    }

    res.status(200).json({ message: "Flag successfully deleted." });

    delete flag.id;
    let sseMsg = { type: "deleted-flag", payload: flagKey };
    return clients.sendNotificationToAllClients(sseMsg);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal error occurred. Could not delete flag." });
  }
};

export const updateFlag = async (req, res) => {
  const flagKey = req.params.f_key;

  let flag;
  try {
    flag = await pg.getFlag(flagKey);
  } catch (error) {
    res.status(500).json({ error: "Internal error occurred." });
  }

  if (!flag) {
    res.status(404).json({ error: `Flag with key ${flagKey} does not exist.` });
  }

  let newFlag = new Flag(flag);

  try {
    let action = req.body.action;

    if (action === "body update") {
      let { title, description } = req.body.payload;
      newFlag.updateProps({ title, description });
      let updatedFlag = await pg.updateFlagInfo(newFlag);

      delete updatedFlag.id;
      return res.status(200).json(updatedFlag);
    } else if (action === "toggle") {
      let { is_active } = req.body.payload;
      newFlag.updateIsActive(is_active); // when check for is_active type enforced => catch error
      let updatedFlag = await pg.updateIsActive(newFlag);

      delete updatedFlag.id;
      res.status(200).json(updatedFlag);
      let sseMsg = { type: "toggle", payload: updatedFlag };
      return clients.sendNotificationToAllClients(sseMsg);
    } else if (action === "segment add") {
      let { s_key } = req.body.payload;

      let segment;
      let segmentId;
      try {
        let segmentRows = await pgS.getSegment(s_key);
        if (segmentRows[0]) {
          segmentId = segmentRows[0].id;
        }
        segment = parseSegmRows(segmentRows)[0];
      } catch (err) {
        return res.status(500).json({ error: "Internal error occurred." });
      }

      if (!segment) {
        return res
          .status(404)
          .json({ error: `Segment with key '${s_key}' does not exist` });
      }

      await pg.addSegment(newFlag.id, segmentId);
      // update 'last updated' field on the flags table => IMPORTANT - here is where we need to improve
      // the logic - what if second sql statement fails, but the first one not - then data is going
      // to be inconsistent!

      // ADD: uniqness of f_key & s_key combo for flags_segments db
      // and enforce absence of repetion on the backend (here)

      let sseMsg = {
        type: "segment add",
        payload: { f_key: newFlag.f_key, segment: segment },
      };

      clients.sendNotificationToAllClients(sseMsg);
      res.status(200).json({ payload: segment });
    } else if (action === "segment remove") {
      let { s_key } = req.body.payload;

      let segmentId;
      try {
        let segmentRows = await pgS.getSegment(s_key);
        if (segmentRows[0]) {
          segmentId = segmentRows[0].id;
        }
      } catch (err) {
        return res.status(500).json({ error: "Internal error occurred." });
      }

      if (!segmentId) {
        return res
          .status(404)
          .json({ error: `Segment with key '${s_key}' does not exist` });
      }
      await pg.removeSegment(newFlag.id, segmentId);

      let sseMsg = {
        type: "segment remove",
        payload: { f_key: newFlag.id, s_key },
      };
      clients.sendNotificationToAllClients(sseMsg);
      res.status(200).json({ message: "Segment was successfully removed." });
    }
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
