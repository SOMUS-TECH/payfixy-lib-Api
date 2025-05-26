"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'checkouts';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary().defaultTo(this.db.raw('UUID()'));
            table.uuid('book_id').references('id').inTable('books').onDelete('CASCADE');
            table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
            table.timestamp('checkout_date', { useTz: true }).defaultTo(this.now());
            table.timestamp('expected_checkin_date', { useTz: true }).defaultTo(this.now());
            table.timestamp('checkin_date', { useTz: true }).nullable();
            table.boolean('notified_before_due').defaultTo(false);
            table.boolean('overdue_notified').defaultTo(false);
            table.timestamps(true, true);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1748170309525_checkouts.js.map