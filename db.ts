import SQLite from 'react-native-sqlite-2';
import type {WebsqlDatabase} from 'react-native-sqlite-2';
import type {SQLResultSet, SQLTransaction} from 'react-native-sqlite-2';

let initPromise: Promise<void> | null = null;
export async function initDatabase(): Promise<void> {
    if (!initPromise) {
        initPromise = executeSql(
            `CREATE TABLE IF NOT EXISTS products (
                    id TEXT PRIMARY KEY NOT NULL,
                    name TEXT NOT NULL,
                    price REAL NOT NULL
                );`
        )
        .then(() => {});
    }
    return initPromise;
}

let database: WebsqlDatabase | null = null;
function getDatabase(): WebsqlDatabase {
    if (!database) {
        database = SQLite.openDatabase(
            'app.db',
            '1.0',
            'rn-spike',
            1
        );
    }
    return database;
}

export function executeSql(
    sql: string,
    params: Array<string | number | null> = []
): Promise<SQLResultSet> {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
        db.transaction(
            (tx: SQLTransaction) => {
                tx.executeSql(
                    sql,
                    params,
                    (_tx, result) => resolve(result),
                    (_tx, error) => {
                        reject(error);
                        return true;
                    }
                );
            },
            error => reject(error)
        )
    });
}