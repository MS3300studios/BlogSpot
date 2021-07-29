const db = require("../db");

const participantSchema = new db.Schema({
    name: {type: String, require: true},
    userId: {type: String, require: true}
}, {timestamps: true});

const schema = new db.Schema({
    name: {type: String, require: true},
    participants: [participantSchema]
  },
  {
    timestamps: true
  });

const Conversation = db.model("Conversation", schema);
const Participant = db.model("Participant", participantSchema);

module.exports = {
  Conversation: Conversation,
  Participant: Participant
}

