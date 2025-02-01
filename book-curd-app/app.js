const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');

const app = express();

const logRequests = (req, res, next) => {
    const { method, url } = req;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${method} ${url}`);
    next(); 
};

const parseJson = (req, res, next) => {
    if (req.headers['content-type'] === 'application/json') {
        let data = '';
        req.on('data', chunk => {
          data += chunk; // Append incoming chunks of data
        });
    
        req.on('end', () => {
          try {
            req.body = JSON.parse(data); 
            next(); 
          } catch (err) {
            res.status(400).json({ message: 'Invalid JSON format', error: err.message });
          }
        });
    } else {
        next();
    }
};

app.use(logRequests);
app.use(parseJson);

const mongoURI = 'mongodb://ganesh:ganesh@localhost:27017/bookStore';

mongoose.connect(mongoURI).
     then(() => {console.log('MongoDB Connected');}).
     catch((err) => {console.log(err);}
    );


const bookSchema = new mongoose.Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    year: {type: Number, required: true},
    genre: {type: String, required: true}
})


const Book = mongoose.model('Book', bookSchema);

app.post('/book', async (req, res) => {
    try {
        const {title, author, year, genre} = req.body;
        const newBook = new Book({title, author, year, genre});
        await newBook.save();
        res.status(201).json({message: "Book Created", book: newBook});
    }catch(err) {
        res.status(500).json({message: err.message});
    }
});

// Add books endpoint for retrieving all books
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching books', error: err.message });
    }
});

app.post('/book/:id', async (req, res) => {
    try {
        const {title, author, year, genre} = req.body;
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({message    : 'Book Not Found'});
        }
        res.status(200).json(book);
    }catch(err) {
        res.status(500).json({message: 'Error fetching book', error: err.message});
    }
});

// write a Get call for  retrieving a book by id
app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({message: 'Book not found'});
        }
        res.status(200).json(book);
    }catch(err) {
        res.status(500).json({message: 'Error fetching book', error: err.message});
    }
});


app.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, year, genre } = req.body;
    try {
      const updatedBook = await Book.findByIdAndUpdate(
        id,
        { title, author, year, genre },
        { new: true }
      );
      if (!updatedBook) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
    } catch (err) {
      res.status(500).json({ message: 'Error updating book', error: err.message });
    }
  });
  

  app.delete('/books/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deletedBook = await Book.findByIdAndDelete(id);
      if (!deletedBook) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.status(200).json({ message: 'Book deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting book', error: err.message });
    }
  });

  const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});