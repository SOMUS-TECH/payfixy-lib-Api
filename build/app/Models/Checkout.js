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
const User_1 = __importDefault(require("./User"));
const Book_1 = __importDefault(require("./Book"));
const uuid_1 = require("uuid");
class Checkout extends Orm_1.BaseModel {
    static assignUuid(checkout) {
        checkout.id = (0, uuid_1.v4)();
    }
}
exports.default = Checkout;
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", String)
], Checkout.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Checkout.prototype, "bookId", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Checkout.prototype, "userId", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Checkout.prototype, "checkoutDate", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Checkout.prototype, "expectedCheckinDate", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", Object)
], Checkout.prototype, "checkinDate", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], Checkout.prototype, "notifiedBeforeDue", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], Checkout.prototype, "overdueNotified", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Book_1.default),
    __metadata("design:type", Object)
], Checkout.prototype, "book", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => User_1.default),
    __metadata("design:type", Object)
], Checkout.prototype, "user", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Checkout.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Checkout.prototype, "updatedAt", void 0);
__decorate([
    (0, Orm_1.beforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Checkout]),
    __metadata("design:returntype", void 0)
], Checkout, "assignUuid", null);
//# sourceMappingURL=Checkout.js.map