import React, { useState, useEffect } from "react";

// create component
export default function NewQuery() {
    // create empty object to store query results
    const [nodeNames, setNodeNames] = useState([]);

    // execute query on page reload
    async function handleNewQuery(e) {
        setNodeNames([]); // reset upon execution
        e.preventDefault(); // prevent default form submission
        fetch("/api/API_Post", {
            // change to YOUR API call's URL
            method: "POST", // Change to GET if your call is a get request
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // Example of json body request. need to match your POST request's parameters
                k: 150
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                const names = data.map((item) => item.properties.name); // extract just names
                setNodeNames(names);
            })
            .catch((error) => {
                console.error("Error fetching network data:", error);
            });

        return;
    }
    // display the node names in the console (right click and inspect element)
    console.log(nodeNames);

    return (
        <div>
            <button onClick={handleNewQuery}>New Query</button>
            {
                nodeNames.map((name, index) => (
                    <p key={index}>
                        {index + 1}: {name}
                    </p>
                ))
            }
        </div>
    );
}