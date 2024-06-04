export default class PostTst {
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
  
    async MakePostTst(k) {
      const session = this.driver.session();
      const res = await session.executeRead((tx) =>
        tx.run(
          `
            MATCH (pr:protein) 
            WHERE COUNT{(pr) -[:ProPro]- (:protein) } > toInteger($k)
            RETURN pr
            `,

            {
                k:k
            }
        )
      );
      await session.close();
      return res.records.map((record) => record.get('pr'));
    }
  }
  

/* 
Working fetch request for PostTst

fetch('http://localhost:5173/api/API_post', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({"k":150}),
})
.then(response => response.json())
.then(data => console.log(data))
.catch((error) => {
    console.error('Error:', error);
});
*/