import React, { useState, useEffect } from "react";
import Autocomplete from "../components/Autocomplete";

// create component
export default function PGCounter() {
    // create empty object to store query results
    const [val, setVal] = useState([]);
    const [count, setCount] = useState([]);
    const [goTermOptions, setGoTermOptions] = useState([]);
    const [id, setID] = useState({
        id: ""
    })

    useEffect(() => {
        fetch("/api/getGoTermOptions")
            .then((res) => res.json())
            .then((data) => {
                const goTermNames = data.map((item) => item.name);
                const goTermIds = data.map((item) => item.id);
                const goTermMerged = [...new Set(goTermNames.concat(goTermIds))].filter(
                    (item) => item !== undefined
                );
                setGoTermOptions(goTermMerged);
            })
            .catch((error) => {
                console.error("Error fetching GO term options:", error);
            });
    }, []);

    // execute query on page reload
    async function handleNewQuery(e) {
        e.preventDefault(); // prevent default form submission
        fetch("/api/ProGoCounter", {
            // change to YOUR API call's URL
            method: "POST", // Change to GET if your call is a get request
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // Example of json body request. need to match your POST request's parameters
                id: val
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data[0]._fields[0]["low"])
                const count = data[0]._fields[0]["low"];
                setCount(count);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        return;
    }


     return (
        <div className="go-results-wrapper">
            <div className="go-input-form"> Enter GO Term Name:
                <Autocomplete
                    className="go-term-input"
                    suggestions={goTermOptions} // Pass the go term suggestions to the Autocomplete component
                    inputName="goTerm"
                    inputValue={val}
                    onInputChange={(e) => setVal(e.target.value)}
                    placeholder="GO Term"
                />
            </div>
            <div className="go-results-container">
                <button type="submit" className="search-button" onClick={handleNewQuery}>Submit</button> {
                    <output className="progo-output-box">
                        Interactions: {count}
                    </output>
                }
            </div>
        </div>
    )
}



