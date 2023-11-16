import React from "react";
import MainLayout from "../layout/MainLayout";
import SubNetworkImage from "../assets/subnetwork-example.png";
import Neo4jImage from "../assets/neo4j-image.png";


export default function FAQPage() {
  return (
    <div>
      <MainLayout>
        <div className="main-layout-body">
          <div className="faq-body">
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <h3>What is ProteinWeaver?</h3>
            <p>
              ProteinWeaver is a tool designed to help biologists answer
              questions related to how proteins are connected to other proteins
              with a specific biological process.
            </p>
            <h3>What can I do with this tool?</h3>
            <div className="faq-image-container">
              <div>
                <p className="faq-body-text">
                  Suppose you are interested in a particular protein, and you
                  want to know how this protein is connected to other proteins
                  that is annotated with a biological process (
                  <a
                    className="faq-body-link"
                    href="https://geneontology.org/docs/ontology-documentation/"
                  >
                    GO terms
                  </a>
                  ). ProteinWeaver will generate an induced subgraph that
                  connects your protein of interest to these other proteins. The
                  subnetwork is generated by doing a{" "}
                  <a
                    className="faq-body-link"
                    href="https://neo4j.com/docs/graph-data-science/current/algorithms/yens/"
                  >
                    Yen's shortest path algorithm
                  </a>{" "}
                  for <em>k</em> number of shortest paths.
                </p>
                <h3 className="faq-body-text">
                  How can this be useful for biologists?
                </h3>
                <p className="faq-body-text">
                  Proteins can be labeled with many things, such as a gene
                  ontology term (GO term). This term represents a biological
                  process that a protein may partake in. Case studies from
                  biochemistry, cell biology, and developmental biology, based
                  on elucidating the connections between proteins and specific
                  pathways and processes, highlight the potential of
                  ProteinWeaver to quickly generate hypotheses for experimental
                  validation.
                </p>
              </div>
              <img className="subnetwork-image" src={SubNetworkImage}></img>
            </div>
            <h3>How does this tool work behind the scenes?</h3>
            <div className="faq-image-container">
              <div>
                <p className="faq-body-text">
                  Thanks to React.js and Cytoscape.js, the frontend of the site
                  works in a fluid and dynamic fashion. Components can be
                  dynamically rendered and in-between page navigation requires
                  no refresh.
                </p>
                <p className="faq-body-text">
                  Due to the complex nature of the networks, a traditional
                  relational database does not provide easy lookups within the
                  network (such as quickly looking up the path between two nodes
                  or get all the nodes with a particular property). From this,
                  we utilized Neo4j, a native graph database. Built for complex
                  networks, Neo4j is able to do graph traversals, shortest path
                  computations, and node lookups extremely fast.
                </p>
              </div>
              <img className="subnetwork-image" src={Neo4jImage}></img>
            </div>
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
