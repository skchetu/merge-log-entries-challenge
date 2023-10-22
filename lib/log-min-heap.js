'use strict';

module.exports = class LogMinHeap {
  constructor() {
    this.sourceEntryHeap = [];
  }

  // Check if the heap is empty.
  isEmpty() {
    return this.sourceEntryHeap.length === 0;
  }

  // Add a sourceEntry to the heap.
  insert({ entry, sourceIndex }) {
    this.sourceEntryHeap.push({ entry, sourceIndex });
    this.heapifyUp();
  }

  // Return the earliest entry and remove from the heap.
  getEarliestLogEntry() {
    if (this.isEmpty()) {
      return null;
    }

    const earliestEntry = this.sourceEntryHeap[0];
    const lastEntry = this.sourceEntryHeap.pop();

    if (!this.isEmpty()) {
      this.sourceEntryHeap[0] = lastEntry;
      this.heapifyDown();
    }
    return earliestEntry;
  }

  // Restore the min-heap property by moving an element up.
  heapifyUp() {
    let index = this.sourceEntryHeap.length - 1;

    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parentEntry = this.sourceEntryHeap[parentIndex];
      const currentEntry = this.sourceEntryHeap[index];

      if (currentEntry.entry.date >= parentEntry.entry.date) {
        break;
      }

      // Switch with parent entry
      this.sourceEntryHeap[index] = parentEntry;
      this.sourceEntryHeap[parentIndex] = currentEntry;

      index = parentIndex;
    }
  }

  // Restore the min-heap property by moving an element down.
  heapifyDown() {
    const heapLength = this.sourceEntryHeap.length;
    let index = 0;
    let earliestEntryIndex = index;
    let minHeapMaintained = false;

    while (!minHeapMaintained) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      minHeapMaintained = true;

      if (
        leftChildIndex < heapLength &&
        this.sourceEntryHeap[leftChildIndex].entry.date <
          this.sourceEntryHeap[earliestEntryIndex].entry.date
      ) {
        earliestEntryIndex = leftChildIndex;
        minHeapMaintained = false;
      }

      if (
        rightChildIndex < heapLength &&
        this.sourceEntryHeap[rightChildIndex].entry.date <
          this.sourceEntryHeap[earliestEntryIndex].entry.date
      ) {
        earliestEntryIndex = rightChildIndex;
        minHeapMaintained = false;
      }

      if (earliestEntryIndex !== index) {
        let tempEntry = this.sourceEntryHeap[index];
        this.sourceEntryHeap[index] = this.sourceEntryHeap[earliestEntryIndex];
        this.sourceEntryHeap[earliestEntryIndex] = tempEntry;
        // sawp

        index = earliestEntryIndex;
      }
    }
  }
};
