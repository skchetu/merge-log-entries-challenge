'use strict';

/**
 * Store log entries in a min-heap structure.
 */
module.exports = class LogMinHeap {
  constructor() {
    // Initialize array to hold binary tree.
    // The left child and right child of the entry at index i is at index 2i+1 and index 2i+2, respectfully.
    this.sourceEntryHeap = [];
  }

  /**
   * Return the number of entries in the heap.
   */
  size() {
    return this.sourceEntryHeap.length;
  }

  /**
   * Check if the heap is empty.
   */
  isEmpty() {
    return this.sourceEntryHeap.length === 0;
  }

  /**
   * Add a log entry to the heap.
   */
  insert({ entry, sourceIndex }) {
    this.sourceEntryHeap.push({ entry, sourceIndex });
    this.heapifyUp(); // move entry to an appropriate position in heap
  }

  /**
   * Return the earliest entry and remove entry from the heap.
   */
  getEarliestLogEntry() {
    if (this.isEmpty()) {
      return null;
    }

    const earliestEntry = this.sourceEntryHeap[0];
    const lastEntry = this.sourceEntryHeap.pop();

    if (!this.isEmpty()) {
      this.sourceEntryHeap[0] = lastEntry;
      this.heapifyDown(); // restructure tree to maintain min-heap property
    }
    return earliestEntry;
  }

  /**
   * Maintain min-heap property by moving last element up through the tree.
   */
  heapifyUp() {
    let index = this.sourceEntryHeap.length - 1;

    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parentEntry = this.sourceEntryHeap[parentIndex];
      const currentEntry = this.sourceEntryHeap[index];

      if (currentEntry.entry.date >= parentEntry.entry.date) {
        break; // exit loop once min-heap property is maintained
      }

      // Swap with parent entry
      this.sourceEntryHeap[index] = parentEntry;
      this.sourceEntryHeap[parentIndex] = currentEntry;

      index = parentIndex;
    }
  }

  /**
   * Maintain min-heap property by moving top element down through the tree.
   */
  heapifyDown() {
    const heapLength = this.sourceEntryHeap.length;
    let index = 0;
    let earliestEntryIndex = index;
    let minHeapMaintained = false;

    while (!minHeapMaintained) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      minHeapMaintained = true;

      // Check if parent entry occurs earlier than child entries; if not, swap.

      if (
        leftChildIndex < heapLength &&
        this.sourceEntryHeap[leftChildIndex].entry.date <
          this.sourceEntryHeap[earliestEntryIndex].entry.date
      ) {
        earliestEntryIndex = leftChildIndex;
        minHeapMaintained = false; // loop through again to check if min-heap property is maintained
      }

      if (
        rightChildIndex < heapLength &&
        this.sourceEntryHeap[rightChildIndex].entry.date <
          this.sourceEntryHeap[earliestEntryIndex].entry.date
      ) {
        earliestEntryIndex = rightChildIndex;
        minHeapMaintained = false; // loop through again to check if min-heap property is maintained
      }

      if (earliestEntryIndex !== index) {
        // Swap with child
        let tempEntry = this.sourceEntryHeap[index];
        this.sourceEntryHeap[index] = this.sourceEntryHeap[earliestEntryIndex];
        this.sourceEntryHeap[earliestEntryIndex] = tempEntry;

        index = earliestEntryIndex;
      }
    }
  }
};
