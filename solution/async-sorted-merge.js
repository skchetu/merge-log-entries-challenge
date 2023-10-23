'use strict';

const LogMinHeap = require('../lib/log-min-heap');

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = async (logSources, printer) => {
  const logMinHeap = new LogMinHeap();

  // Define the maximum size of the min-heap.
  const MAX_HEAP_SIZE = 1000; // Adjust this value as needed.

  // Pop and add log entry the min-heap.
  const popLogEntriesAsync = async (logSource, sourceIndex) => {
    while (!logSource.drained) {
      const nextLogEntry = await logSource.popAsync();

      if (!logSource.drained) {
        logMinHeap.insert({ entry: nextLogEntry, sourceIndex });

        // Max size must be larger than the number of log sources.
        if (
          MAX_HEAP_SIZE > logSources.length &&
          logMinHeap.size() > MAX_HEAP_SIZE
        ) {
          return;
        }
      }
    }
  };

  // Add log entries from each logSource to min-heap until max size is reached.
  await Promise.all(
    logSources.map((logSource, index) => popLogEntriesAsync(logSource, index))
  );

  while (!logMinHeap.isEmpty()) {
    // Print next earlist log entry.
    const { entry, sourceIndex } = logMinHeap.getEarliestLogEntry();
    printer.print(entry);

    // Adds log entries from same logSource to min-heap until max is reached.
    await popLogEntriesAsync(logSources[sourceIndex], sourceIndex);
  }

  printer.done();

  return console.log('Async sort complete.');
};
