"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'otps';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary().defaultTo(this.db.raw('UUID()'));
            table.string('email').notNullable();
            table.string('otp').notNullable();
            table.timestamps(true, true);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1728833433381_otps.js.map