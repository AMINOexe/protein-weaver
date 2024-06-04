export default class HighDegreeProteins {
    /**
     * @type {neo4j.Driver}
     */
    driver;
  
    /**
     * The constructor expects an instance of the Neo4j Driver, which will be
     * used to interact with Neo4j.
     *
     * @param {neo4j.Driver} driver
     */
    constructor(driver) {
      this.driver = driver;
    }
  
    async getHighDegreeProteins() {
      const session = this.driver.session();
      const res = await session.executeRead((tx) =>
        tx.run(
          `
            MATCH (pr:protein) 
            WHERE COUNT{(pr) -[:ProPro]- (:protein) } > 150
            RETURN pr
            `
        )
      );
  
      await session.close();
      return res.records.map((record) => record.get('pr'));
    }
  }
  