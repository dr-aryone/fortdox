const sqlConfig = require('app/config.json').sqlConfig;
const Sequelize = require('sequelize');
const prompt = require('syncprompt');
const sequelize = new Sequelize(
  sqlConfig.database,
  sqlConfig.username,
  sqlConfig.password,
  {
    host: sqlConfig.host,
    dialect: sqlConfig.dialect,
    logging: sqlConfig.logging,
    operatorsAliases: false
  }
);
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: 'http://localhost:9200'
});
let orgnaizationIndex;

function run() {
  console.log('Migration started');
  orgnaizationIndex = prompt('Enter orgnaization index\n');
  migrate();
}

async function migrate() {
  try {
    const versionsByDocument = await getChangelogsFromDatabase();

    for (const [documentId, changelog] of versionsByDocument) {
      const versionFormat = changelog.map(ch => {
        return { user: ch.user, createdAt: ch.createdAt };
      });
      console.log(`Will add ${versionFormat.length} versions to ${documentId}`);
      const result = await addVersionsToDocument(
        orgnaizationIndex,
        documentId,
        versionFormat
      );
      console.log(`Updated ${documentId}`, result);
    }

    console.log('All documents have been given versions now.');
  } catch (error) {
    console.error(error);
  }
  process.exit();
}

async function getChangelogsFromDatabase() {
  try {
    let documents = new Map();

    const changelogs = await sequelize.query(
      'SELECT * FROM Changelogs ORDER BY createdAt',
      {
        type: sequelize.QueryTypes.SELECT
      }
    );

    changelogs.forEach(changelog => {
      const docId = changelog.elasticSearchId;

      if (documents.has(docId)) {
        const list = documents.get(docId);
        documents.set(docId, list.concat([changelog]));
      } else {
        documents.set(docId, [changelog]);
      }
    });
    return documents;
  } catch (error) {
    console.error('Could not get changelogs from db', error);
    throw new Error('db failed');
  }
}

async function addVersionsToDocument(org, docId, versions) {
  try {
    const response = await client.update({
      index: org,
      type: 'fortdox_document',
      id: docId,
      refresh: true,
      body: {
        doc: {
          versions: versions
        }
      }
    });
    return response;
  } catch (error) {
    console.error(error);
    throw new Error('Elasticsearch failed');
  }
}

run();
