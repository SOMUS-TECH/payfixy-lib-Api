"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.get('/', async () => {
    return { hello: 'world' };
});
Route_1.default.group(() => {
    Route_1.default.post('/register', 'AuthController.register');
    Route_1.default.post('/login', 'AuthController.login');
    Route_1.default.post('/verify', 'AuthController.verify');
    Route_1.default.post('/forgot-password', 'AuthController.forgotPassword');
    Route_1.default.post('/reset-password', 'AuthController.resetPassword');
    Route_1.default.put('/change-password', 'AuthController.changePassword').middleware('auth');
    Route_1.default.get('/books', 'BooksController.index');
    Route_1.default.get('/books/search', 'BooksController.search');
    Route_1.default.get('/books/:id', 'BooksController.show');
    Route_1.default.group(() => {
        Route_1.default.post('/books', 'BooksController.store');
        Route_1.default.put('/books/:id', 'BooksController.update');
        Route_1.default.get('/book/checked-out', 'BooksController.checkedOutList');
    }).middleware(['auth', 'role:librarian']);
    Route_1.default.group(() => {
        Route_1.default.post('/books/:id/checkout', 'CheckoutsController.checkout');
        Route_1.default.post('/books/:id/checkin', 'CheckoutsController.checkin');
    }).middleware(['auth', 'role:reader']);
}).prefix('/api');
//# sourceMappingURL=routes.js.map