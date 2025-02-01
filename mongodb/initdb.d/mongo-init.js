db = db.getSiblingDB('bookStore');

db.createUser({
    user: "ganesh",
    pwd: "ganesh",
    roles: [
        {
            role: "readWrite",
            db: "bookStore"
        }
    ]
});

db.createCollection('books');

db.books.insertMany([
    { title: "The Great Gatsby", year: 1925, author: "F. Scott Fitzgerald", genre: "Fiction" },
    { title: "To Kill a Mockingbird", year: 1960, author: "Harper Lee", genre: "Fiction" },
    { title: "1984", year: 1949, author: "George Orwell", genre: "Science Fiction" },
    { title: "Pride and Prejudice", year: 1813, author: "Jane Austen", genre: "Romance" },
    { title: "The Hobbit", year: 1937, author: "J.R.R. Tolkien", genre: "Fantasy" },
    { title: "The Catcher in the Rye", year: 1951, author: "J.D. Salinger", genre: "Fiction" },
    { title: "Lord of the Flies", year: 1954, author: "William Golding", genre: "Fiction" },
    { title: "Jane Eyre", year: 1847, author: "Charlotte Brontë", genre: "Romance" },
    { title: "The Alchemist", year: 1988, author: "Paulo Coelho", genre: "Fiction" },
    { title: "Brave New World", year: 1932, author: "Aldous Huxley", genre: "Science Fiction" },
    { title: "The Road", year: 2006, author: "Cormac McCarthy", genre: "Post-Apocalyptic" },
    { title: "The Odyssey", year: -800, author: "Homer", genre: "Epic Poetry" },
    { title: "Crime and Punishment", year: 1866, author: "Fyodor Dostoevsky", genre: "Psychological Fiction" },
    { title: "The Divine Comedy", year: 1320, author: "Dante Alighieri", genre: "Epic Poetry" },
    { title: "Don Quixote", year: 1605, author: "Miguel de Cervantes", genre: "Adventure" },
    { title: "The Canterbury Tales", year: 1400, author: "Geoffrey Chaucer", genre: "Poetry" },
    { title: "One Hundred Years of Solitude", year: 1967, author: "Gabriel García Márquez", genre: "Magical Realism" },
    { title: "The Picture of Dorian Gray", year: 1890, author: "Oscar Wilde", genre: "Gothic Fiction" },
    { title: "Frankenstein", year: 1818, author: "Mary Shelley", genre: "Gothic Fiction" },
    { title: "The War of the Worlds", year: 1898, author: "H.G. Wells", genre: "Science Fiction" },
    { title: "The Time Machine", year: 1895, author: "H.G. Wells", genre: "Science Fiction" },
    { title: "Dracula", year: 1897, author: "Bram Stoker", genre: "Gothic Fiction" },
    { title: "The Adventures of Sherlock Holmes", year: 1892, author: "Arthur Conan Doyle", genre: "Mystery" },
    { title: "The Count of Monte Cristo", year: 1844, author: "Alexandre Dumas", genre: "Adventure" },
    { title: "Les Misérables", year: 1862, author: "Victor Hugo", genre: "Historical Fiction" },
    { title: "The Three Musketeers", year: 1844, author: "Alexandre Dumas", genre: "Adventure" },
    { title: "War and Peace", year: 1869, author: "Leo Tolstoy", genre: "Historical Fiction" },
    { title: "Anna Karenina", year: 1877, author: "Leo Tolstoy", genre: "Romance" },
    { title: "Moby Dick", year: 1851, author: "Herman Melville", genre: "Adventure" },
    { title: "The Scarlet Letter", year: 1850, author: "Nathaniel Hawthorne", genre: "Historical Fiction" }
]);

// Find all books
db.books.find();

// Find books by genre
db.books.find({ genre: "Science Fiction" });

// Find books published after 1900
db.books.find({ year: { $gt: 1900 } });

// Find specific book by title
db.books.findOne({ title: "The Hobbit" });

// Count books by genre
db.books.aggregate([
    { $group: { _id: "$genre", count: { $sum: 1 } } }
]);

// Average year by genre
db.books.aggregate([
    { $group: { _id: "$genre", avgYear: { $avg: "$year" } } }
]);

// Aggregate based on a multiple fields
db.books.aggregate([
    {
        $group: {
            _id: {
                year: "$year",
                genre: "$genre"
            },
            bookCount: { $sum: 1 },
            Year: { $push: "$year" }
        }
    },
    { $sort: { bookCount: -1 } }
]);

// Update a book's year
db.books.updateOne(
    { title: "The Hobbit" },
    { $set: { year: 1938 } }
);

// Update multiple books
db.books.updateMany(
    { genre: "Science Fiction" },
    { $set: { category: "SF" } }
);

// Delete one book
db.books.deleteOne({ title: "The Road" });

// Delete multiple books
db.books.deleteMany({ year: { $lt: 1800 } });

// Complex query with multiple conditions
db.books.find({
    $and: [
        { year: { $gt: 1900 } },
        { genre: { $in: ["Fiction", "Science Fiction"] } }
    ]
});

// Sort books by year
db.books.find().sort({ year: 1 });

// Limit results
db.books.find().limit(5);

// Find distinct authors
db.books.distinct("author");

// Text search (requires text index)
db.books.createIndex({ title: "text" });
db.books.find({ $text: { $search: "war" } });

// Complex aggregation pipeline
db.books.aggregate([
    { $match: { year: { $gt: 1900 } } },
    { $group: { 
        _id: "$genre",
        books: { $push: "$title" },
        count: { $sum: 1 }
    }},
    { $sort: { count: -1 } }
]);
