import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  // ✅ Auth Routes
  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')
  Route.post('/verify', 'AuthController.verify')
  Route.post('/forgot-password', 'AuthController.forgotPassword')
  Route.post('/reset-password', 'AuthController.resetPassword')
  Route.put('/change-password', 'AuthController.changePassword').middleware('auth')


  // ✅ Books (public search)
  Route.get('/books', 'BooksController.index')
  Route.get('/books/search', 'BooksController.search')
  Route.get('/books/:id', 'BooksController.show')

  // ✅ Protected Routes (Librarian/Reader)
  Route.group(() => {
    Route.post('/books', 'BooksController.store')
    Route.put('/books/:id', 'BooksController.update')
    Route.get('/book/checked-out', 'BooksController.checkedOutList')
  }).middleware(['auth', 'role:librarian'])

  Route.group(() => {
    Route.post('/books/:id/checkout', 'CheckoutsController.checkout')
    Route.post('/books/:id/checkin', 'CheckoutsController.checkin')
  }).middleware(['auth', 'role:reader'])

}).prefix('/api')
