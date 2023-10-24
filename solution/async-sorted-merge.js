'use strict';

const LogMinHeap = require('../lib/log-min-heap');

// Print all entries, across all of the *async* sources, in chronological order.

/**
 * Asynchronously yields chronological log entries from each log source
 */
async function* generateLogEntries(logSource, sourceIndex) {
  while (!logSource.drained) {
    const logEntry = await logSource.popAsync();

    if (!logSource.drained) {
      yield { logEntry, sourceIndex };
    }
  }
}

module.exports = async (logSources, printer) => {
  const logMinHeap = new LogMinHeap();

  // Get generator for each log source
  const logEntryGenerators = logSources.map((logSource, index) =>
    generateLogEntries(logSource, index)
  );

  // Get the earliest entry from each log entry generator.
  const earliestLogEntries = await Promise.all(
    logEntryGenerators.map((entryGenerator) => entryGenerator.next())
  );

  earliestLogEntries.forEach((generatedEntry) => {
    // Load the earliest entry from each log source into the min-heap.
    if (!generatedEntry.done) {
      logMinHeap.insert({
        entry: generatedEntry.value.logEntry,
        sourceIndex: generatedEntry.value.sourceIndex,
      });
    }
  });

  while (!logMinHeap.isEmpty()) {
    // Print the next earliest log entry.
    const { entry, sourceIndex } = logMinHeap.getEarliestLogEntry();
    printer.print(entry);

    /*
    Adds the next consecutive log entry from same log source.
    Maintains efficiency by preventing the log entry min-heap from becoming too large.
    */
    const nextGeneratedEntry = await logEntryGenerators[sourceIndex].next();
    if (!nextGeneratedEntry.done) {
      logMinHeap.insert({
        entry: nextGeneratedEntry.value.logEntry,
        sourceIndex: nextGeneratedEntry.value.sourceIndex,
      });
    }
  }

  printer.done();

  return console.log('Async sort complete.');
};
