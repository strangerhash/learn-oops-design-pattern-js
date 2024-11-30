// Predefined data for books and members
const predefinedData = {
    books: [
      { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
      { id: 2, title: "1984", author: "George Orwell" },
    ],
    members: [
      { id: 1, name: "Alice", type: "Regular" },
      { id: 2, name: "Bob", type: "Premium" },
    ],
  };
  
  // Singleton Pattern: Ensures a single instance of Library exists
  class Library {
    constructor(name) {
      if (Library.instance) return Library.instance; // Singleton logic
      this.name = name;
      this.books = [];
      this.members = [];
      Library.instance = this;
    }
  
    // Add books or members to the library
    addEntity(type, entity) {
      this[type].push(entity);
    }
  
    // Find a book or member by ID
    findEntity(type, id) {
      return this[type].find(item => item.id === id);
    }
  
    // Borrow a book based on member's policy
    borrowBook(bookId, memberId) {
      const book = this.findEntity("books", bookId);
      const member = this.findEntity("members", memberId);
  
      if (book?.isAvailable && member) {
        const dueDate = member.policy.calculateDueDate();
        book.isAvailable = false;
        member.borrowBook(book, dueDate);
        logOperation(`${member.name} borrowed "${book.title}" (Due: ${dueDate.toDateString()})`);
      } else {
        logOperation(`Cannot borrow book: Book or member not available.`);
      }
    }
  
    // Return a borrowed book
    returnBook(bookId, memberId) {
      const member = this.findEntity("members", memberId);
      const borrowedBook = member?.borrowedBooks.find(b => b.book.id === bookId);
  
      if (borrowedBook) {
        borrowedBook.book.isAvailable = true;
        member.returnBook(bookId);
        logOperation(`${member.name} returned "${borrowedBook.book.title}"`);
      } else {
        logOperation(`Cannot return book: Book not found in member's borrowed list.`);
      }
    }
  }
  
  // Strategy Pattern: Different borrowing policies for Regular and Premium members
  class BorrowingPolicy {
    calculateDueDate(days) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + days);
      return dueDate;
    }
  }
  
  class RegularPolicy extends BorrowingPolicy {
    calculateDueDate() {
      return super.calculateDueDate(7); // Regular members get 7 days
    }
  }
  
  class PremiumPolicy extends BorrowingPolicy {
    calculateDueDate() {
      return super.calculateDueDate(14); // Premium members get 14 days
    }
  }
  
  // Book class to manage book properties
  class Book {
    constructor(id, title, author) {
      this.id = id;
      this.title = title;
      this.author = author;
      this.isAvailable = true; // Initial state: available
    }
  }
  
  // Member class to manage members and their borrowed books
  class Member {
    constructor(id, name, policy) {
      this.id = id;
      this.name = name;
      this.borrowedBooks = [];
      this.policy = policy; // Strategy pattern for borrowing policy
    }
  
    // Borrow a book and record the due date
    borrowBook(book, dueDate) {
      this.borrowedBooks.push({ book, dueDate });
    }
  
    // Return a book by removing it from the borrowed list
    returnBook(bookId) {
      this.borrowedBooks = this.borrowedBooks.filter(b => b.book.id !== bookId);
    }
  }
  
  // Initialize the library and add predefined data
  const library = new Library("Interactive Library");
  
  // Populate the library with books and members
  predefinedData.books.forEach(data => library.addEntity("books", new Book(data.id, data.title, data.author)));
  predefinedData.members.forEach(data => {
    const policy = data.type === "Premium" ? new PremiumPolicy() : new RegularPolicy();
    library.addEntity("members", new Member(data.id, data.name, policy));
  });
  
  // Steps to demonstrate the library system
  const steps = [
    { action: "Display all books", code: "displayBooks();" },
    { action: "Display all members", code: "displayMembers();" },
    { action: 'Alice borrows "The Great Gatsby"', code: 'library.borrowBook(1, 1); displayBooks();' },
    { action: 'Bob borrows "1984"', code: 'library.borrowBook(2, 2); displayBooks();' },
    { action: 'Alice returns "The Great Gatsby"', code: 'library.returnBook(1, 1); displayBooks();' },
  ];
  
  let currentStep = 0; // To track progress in the step-by-step operations
  
  // Logging operations to the UI
  function logOperation(message) {
    const logDiv = document.getElementById("log");
    const logEntry = document.createElement("p");
    logEntry.textContent = message;
    logDiv.appendChild(logEntry);
  }
  
  // Display books in the UI
  function displayBooks() {
    const bookList = document.getElementById("book-list");
    bookList.innerHTML = ""; // Clear current list
    library.books.forEach(book => {
      const li = document.createElement("li");
      li.textContent = `${book.title} by ${book.author} - ${book.isAvailable ? "Available" : "Borrowed"}`;
      bookList.appendChild(li);
    });
  }
  
  // Display members in the UI
  function displayMembers() {
    const memberList = document.getElementById("member-list");
    memberList.innerHTML = ""; // Clear current list
    library.members.forEach(member => {
      const li = document.createElement("li");
      li.textContent = `${member.name} (${member.policy instanceof PremiumPolicy ? "Premium" : "Regular"})`;
      memberList.appendChild(li);
    });
  }
  
  // Handle "Next" button click to progress through steps
  document.getElementById("next-btn").addEventListener("click", () => {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      logOperation(`Step ${currentStep + 1}: ${step.action}`);
      document.getElementById("code-display").textContent = step.code;
      eval(step.code); // Execute the step code dynamically
      currentStep++;
    } else {
      logOperation("No more steps.");
    }
  });
  
  // Initialize the UI by displaying initial books and members
  displayBooks();
  displayMembers();
  