'use strict';

const MinHeap = require('../lib/log-min-heap');

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = async (logSources, printer) => {
  const minHeap = new MinHeap();

  const popLogEntryAsync = async (logSource, sourceIndex) => {
    const nextLogEntry = await logSource.popAsync();

    if (!logSource.drained) {
      minHeap.insert({ entry: nextLogEntry, sourceIndex });
    }
  };

  await Promise.all(
    logSources.map((logSource, index) => popLogEntryAsync(logSource, index))
  );

  while (!minHeap.isEmpty()) {
    const { entry, sourceIndex } = minHeap.getEarliestLogEntry();

    printer.print(entry);

    await popLogEntryAsync(logSources[sourceIndex], sourceIndex);
  }

  printer.done();

  return console.log('Async sort complete.');
};
