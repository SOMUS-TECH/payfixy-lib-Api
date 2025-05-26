"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Book_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Book"));
const cloudinary_1 = require("cloudinary");
const promises_1 = __importDefault(require("fs/promises"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const luxon_1 = require("luxon");
cloudinary_1.v2.config({
    cloud_name: Env_1.default.get('CLOUDINARY_CLOUD_NAME'),
    api_key: Env_1.default.get('CLOUDINARY_API_KEY'),
    api_secret: Env_1.default.get('CLOUDINARY_API_SECRET'),
});
class BooksController {
    async index({}) {
        return await Book_1.default.all();
    }
    async search({ request }) {
        const q = request.input('q');
        return await Book_1.default.query()
            .whereILike('title', `%${q}%`)
            .orWhereILike('isbn', `%${q}%`)
            .orWhereILike('publisher', `%${q}%`);
    }
    async show({ params }) {
        return await Book_1.default.findOrFail(params.id);
    }
    async store({ request, auth, response }) {
        const user = auth.user;
        if (user.type !== 'librarian') {
            return { error: 'Only librarians can add books' };
        }
        const payload = request.only([
            'title', 'isbn', 'revision_number', 'published_date', 'publisher',
            'authors', 'genre'
        ]);
        const existingBook = await Book_1.default.query().where('isbn', payload['isbn']).first();
        if (existingBook) {
            return response.badRequest({ message: 'A book with this ISBN already exists.' });
        }
        const coverImage = request.file('cover_image', {
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png'],
        });
        if (coverImage) {
            const uploaded = await cloudinary_1.v2.uploader.upload(coverImage.tmpPath, {
                folder: 'book_covers',
            });
            await promises_1.default.unlink(coverImage.tmpPath);
            payload['cover_image'] = uploaded.secure_url;
        }
        if (typeof payload['authors'] === 'string') {
            try {
                const parsed = JSON.parse(payload['authors']);
                if (Array.isArray(parsed)) {
                    payload['authors'] = JSON.stringify(parsed);
                }
                else {
                    payload['authors'] = JSON.stringify([parsed]);
                }
            }
            catch {
                payload['authors'] = JSON.stringify([payload['authors']]);
            }
        }
        payload['added_by'] = user.id;
        payload['date_added'] = luxon_1.DateTime.now();
        const book = await Book_1.default.create(payload);
        return book;
    }
    async update({ params, request, auth }) {
        const user = auth.user;
        if (user.type !== 'librarian') {
            return { error: 'Only librarians can update books' };
        }
        const book = await Book_1.default.findOrFail(params.id);
        const updateData = request.only([
            'title', 'isbn', 'revision_number', 'published_date',
            'publisher', 'authors', 'genre'
        ]);
        const coverImage = request.file('cover_image', {
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png'],
        });
        if (coverImage) {
            const uploaded = await cloudinary_1.v2.uploader.upload(coverImage.tmpPath, {
                folder: 'book_covers',
            });
            await promises_1.default.unlink(coverImage.tmpPath);
            updateData['cover_image'] = uploaded.secure_url;
        }
        if (typeof updateData['authors'] === 'string') {
            try {
                const parsed = JSON.parse(updateData['authors']);
                if (Array.isArray(parsed)) {
                    updateData['authors'] = JSON.stringify(parsed);
                }
                else {
                    updateData['authors'] = JSON.stringify([parsed]);
                }
            }
            catch {
                updateData['authors'] = JSON.stringify([updateData['authors']]);
            }
        }
        book.merge(updateData);
        await book.save();
        return book;
    }
    async checkedOutList({ auth }) {
        const user = auth.user;
        if (user.type !== 'librarian') {
            return { error: 'Only librarians can view this' };
        }
        const books = await Book_1.default.query().has('checkouts', '>', 0).preload('checkouts', (checkoutQuery) => {
            checkoutQuery.whereNull('checkin_date').preload('user');
        });
        return books;
    }
}
exports.default = BooksController;
//# sourceMappingURL=BooksController.js.map