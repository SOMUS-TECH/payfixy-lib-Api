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
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const uuid_1 = require("uuid");
const Checkout_1 = __importDefault(require("./Checkout"));
class User extends Orm_1.BaseModel {
    static async hashPassword(user) {
        if (user.$dirty.password) {
            user.password = await Hash_1.default.make(user.password);
        }
    }
    static assignUuid(model) {
        model.id = (0, uuid_1.v4)();
    }
}
exports.default = User;
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, Orm_1.column)({ serializeAs: null }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], User.prototype, "type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], User.prototype, "profilePhoto", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], User.prototype, "emailVerified", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], User.prototype, "verificationToken", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", Object)
], User.prototype, "verificationTokenExpiry", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], User.prototype, "resetToken", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", Object)
], User.prototype, "resetTokenExpiry", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], User.prototype, "photo", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => Checkout_1.default),
    __metadata("design:type", Object)
], User.prototype, "checkouts", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], User.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, Orm_1.beforeSave)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], User, "hashPassword", null);
__decorate([
    (0, Orm_1.beforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", void 0)
], User, "assignUuid", null);
//# sourceMappingURL=User.js.map