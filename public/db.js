let db;
// create a new db request for a "budget" database.
const request = indexedDB.open("budget1", 1);

request.onupgradeneeded = function(event) {
   // create object store called "oldtransaction" and set autoIncrement to true
  const db = event.target.result;
  db.createObjectStore("oldtransaction", { autoIncrement: true });
};

request.onsuccess = function(event) {
  db = event.target.result;

  // check if app is online before reading from db
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function(event) {
  console.log("Woops! " + event.target.errorCode);
};

function saveRecord(record) {
  // create a transaction on the oldtransaction db with readwrite access
  const transaction = db.transaction(["oldtransaction"], "readwrite");

  // access your oldtransaction object store
  const store = transaction.objectStore("oldtransaction");

  // add record to your store with add method.
  store.add(record);
}

function checkDatabase() {
  // open a transaction on your oldtransaction db
  const transaction = db.transaction(["oldtransaction"], "readwrite");
  // access your oldtransaction object store
  const store = transaction.objectStore("oldtransaction");
  // get all records from store and set to a variable
  const getAll = store.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(() => {
        // if successful, open a transaction on your oldtransaction db
        const transaction = db.transaction(["oldtransaction"], "readwrite");

        // access your oldtransaction object store
        const store = transaction.objectStore("oldtransaction");

        // clear all items in your store
        store.clear();
      });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);
