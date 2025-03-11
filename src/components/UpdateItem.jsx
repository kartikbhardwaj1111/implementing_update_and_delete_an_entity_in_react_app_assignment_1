import { useEffect, useState } from "react";

const UpdateItem = () => {
  const [doors, setDoors] = useState([]); // Ensure doors is an array initially
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState({});

  useEffect(() => {
    fetch("http://localhost:8000/doors")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDoors(data);
          const initialStatus = data.reduce((acc, door) => {
            acc[door.id] = door.status;
            return acc;
          }, {});
          setNewStatus(initialStatus);
        } else {
          throw new Error("Invalid API response");
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      });
  }, []);

  const updateDoorStatus = (id) => {
    if (!newStatus[id]) {
      setError("Please enter a valid status before updating.");
      return;
    }

    fetch(`http://localhost:8000/doors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus[id] }),
    })
      .then((response) => response.json())
      .then((updatedDoor) => {
        setDoors((prevDoors) =>
          prevDoors.map((door) =>
            door.id === updatedDoor.id ? updatedDoor : door
          )
        );
      })
      .catch(() => setError("Failed to update status"));
  };

  return (
    <div>
      <h1>React App</h1>
      <h2>Doors List</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {doors.length > 0 ? (
          doors.map((door) => (
            <li key={door.id}>
              {door.name} - {door.status}{" "}
              <input
                type="text"
                value={newStatus[door.id] || ""}
                onChange={(e) =>
                  setNewStatus({ ...newStatus, [door.id]: e.target.value })
                }
              />
              <button onClick={() => updateDoorStatus(door.id)}>Update</button>
            </li>
          ))
        ) : (
          <p>Loading doors...</p>
        )}
      </ul>
    </div>
  );
};

export default UpdateItem;
