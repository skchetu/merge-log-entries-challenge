'use strict';

const MinHeap = require('../lib/log-min-heap');

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = async (logSources, printer) => {
  const minHeap = new MinHeap();

  // Pop and add log entry the min-heap.
  const popLogEntryAsync = async (logSource, sourceIndex) => {
    const nextLogEntry = await logSource.popAsync();

    if (!logSource.drained) {
      minHeap.insert({ entry: nextLogEntry, sourceIndex });
    }
  };

  // Add earliest log entry from each logSource to min-heap.
  await Promise.all(
    logSources.map((logSource, index) => popLogEntryAsync(logSource, index))
  );

  while (!minHeap.isEmpty()) {
    // Print next earlist log entry.
    const { entry, sourceIndex } = minHeap.getEarliestLogEntry();
    printer.print(entry);

    // Adds next consecutive log entry from same logSource.
    // Maintains efficiency by preventing the log entry min-heap from becoming too large.
    await popLogEntryAsync(logSources[sourceIndex], sourceIndex);
  }

  printer.done();

  return console.log('Async sort complete.');
};
