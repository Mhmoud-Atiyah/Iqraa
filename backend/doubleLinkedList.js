class Node {
    constructor(value) {
        this.value = value;
        this.prev = null;  // Pointer to the previous node
        this.next = null;  // Pointer to the next node
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;  // Start of the list
        this.tail = null;  // End of the list
        this.size = 0;     // Size of the list
    }

    // Add a new node to the end of the list
    append(value) {
        const newNode = new Node(value);
        if (this.size === 0) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.prev = this.tail;
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.size++;
    }

    // Append a node at a specific position
    appendAtPosition(value, position) {
        if (position < 0 || position > this.size) {
            throw new Error('Position out of bounds');
        }

        const newNode = new Node(value);

        if (position === 0) {
            // Insert at the head
            if (this.size === 0) {
                this.head = newNode;
                this.tail = newNode;
            } else {
                newNode.next = this.head;
                this.head.prev = newNode;
                this.head = newNode;
            }
        } else if (position === this.size) {
            // Insert at the tail
            this.append(value);
            return; // Already handled in append
        } else {
            // Insert in the middle
            let current = this.head;
            for (let i = 0; i < position; i++) {
                current = current.next;
            }
            newNode.prev = current.prev;
            newNode.next = current;
            if (current.prev) {
                current.prev.next = newNode;
            }
            current.prev = newNode;
            if (position === 0) {
                this.head = newNode; // Update head if needed
            }
        }

        this.size++;
    }

    // Get the previous node
    getPrev(node) {
        return node ? node.prev : null;
    }

    // Get the next node
    getNext(node) {
        return node ? node.next : null;
    }

    // Get the size of the list
    getSize() {
        return this.size;
    }
}

// Export the DoublyLinkedList class
module.exports = DoublyLinkedList;