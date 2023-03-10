const { Kafka, logLevel } = require("kafkajs");
const { recurse } = require("../producer/event_queue");
const { insert_destinations } = require("../../services/services");
const kafka = new Kafka({
  enforceRequestTimeout: true,
  clientId: "my-app",
  brokers: ["localhost:9092"],
  connectionTimeout: 25000,
  requestTimeout: 25000,
  logLevel: logLevel.ERROR,
});

const destination_consumer = async () => {
  const consumer = kafka.consumer({
    groupId: "test-group",
  });
  await consumer.connect();
  await consumer.subscribe({ topic: "destination-queue" });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const productData = await JSON.parse(message.value.toString());
      await insert_destinations(
        productData.destinationId,
        productData.destinationName,
      );
      await recurse(productData);
    },
  });
};

module.exports = destination_consumer;
