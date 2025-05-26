"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'books';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary().defaultTo(this.db.raw('UUID()'));
            table.string('title').notNullable();
            table.string('isbn').notNullable().unique();
            table.string('revision_number').nullable();
            table.date('published_date').nullable();
            table.string('publisher').nullable();
            table.json('authors').notNullable();
            table.string('genre').nullable();
            table.string('cover_image').nullable();
            table.uuid('added_by').references('id').inTable('users').onDelete('SET NULL');
            table.timestamp('date_added', { useTz: true }).defaultTo(this.now());
            table.timestamps(true, true);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1748170294553_books.js.map