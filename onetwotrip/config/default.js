module.exports = {
  redis: {
    connection: {
      host: '',
      port: 26379,
      connect_timeout: 3600000,
    },
    channels: {
      LEADER_ELECTION_CHANNEL: 'LEADER_ELECTION',
    },
    lists: {
      errors: 'errors',
      messages: 'messages',
    },
    keys: {
      GENERATOR_STATUS: 'GENERATOR_STATUS',
    },
  },
  timeouts: {
    generate_message: 500,
    set_generator_status: 3000,
    interval_check_status: 5000,
    wait_alive_response: 7500,
    wait_election_complete: 10000,
  },
  messageTypes: {
    REQUEST: 'REQUEST',
    RESPONSE: 'RESPONSE',
    ELECTION_COMPLETE: 'ELECTION_COMPLETE',
  },
};
