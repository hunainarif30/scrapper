const axios = require("axios");
const config = require("../config/config");
const url = config.get("base_url");
const version = config.get("version");
const destination = config.get("destination");
const event = config.get("event");
const tags = config.get("tags");

async function getAllDestination() {
  const response = await axios({
    method: "get",
    url: url + version + destination,
    headers: config.get("headers"),
  });

  return response.data.data;
}

async function getAllTags() {
  const response = await axios({
    method: "get",
    url: url + tags,
    headers: config.get("headers"),
  });

  return response.data.tags;
}

async function eventInfo(start, destinationId) {
  const response = await axios({
    method: "post",
    url: url + event,
    headers: config.get("headers"),

    data: {
      filtering: {
        destination: destinationId,
      },
      pagination: {
        start: start,
        count: 10,
      },
      currency: "USD",
    },
  });
  return response["data"];
}

module.exports = { getAllDestination, eventInfo, getAllTags };
