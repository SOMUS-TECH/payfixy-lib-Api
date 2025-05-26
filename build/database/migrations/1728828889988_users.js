"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'users';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary().defaultTo(this.db.raw('UUID()'));
            table.string('first_name');
            table.string('last_name');
            table.string('email').unique().notNullable();
            table.string('password').notNullable();
            table.enum('type', ['reader', 'librarian']).defaultTo('reader');
            table.string('profile_photo');
            table.boolean('email_verified').defaultTo(false);
            table.timestamps(true, true);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1728828889988_users.js.map