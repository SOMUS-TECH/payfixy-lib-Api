"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const databaseConfig = {
    connection: Env_1.default.get('DB_CONNECTION'),
    connections: {
        sqlite: {
            client: 'sqlite',
            connection: {
                filename: Application_1.default.tmpPath('db.sqlite3'),
            },
            pool: {
                afterCreate: (conn, cb) => {
                    conn.run('PRAGMA foreign_keys=true', cb);
                }
            },
            migrations: {
                naturalSort: true,
            },
            useNullAsDefault: true,
            healthCheck: false,
            debug: false,
        },
        mysql: {
            client: 'mysql2',
            connection: {
                host: Env_1.default.get('MYSQL_HOST'),
                port: Env_1.default.get('MYSQL_PORT'),
                user: Env_1.default.get('MYSQL_USER'),
                password: Env_1.default.get('MYSQL_PASSWORD', ''),
                database: Env_1.default.get('MYSQL_DB_NAME'),
            },
            migrations: {
                naturalSort: true,
            },
            healthCheck: false,
            debug: false,
        },
        pg: {
            client: 'pg',
            connection: {
                host: Env_1.default.get('PG_HOST'),
                port: Env_1.default.get('PG_PORT'),
                user: Env_1.default.get('PG_USER'),
                password: Env_1.default.get('PG_PASSWORD', ''),
                database: Env_1.default.get('PG_DB_NAME'),
            },
            migrations: {
                naturalSort: true,
            },
            healthCheck: false,
            debug: false,
        },
        oracle: {
            client: 'oracledb',
            connection: {
                host: Env_1.default.get('ORACLE_HOST'),
                port: Env_1.default.get('ORACLE_PORT'),
                user: Env_1.default.get('ORACLE_USER'),
                password: Env_1.default.get('ORACLE_PASSWORD', ''),
                database: Env_1.default.get('ORACLE_DB_NAME'),
            },
            migrations: {
                naturalSort: true,
            },
            healthCheck: false,
            debug: false,
        },
        mssql: {
            client: 'mssql',
            connection: {
                user: Env_1.default.get('MSSQL_USER'),
                port: Env_1.default.get('MSSQL_PORT'),
                server: Env_1.default.get('MSSQL_SERVER'),
                password: Env_1.default.get('MSSQL_PASSWORD', ''),
                database: Env_1.default.get('MSSQL_DB_NAME'),
            },
            migrations: {
                naturalSort: true,
            },
            healthCheck: false,
            debug: false,
        }
    }
};
exports.default = databaseConfig;
//# sourceMappingURL=database.js.map