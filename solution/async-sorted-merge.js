'use strict';

const LogMinHeap = require('../lib/log-min-heap');

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = async (logSources, printer) => {
  const logMinHeap = new LogMinHeap();

  /* 
  Defines the maximum size of the min-heap. 
  The logic automatically assumes a minimum of the number of logSources.
  Maintains efficiency by preventing the log entry min-heap from becoming too large.
  */
  const MAX_HEAP_SIZE = 1000000; // Adjust this value as needed.

  // Pop and add log entry the min-heap.
  const popLogEntriesAsync = async (logSource, sourceIndex) => {
    while (!logSource.drained) {
      const nextLogEntry = await logSource.popAsync();

      if (!logSource.drained) {
        logMinHeap.insert({ entry: nextLogEntry, sourceIndex });

        // Max size must be larger than the number of log sources.
        if (logMinHeap.size() > MAX_HEAP_SIZE) {
          return;
        }
      }
    }
  };

  /*
  Add log entries from each logSource to min-heap until max size is reached. 
  Ensures at least earliest entry from each log source is added.
  */
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
