const mongoose = require('mongoose');
const hlGenerator = require('../../util/HyperMediaLinksGenerator');

const scheduleSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  _Owner: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  holiday: { type: Boolean, default: false },
  weekend: { type: Boolean, default: false },
  links: {
    type: [{
      _id: false,
      rel: String,
      type: { type: String, enum: ['GET', 'POST', 'PATCH', 'DELETE'] },
      href: String,
      description: String,
    }],
    default: [],
  },
});

scheduleSchema.method('setupHyperLinks', function setupHL(hostName, url) {
  {
    const hateaosEndpoints = [
      {
        rel: 'owner',
        type: 'GET',
        description: 'view this schedules owner',
      },
      {
        rel: 'self',
        type: 'GET',
        description: 'view this schedule',
      },
      {
        rel: 'self',
        type: 'PATCH',
        description: 'update this schedule',
      },
      {
        rel: 'self',
        type: 'DELETE',
        description: 'delete this schedulee',
      },
    ];
    hlGenerator(this, hostName, url, hateaosEndpoints);
  }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
