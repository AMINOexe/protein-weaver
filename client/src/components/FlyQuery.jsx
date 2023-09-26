import React, { useState, useEffect, useRef } from "react";
import { Neo4jParser } from "../tools/Parser";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import { cytoscapeStyle, layout } from "../assets/CytoscapeConfig";

export default function FlyQuery() {
  const [query, setQuery] = useState({ protein: "", goTerm: "", k: [] });
  const [showResults, setShowResults] = useState(false);
  const [networkResult, setNetworkResult] = useState({});
  const cyRef = useRef(cytoscape.Core | undefined);
  

  const handleSubmit = async (e) => {
    setNetworkResult({})
    e.preventDefault();

    fetch("/api/getFlyBase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    })
      .then((response) => response.json())
      .then((data) => {
        setNetworkResult(Neo4jParser(data, query.protein, query.goTerm));
      })
      .catch((error) => {
        console.error("Error getting the network:", error);
      });
    setShowResults(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuery((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <div class="container">
      <form method="post" onSubmit={handleSubmit} action="api/getFlyBase">

        <div class="wrapper">
          <h3>Enter Protein, GO Term and Number of Networks</h3>
          <div class="search-container">
        <input
          type="text"
          name="protein"
          placeholder="FBgn0031985"
          value={query.protein}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="goTerm"
          placeholder="GO:0003674"
          value={query.goTerm}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="k"
          placeholder="3"
          value={query.k}
          onChange={handleInputChange}
          required
        />
        <button type="submit" class="button">Search for Networks</button>
          </div>
        </div>

      </form>
      </div>

      {showResults && JSON.stringify(networkResult) != "{}" && (
        <div>
          <CytoscapeComponent
            className="cytoscape-graph"
            elements={CytoscapeComponent.normalizeElements(networkResult)}
            style={{
              width: "800px",
              height: "500px",
            }}
            stylesheet={cytoscapeStyle}
            layout={layout}
          />
        </div>
      )}
    </div>
  );
}
