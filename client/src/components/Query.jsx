import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { saveAs } from "file-saver";
import { NetworkParserPath, EdgeDataParser, NetworkParserNode } from "../tools/Parser";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import { cytoscapeStyle, layout } from "../assets/CytoscapeConfig";
import Sidebar from "./Sidebar";
import QueryError from "./QueryError";
import Joyride, { STATUS } from "react-joyride";
import SearchBar from "./SearchBar";
import Legend from "./Legend";
import { guideConfig } from "../assets/GuideConfig";

export default function Query() {
    const [query, setQuery] = useState({mode:"", species: "", protein: "", goTerm: "", k: [] });
    const [showResults, setShowResults] = useState(false);
    const [networkResult, setNetworkResult] = useState({});
    const cyRef = useRef(cytoscape.Core | undefined);
    const [sidebarNode, setSidebarNode] = useState("");
    const [sourceNode, setSourceNode] = useState("");
    const [goTerm, setGoTerm] = useState("");
    const [hasError, setHasError] = useState(false);
    const [queryCount, setQueryCount] = useState(0);
    const submitRef = useRef();
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [startGuide, setStartGuide] = useState(0);
    const [proteinOptions, setProteinOptions] = useState([]);
    const [goTermOptions, setGoTermOptions] = useState([]);
    const [ancestorsOptions, setAncestorsOptions] = useState([]);
    const [descendantsOptions, setDescendantsOptions] = useState([]);
    const [showSharedEdges, setShowSharedEdges] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams({
        mode: "",
        species: "",
        protein: "",
        goTerm: "",
        k: "",
    });
    const [guide, setGuide] = useState(guideConfig);
    const [activeModeButton, setActiveModeButton] = useState("")

    // Set default search params for the URL
    useEffect(() => {
        if (
            searchParams.get("species") === ""
        ) {
            setQuery({
                mode: "path",
                species: "txid7227",
                protein: searchParams.get("protein"),
                goTerm: searchParams.get("goTerm"),
                k: searchParams.get("k"),
            });
            setActiveModeButton("path");
        } else {
            setQuery({
                mode: "path",
                species: searchParams.get("species"),
                protein: searchParams.get("protein"),
                goTerm: searchParams.get("goTerm"),
                k: searchParams.get("k"),
            });
            setActiveModeButton("path");
        }
    }, [])

    // Get the search params from the URL
    useEffect(() => {
        if (
            searchParams.get("mode") != "" &&
            searchParams.get("species") != "" &&
            searchParams.get("protein") != "" &&
            searchParams.get("goTerm") != "" &&
            searchParams.get("k") != ""
        ) {
            setQuery({
                mode: searchParams.get("mode"),
                species: searchParams.get("species"),
                protein: searchParams.get("protein"),
                goTerm: searchParams.get("goTerm"),
                k: searchParams.get("k"),
            });
            setActiveModeButton(searchParams.get("mode"));
        }
    }, []);

    // Open user guide
    useEffect(() => {
        if (startGuide != 0) {
            submitRef.current.click();
        }
    }, [startGuide]);

    // Get autocomplete options for Proteins
    useEffect(() => {
        fetch('/api/getProteinOptions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // You can add any other headers if needed
            },
            body: JSON.stringify(query)
        })
            .then((res) => res.json())
            .then((data) => {
                const proteinNames = data.map((item) => item.name);
                const proteinIds = data.map((item) => item.id);
                const proteinMerged = [...new Set(proteinNames.concat(proteinIds))].filter(item => item !== undefined);
                setProteinOptions(proteinMerged);
            })
            .catch((error) => {
                console.error("Error fetching protein options:", error);
            });
    }, [query.species]);

    // Get autocomplete options for GO Terms
    useEffect(() => {
        fetch("/api/getGoTermOptions")
            .then((res) => res.json())
            .then((data) => {
                const goTermNames = data.map((item) => item.name);
                const goTermIds = data.map((item) => item.id);
                const goTermMerged = [...new Set(goTermNames.concat(goTermIds))].filter(item => item !== undefined);
                setGoTermOptions(goTermMerged);
            })
            .catch((error) => {
                console.error("Error fetching GO term options:", error);
            });
    }, []);

    // Get descendants for queried GO term
    // useEffect(() => {
    //     fetch("/api/getDescendants", {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             // You can add any other headers if needed
    //         },
    //         body: JSON.stringify(query)
    //     })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             const childNames = data.map((item) => item.name).filter(item => item !== undefined);
    //             setDescendantsOptions(childNames);
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching GO term descendants:", error);
    //         });
    // }, [query.goTerm]);

    // Function for submitting the query
    async function handleSubmit(e) {
        setSidebarNode(null);
        setNetworkResult({});
        setHasError(false);
        setQueryCount(queryCount + 1);
        setIsLoading(true);

        setSearchParams({
            mode: query.mode,
            species: query.species,
            protein: query.protein,
            goTerm: query.goTerm,
            k: query.k,
        });

        // get the k shortest paths for the query
        e.preventDefault();
        let network = null;
        if(query.mode == "path"){
        try {
            network = await fetch("/api/getQuery", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(query),
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else if (response.status === 404) {
                        return Promise.reject("error 404");
                    } else {
                        return Promise.reject("some other error: " + response.status);
                    }
                })
                .then((data) => {
                    setNetworkResult(NetworkParserPath(data, query.protein, query.goTerm));
                    return NetworkParserPath(data, query.protein, query.goTerm);
                });
        } catch (error) {
            console.error(
                "Error getting the network:",
                error,
                ". Protein or GO term may not exist"
            );
            setHasError(true);
        }} else {
            try {
                network = await fetch("/api/getQueryByNode", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(query),
                })
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        } else if (response.status === 404) {
                            return Promise.reject("error 404");
                        } else {
                            return Promise.reject("some other error: " + response.status);
                        }
                    })
                    .then((data) => {
                        setNetworkResult(NetworkParserNode(data, query.protein, query.k));
                        return NetworkParserNode(data, query.protein, query.k);
                    });
            } catch (error) {
                console.error(
                    "Error getting the network:",
                    error,
                    ". Protein or GO term may not exist"
                );
                setHasError(true);
            }
        }

        // get induced subgraph
        if (network != null) {
            let nodeList = { nodeList: network.nodeList };
            nodeList.nodeList.push(network.goTerm.id);
            setSourceNode(network.nodes[0].data);
            setGoTerm(network.goTerm);

            let edgeData = null;
            try {
                edgeData = await fetch("/api/getEdgeData", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(nodeList),
                })
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        } else if (response.status === 404) {
                            return Promise.reject("error 404");
                        } else {
                            return Promise.reject("some other error: " + response.status);
                        }
                    })
                    .then((edgeData) => {
                        setNetworkResult(EdgeDataParser(network, edgeData));
                        return EdgeDataParser(network, edgeData);
                    });

                setShowResults(true);
            } catch (error) {
                console.error("Error getting the network:", error);
                setHasError(true);
            }
        }
        setIsLoading(false)
    };

    // Get descendants for queried GO term
    useEffect(() => {
        if (networkResult.goTerm != null) {
            fetch("/api/getDescendants", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // You can add any other headers if needed
                },
                body: JSON.stringify(networkResult)
            })
                .then((res) => res.json())
                .then((data) => {
                    const childNames = data.map((item) => item.name).filter(item => item !== undefined);
                    setDescendantsOptions(childNames);
                })
                .catch((error) => {
                    console.error("Error fetching GO term descendants:", error);
                });
        }
    }, [networkResult.goTerm]);

    // Get ancestors for queried GO term
    useEffect(() => {
        if (networkResult.goTerm != null) {
            fetch("/api/getAncestors", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // You can add any other headers if needed
                },
                body: JSON.stringify(networkResult)
            })
                .then((res) => res.json())
                .then((data) => {
                    const ancestorNames = data.map((item) => item.name).filter(item => item !== undefined);
                    setAncestorsOptions(ancestorNames);
                })
                .catch((error) => {
                    console.error("Error fetching GO term ancestors:", error);
                });
        }
    }, [networkResult.goTerm]);

    // Hide/Show induced subgraph edges
    const handleSharedEdgesToggle = (e) => {
        setShowSharedEdges(!showSharedEdges);

        const cy = cyRef.current;
        if (cy) {
            if (showSharedEdges) {
                cy.style()
                    .selector("edge[type='shared']")
                    .style({
                        "visibility": "hidden"
                    })
                    .update();
            }
            else {
                cy.style()
                    .selector("edge[type='shared']")
                    .style({
                        "visibility": "visible"
                    })
                    .update();
            }
        }
    }

    // Allow users to change layout
    const handleLayoutChange = (layoutInput, e) => {
        const randomLayout = {
            name: "random",
            padding: 30,
            fit: true,
        };

        const gridLayout = {
            name: "grid",
            padding: 30,
            fit: true,
            avoidOverlap: true,
            avoidOverlapPadding: 10,
        };

        const cy = cyRef.current;
        if (cy) {
            if (layoutInput === "cose-bilkent") {
                cy.layout(layout).run();
            } if (layoutInput === "random") {
                cy.layout(randomLayout).run();
            } if (layoutInput === "grid") {
                cy.layout(gridLayout).run();
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuery((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSpeciesChange = (e) => {
        setQuery((prevData) => ({
            ...prevData,
            species: e.target.value,
        }));
    };

    const handleGoTermChange = (e) => {
        setQuery((prevData) => ({
            ...prevData,
            goTerm: e.target.value,
        }));
    };

    const handleSourceNode = (e) => {
        const newSource = e.target.getAttribute("new-source-node");

        if (newSource) {
            setQuery((prevData) => ({
                ...prevData,
                protein: newSource,
            }));
        }
    };

    const getSidePanelData = (node) => {
        let currentNode = node.target.data();
        setSidebarNode(currentNode);
    };

    const getExample = (i) => {
        switch (i) {
            case 1:
                setQuery({ mode: "path", species: "txid7227", protein: "egfr", goTerm: "GO:0016055", k: "4" });
                setActiveModeButton("path");
                break;
            case 2:
                setQuery({ mode: "node", species: "txid7227", protein: "flw", goTerm: "GO:0003383", k: "7" });
                setActiveModeButton("node");
                break;
            case 3:
                setQuery({ mode: "path", species: "txid7227", protein: "flw", goTerm: "GO:0045159", k: "3" });
                setActiveModeButton("path");
                break;
        }
    };

    const exportPNG = () => {
        const cy = cyRef.current;
        if (cy) {
            const pngBlob = cy.png({ output: "base64uri", full: true, bg: "white" });
            saveAs(pngBlob, "graph.png");
        }
    };

    const handleLog = (entry) => {
        setLogs((logs) => [...logs, entry]);
    };

    const handleGuide = (e) => {
        e.preventDefault();
        getExample(1);
        setStartGuide(startGuide + 1);
        setGuide({ run: true, steps: guide.steps });
    };

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setGuide({ run: false, steps: guide.steps });
        }
    };

    const handleQueryMode = (e) => {
        if(e.target.value == "K Unique Paths"){
            setQuery(prevState => ({
                ...prevState,
                mode: "path"
              }));
            setActiveModeButton("path")
            setSearchParams({
                mode: "path",
                species: query.species,
                protein: query.protein,
                goTerm: query.goTerm,
                k: query.k,
            });
        }else {setQuery(prevState => ({
            ...prevState,
            mode: "node"
          }));
          setActiveModeButton("node")
          setSearchParams({
            mode: "node",
            species: query.species,
            protein: query.protein,
            goTerm: query.goTerm,
            k: query.k,
        });
        }
    };


    return (
        <div>
            <Joyride
                callback={handleJoyrideCallback}
                continuous
                hideCloseButton
                run={guide.run}
                scrollToFirstStep
                showProgress={true}
                showSkipButton
                disableOverlayClose
                steps={guide.steps}
                styles={{
                    options: {
                        zIndex: 10000,
                    },
                }}
            />
            <div className="search-box-align">
                <SearchBar
                    handleSubmit={handleSubmit}
                    submitRef={submitRef}
                    query={query}
                    handleInputChange={handleInputChange}
                    getExample={getExample}
                    proteinOptions={proteinOptions}
                    goTermOptions={goTermOptions}
                    handleGuide={handleGuide}
                    handleSpeciesChange={handleSpeciesChange}
                    handleQueryMode={handleQueryMode}
                    activeModeButton={activeModeButton}
                />

                {hasError && <QueryError />}

                {isLoading && JSON.stringify(networkResult) == "{}" && (
                    <div className="loader"></div>
                )}

                {showResults && JSON.stringify(networkResult) != "{}" && (
                    <div className="legend-align">
                        <div className="sidebar-align">
                            <CytoscapeComponent
                                className="cytoscape-graph"
                                elements={CytoscapeComponent.normalizeElements(networkResult)}
                                style={{
                                    width: "800px",
                                    height: "500px",
                                    cursor: "pointer",
                                }}
                                stylesheet={cytoscapeStyle}
                                layout={layout}
                                cy={(cy) => {
                                    cyRef.current = cy;
                                    cy.on("tap", "node", (evt) => {
                                        getSidePanelData(evt);
                                    });
                                }}
                            />
                            <Sidebar
                                currentNode={sidebarNode}
                                sourceNode={sourceNode}
                                query={query}
                                goTerm={goTerm}
                                newSourceNode={handleSourceNode}
                                handleSubmit={handleSubmit}
                                exportPNG={exportPNG}
                                searchExecuted={searchParams}
                                queryCount={queryCount}
                                logs={logs}
                                handleLog={handleLog}
                                parentGoTerms={ancestorsOptions}
                                childrenGoTerms={descendantsOptions}
                                handleGoTermChange={handleGoTermChange}
                            />
                        </div>
                        <Legend
                            handleSharedEdgesToggle={handleSharedEdgesToggle}
                            showSharedEdges={showSharedEdges}
                            handleLayoutChange={handleLayoutChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
