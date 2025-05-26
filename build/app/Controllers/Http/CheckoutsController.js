"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Checkout_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Checkout"));
const Book_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Book"));
const luxon_1 = require("luxon");
class CheckoutsController {
    async checkout({ auth, params, response }) {
        const user = auth.user;
        if (user.type !== 'reader') {
            return response.unauthorized('Only readers can check out books');
        }
        const book = await Book_1.default.findOrFail(params.id);
        const alreadyChecked = await Checkout_1.default.query()
            .where('book_id', book.id)
            .where('user_id', user.id)
            .whereNull('checkin_date')
            .first();
        if (alreadyChecked) {
            return response.badRequest({ message: 'You already checked out this book' });
        }
        const checkout = await Checkout_1.default.create({
            userId: user.id,
            bookId: book.id,
            checkoutDate: luxon_1.DateTime.now(),
            expectedCheckinDate: luxon_1.DateTime.now().plus({ days: 10 }),
        });
        return response.ok(checkout);
    }
    async checkin({ auth, params }) {
        const user = auth.user;
        const checkout = await Checkout_1.default.query()
            .where('book_id', params.id)
            .where('user_id', user.id)
            .whereNull('checkin_date')
            .firstOrFail();
        checkout.checkinDate = luxon_1.DateTime.now();
        await checkout.save();
        return { message: 'Book returned successfully', checkout };
    }
}
exports.default = CheckoutsController;
//# sourceMappingURL=CheckoutsController.js.map