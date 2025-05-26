"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
class default_1 extends Seeder_1.default {
    async run() {
        await User_1.default.firstOrCreate({ email: 'librarian@payfixy.com' }, {
            firstName: 'Default',
            lastName: 'Librarian',
            email: 'librarian@payfixy.com',
            password: await Hash_1.default.make('password123'),
            type: 'librarian',
            emailVerified: true,
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=LibrarianSeeder.js.map