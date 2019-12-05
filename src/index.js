

// To Run:  nodemon src/index.js


const express = require ('express')
require ('./db/mongoose');
const Task = require ('./models/task');
const User = require ('./models/user');
const userRouter = require ('./routers/user');
const taskRouter = require ('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

// Without middleware:  new request -> run route handler
// With middleware:  new request -> do something -> run route handler
// app.use((req, res, next) => {
//     console.log (req.method, req.path);
//     next();
// });

app.use(express.json());        //Automatically parse incoming JSON into an object
app.use(userRouter);
app.use(taskRouter);

app.listen (port, () => {
    console.log ('Server is up on port ' + port);
})


// const bcrypt = require('bcryptjs')
// const myFuntion = async () => {
//     const password = 'Red12345!';
//     const hashedPassword = await bcrypt.hash (password, 8);
//     console.log (password);
//     console.log (hashedPassword);

//     const isMatch = await bcrypt.compare ('Red12345!', hashedPassword);
//     console.log (isMatch);
// }

// const jwt = require ('jsonwebtoken');
// const myFunction = async() => {
//     const token = jwt.sign ({ _id: 'abc123'}, 'hiThere', {expiresIn: '7 days'});
//     console.log(token);
//     const data = jwt.verify (token, 'hiThere');
//     console.log(data);
// }

// myFunction()

// const pet = {
//     name: 'Hal'
// }

// pet.toJSON = function () {
//     console.log (this);
//     return this
// };

// console.log (JSON.stringify(pet));

const main = async () => {
    const task = await Task.findById('5de80e9274d08d1ad31e585d');
    await task.populate ('owner').execPopulate();    //finds user that is associated with owner and assigns it to the owner property
    console.log (task);

    const user = User.findById ('5de80d6928b5f01a0cf7b92c');
    await user.populate('tasks').execPopulate();
    console.log (user.tasks);
}
main();