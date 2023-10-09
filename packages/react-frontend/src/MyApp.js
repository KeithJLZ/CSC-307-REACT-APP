import React, { useState, useEffect } from 'react';
import Table from "./Table";
import Form from "./Form";

const characters = [
  {
    name: "Charlie",
    job: "Janitor",
  },
  {
    name: "Mac",
    job: "Bouncer",
  },
  {
    name: "Dee",
    job: "Aspring actress",
  },
  {
    name: "Dennis",
    job: "Bartender",
  },
];

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    const characterToDelete = characters[index];

    if (!characterToDelete.id) {
      console.error("User ID is missing. Cannot delete.");
      return;
    }

    fetch(`http://localhost:8000/users/${characterToDelete.id}`, { method: 'DELETE' })
      .then(response => {
        if (response.status === 204) { 
          const updatedCharacters = characters.filter((character, i) => i !== index);
          setCharacters(updatedCharacters);
        } else if (response.status === 404) {
          console.error("Resource not found. Delete failed.");
        } else {
          console.error("Delete failed with status: " + response.status);
        }
      })
      .catch(error => {
        console.error("Error deleting character:", error);
      });
  }

  function updateList(person) {
    postUser(person)
      .then((response) => response.json())
      .then((newUser) => {
        if (newUser && newUser.id) {
          setCharacters([...characters, newUser]);
        } else {
          console.error("Failed to insert user.");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }


  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, []);

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  return (
    <div className="container">
      <Table characterData={characters}
        removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  )
}
export default MyApp;
