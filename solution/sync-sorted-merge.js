'use strict';

const LogMinHeap = require('../lib/log-min-heap');

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  const logMinHeap = new LogMinHeap();

  // Pop and add log entry the min-heap.
  const popLogEntry = (logSource, sourceIndex) => {
    const nextLogEntry = logSource.pop();

    if (!logSource.drained) {
      logMinHeap.insert({ entry: nextLogEntry, sourceIndex });
    }
  };

  // Add earliest log entry from each logSource to min-heap.
  logSources.map((logSource, index) => popLogEntry(logSource, index));

  while (!logMinHeap.isEmpty()) {
    // Print next earlist log entry.
    const { entry, sourceIndex } = logMinHeap.getEarliestLogEntry();
    printer.print(entry);

    // Adds next consecutive log entry from same logSource.
    // Maintains efficiency by preventing the log entry min-heap from becoming too large.
    popLogEntry(logSources[sourceIndex], sourceIndex);
  }

  printer.done();

  return console.log('Sync sort complete.');
};
