"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const Checkout_1 = __importDefault(require("./Checkout"));
const User_1 = __importDefault(require("./User"));
const uuid_1 = require("uuid");
class Book extends Orm_1.BaseModel {
    static assignUuid(book) {
        book.id = (0, uuid_1.v4)();
    }
}
exports.default = Book;
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", String)
], Book.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Book.prototype, "title", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Book.prototype, "isbn", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Book.prototype, "revisionNumber", void 0);
__decorate([
    Orm_1.column.date(),
    __metadata("design:type", luxon_1.DateTime)
], Book.prototype, "publishedDate", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Book.prototype, "publisher", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Book.prototype, "authors", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Book.prototype, "genre", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Book.prototype, "coverImage", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Book.prototype, "addedBy", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => User_1.default, {
        foreignKey: 'addedBy',
    }),
    __metadata("design:type", Object)
], Book.prototype, "librarian", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => Checkout_1.default),
    __metadata("design:type", Object)
], Book.prototype, "checkouts", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], Book.prototype, "dateAdded", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Book.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Book.prototype, "updatedAt", void 0);
__decorate([
    (0, Orm_1.beforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Book]),
    __metadata("design:returntype", void 0)
], Book, "assignUuid", null);
//# sourceMappingURL=Book.js.map