import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

const users = {
  users_list: [
    {
      id: 'xyz789',
      name: 'Charlie',
      job: 'Janitor',
    },
    {
      id: 'abc123',
      name: 'Mac',
      job: 'Bouncer',
    },
    {
      id: 'ppp222',
      name: 'Mac',
      job: 'Professor',
    },
    {
      id: 'yat999',
      name: 'Dee',
      job: 'Aspring actress',
    },
    {
      id: 'zap555',
      name: 'Dennis',
      job: 'Bartender',
    }
  ]
}

app.use(cors());

app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});      



const addUser = (user) => {
  user.id = generateRandomID();
  users['users_list'].push(user);
  return user;
}

app.post('/users', (req, res) => {
  const userToAdd = req.body;
  const newUser = addUser(userToAdd);
  res.status(201).send(newUser); 
});



app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  const index = users["users_list"].findIndex((user) => {
    return user.id === id;
  });

  if (index !== -1) {
    users["users_list"].splice(index, 1);
    res.status(204).send(); 
  } else {
    res.status(404).send('Resource not found.'); 
  }
});



const findUserByNameAndJob = (name, job) => {
  return users['users_list']
    .filter((user) => {
      return user['name'] === name && (!job || user['job'] === job);
    });
}

const findUserById = (id) =>
  users['users_list']
    .find((user) => user['id'] === id);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  if (name) {
    let result = findUserByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);
  }
  else {
    res.send(users);
  }
});

app.get('/users/:id', (req, res) => {
  const id = req.params['id']; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send('Resource not found.');
  } else {
    res.send(result);
  }
});

function generateRandomID() {
  return Math.floor(Math.random() * 1000000).toString();
}