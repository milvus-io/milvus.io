const etcdBaseValue = {
  cpu: 0,
  memory: 0,
  pvc: 0,
  count: 0,
};
const minioBaseValue = {
  cpu: 0,
  memory: 0,
  pvc: 0,
  count: 0,
};
const pulsarBaseValue = {
  bookie: {
    cpu: 0,
    memory: 0,
    count: 0,
    journal: 0,
    ledgers: 0,
  },
  broker: {
    cpu: 0,
    memory: 0,
    count: 0,
  },
  proxy: {
    cpu: 0,
    memory: 0,
    count: 0,
  },
  zookeeper: {
    cpu: 0,
    memory: 0,
    count: 0,
    pvc: 0,
  },
};
const kafkaBaseValue = {
  broker: {
    cpu: 0,
    memory: 0,
    count: 0,
    pvc: 0,
  },
  zookeeper: {
    cpu: 0,
    memory: 0,
    count: 0,
    pvc: 0,
  },
};

export const baseValues = {
  etcdBaseValue,
  minioBaseValue,
  pulsarBaseValue,
  kafkaBaseValue,
};
