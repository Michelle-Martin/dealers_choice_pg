console.log('hello world')

const express = require('express')
const app = express()
const {Client}= require('pg')




const client = new Client(process.env.DATABASE_URL || 'postgress://localhost/books')

const syncAndSeed = async()=> {
    const SQL = `
    DROP TABLE IF EXISTS "myBooks";
    CREATE TABLE "myBooks"(
        id SERIAL PRIMARY KEY, 
        title VARCHAR(100) NOT NULL,
        author VARCHAR(100) NOT NULL,
        year VARCHAR(125)

    );
    INSERT INTO "myBooks"(title, author, year) VALUES ('To Kill a Mockingbird','Harper Lee','1960');
    INSERT INTO "myBooks"(title, author, year) VALUES ('1984','George Orwell','1949');
    INSERT INTO "myBooks"(title, author, year) VALUES ('Harry Potter and the Sorcerers Stone','J.K, Rowling','1997');
    INSERT INTO "myBooks"(title, author, year) VALUES ('The Great Gatsby','Francis Scott Fitzgerald','1925');
    INSERT INTO "myBooks"(title, author, year) VALUES ('Animal Farm','George Orwell','1945');
    INSERT INTO "myBooks"(title, author, year) VALUES ('The Hobit, or There and Back Again','J.R.R.Tolkien','1937');
    INSERT INTO "myBooks"(title, author, year) VALUES ('The Diary of a Young Girl','Anne Frank','1947');
    INSERT INTO "myBooks"(title, author, year) VALUES ('The Little Prince','Antoine de SaintExupéry','1943');
    INSERT INTO "myBooks"(title, author, year) VALUES ('The Catvher in the Rye','J.D Salinger','1951');
    INSERT INTO "myBooks"(title, author, year) VALUES ('Fahrenheit 451','Ray Bradbury','1953');
    `;
    await client.query(SQL) 
}

const init = async()=> {
    try {
        await client.connect();
        console.log('you are connected')
        await syncAndSeed();
        console.log('seeded')
        const port = process.env.PORT || 3000;
        app.listen(port, ()=> console.log(`app listens on port ${port}`))
    
    }
    catch(ex) {
        console.log(ex)
    }
    
   
}

init()

const getBooks = async() => {
    return (await client.query('SELECT * FROM "myBooks";')).rows
};
app.get('/', async(req,res)=> {
    
    const books = await getBooks()
    const html = `<html> 
    <img src="https://image.shutterstock.com/image-photo/books-long-row-isolated-on-260nw-373441690.jpg">
    <h1> The Best Books of the 20th Century </h1>
    <div> ${books.map (book => `<li>  <a href='/${book.id}'>  ${book.title} </li>`).join('')} </div>
    <div> </div>
    <div class = 'random' > <a href='/random'> Pick a book for me! </div>
    </html>
    <style>
    h1{
        font-family: Impact;
        background-color: palegreen;
    }
    div{
        font-family: Impact;
    }
    .random{
        background-color:pink;
    }
    </sytle>
    `
    try{ 
        res.send(html)

    }
    catch(ex){
console.log(ex)
    }
})

app.get('/:id', async(req,res)=> {
    const bookById = await client.query('SELECT * FROM "myBooks" WHERE id =$1;', [req.params.id])
    const theBook = bookById.rows[0];
    const html = `<html> 
    <img src="https://image.shutterstock.com/image-photo/books-long-row-isolated-on-260nw-373441690.jpg">
    <h1> The Best Books of the 20th Century </h1>
    <div> ${theBook.title} </div>
    <div> ${theBook.year} </div>
    <div> ${theBook.author} </div>
    </html>
    <style>
    h1{
        font-family: Impact;
        background-color: palegreen;
    }
    div{
        font-family: Impact;
    }
    </sytle>
    `
    try{ 
        res.send(html)

    }
    catch(ex){
console.log(ex)
    }
})

//need to fix random book
// app.get('/random', async(req,res)=> {
//     const randombook = async() => {return (await Math.floor(Math.random()* Math.floor(10)))}
//     const books = await getBooks()
//     const html = `<html> 
//     <h1> We suggest you read... </h1>
//     <div> ${books.randombook} </div>
//    <div> </div>
//     <div> <a href='/random'> Pick a book for me! </div>
//     </html>
//     <style>
//     h1{
//         font-family: Impact;
//         background-color: palegreen;
//     }
//     div{
//         font-family: Impact;
//     }
//     </sytle>
//     `
//     try{ 
//         res.send(html)

//     }
//     catch(ex){
// console.log(ex)
//     }
// })