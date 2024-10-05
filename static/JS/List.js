class Node {
    constructor(value) {
        this.value = value;
        this.prev = null;  // Pointer to the previous node
        this.next = null;  // Pointer to the next node
    }
}

// CircularDoublyLinkedList
export default class List {
    constructor() {
        this.head = null;    // Start of the list
        this.tail = null;    // End of the list
        this.size = 0;       // Size of the list
        this.current = null; // Pointer to the current node
    }

    // Add a new node to the end of the list
    append(value) {
        const newNode = new Node(value);

        if (this.size === 0) {
            // First node points to itself in both directions
            this.head = newNode;
            this.tail = newNode;
            newNode.next = newNode;
            newNode.prev = newNode;
        } else {
            // Link the new node with the current tail and head
            newNode.prev = this.tail;
            newNode.next = this.head;
            this.tail.next = newNode;
            this.head.prev = newNode;
            this.tail = newNode; // Update tail to the new node
        }
        this.size++;
    }

    // Append a node at a specific position
    appendAtPosition(value, position) {
        if (position < 0 || position > this.size) {
            throw new Error('Position out of bounds');
        }

        const newNode = new Node(value);

        if (this.size === 0) {
            // First node points to itself in both directions
            this.head = newNode;
            this.tail = newNode;
            newNode.next = newNode;
            newNode.prev = newNode;
        } else if (position === 0) {
            // Insert at the head
            newNode.next = this.head;
            newNode.prev = this.tail;
            this.head.prev = newNode;
            this.tail.next = newNode;
            this.head = newNode; // Update head to the new node
        } else if (position === this.size) {
            // Insert at the tail
            this.append(value);
            return; // append already increments size
        } else {
            // Insert in the middle
            let current = this.head;
            for (let i = 0; i < position; i++) {
                current = current.next;
            }

            // Link the new node with the surrounding nodes
            newNode.prev = current.prev;
            newNode.next = current;
            current.prev.next = newNode;
            current.prev = newNode;
        }

        this.size++; // Update the size of the list
    }

    // Append an array of values to the list
    appendArray(values) {
        if (!Array.isArray(values)) {
            throw new Error('Input must be an array');
        }

        for (const value of values) {
            this.append(value);
        }
    }

    // Print all values in the list
    printAllValues() {
        if (this.size === 0) {
            console.log('List is empty');
            return;
        }

        let current = this.head;
        let count = 0;

        do {
            console.log(current.value);
            current = current.next;
            count++;
        } while (current !== this.head && count < this.size);
    }

    // Get the previous node
    getPrev(node) {
        return node ? node.prev : null;
    }

    // Get the next node
    getNext(node) {
        return node ? node.next : null;
    }

    // Get the current node
    getCurrent() {
        return this.current;
    }

    // Set the current node to a specific node
    setCurrent(node) {
        if (node && (node instanceof Node)) {
            this.current = node;
        } else {
            throw new Error('Invalid node');
        }
    }

    // Get the size of the list
    getSize() {
        return this.size;
    }

    // Additional Methods (Optional)

    // Remove a node by value
    remove(value) {
        if (this.size === 0) {
            throw new Error('List is empty');
        }

        let current = this.head;
        let found = false;

        for (let i = 0; i < this.size; i++) {
            if (current.value === value) {
                found = true;
                break;
            }
            current = current.next;
        }

        if (!found) {
            throw new Error('Value not found in the list');
        }

        if (this.size === 1) {
            // Only one node in the list
            this.head = null;
            this.tail = null;
        } else {
            // Link the previous and next nodes
            current.prev.next = current.next;
            current.next.prev = current.prev;

            // Update head or tail if necessary
            if (current === this.head) {
                this.head = current.next;
            }
            if (current === this.tail) {
                this.tail = current.prev;
            }
        }

        this.size--;
    }

    // Find a node by value
    find(value) {
        if (this.size === 0) {
            return null;
        }

        let current = this.head;

        for (let i = 0; i < this.size; i++) {
            if (current.value === value) {
                return current;
            }
            current = current.next;
        }

        return null; // Not found
    }
}