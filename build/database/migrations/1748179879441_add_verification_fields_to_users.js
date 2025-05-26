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
        this.schema.alterTable(this.tableName, (table) => {
            table.string('verification_token').nullable();
            table.timestamp('verification_token_expiry').nullable();
            table.string('reset_token').nullable();
            table.timestamp('reset_token_expiry').nullable();
            table.string('photo').nullable();
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('verification_token');
            table.dropColumn('verification_token_expiry');
            table.dropColumn('reset_token');
            table.dropColumn('reset_token_expiry');
            table.dropColumn('photo');
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=1748179879441_add_verification_fields_to_users.js.map