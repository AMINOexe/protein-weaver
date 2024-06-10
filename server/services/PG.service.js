export default class PGService {
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

    async ProGo(GoID) {
        const session = this.driver.session();
        const res = await session.executeRead((tx) =>
            tx.run(
            `
            match (go:go_term)
            where (go.name = $GoID)
            return COUNT {(go) - [:ProGo] - (:protein)} as Count
            `,

                {
                    GoID:GoID
                }
            )
        );
        const count = res.records;


        await session.close();
    
    
        return count;
    
    }
}
