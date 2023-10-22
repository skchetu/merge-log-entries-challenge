'use strict';

const { first } = require('lodash');
const MinHeap = require('../lib/log-min-heap');

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  const minHeap = new MinHeap();

  const popLogEntry = (logSource, sourceIndex) => {
    const nextLogEntry = logSource.pop();

    if (!logSource.drained) {
      minHeap.insert({ entry: nextLogEntry, sourceIndex });
    }
  };

  logSources.map((logSource, index) => popLogEntry(logSource, index));

  while (!minHeap.isEmpty()) {
    const { entry, sourceIndex } = minHeap.getEarliestLogEntry();

    printer.print(entry);

    popLogEntry(logSources[sourceIndex], sourceIndex);
  }

  printer.done();

  return console.log('Sync sort complete.');
};
