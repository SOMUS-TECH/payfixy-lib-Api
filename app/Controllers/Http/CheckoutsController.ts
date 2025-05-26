import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Checkout from 'App/Models/Checkout'
import Book from 'App/Models/Book'
import { DateTime } from 'luxon'

export default class CheckoutsController {
  public async checkout({ auth, params, response }: HttpContextContract) {
    const user = auth.user!
    if (user.type !== 'reader') {
      return response.unauthorized('Only readers can check out books')
    }

    const book = await Book.findOrFail(params.id)

    const alreadyChecked = await Checkout.query()
      .where('book_id', book.id)
      .where('user_id', user.id)
      .whereNull('checkin_date')
      .first()

    if (alreadyChecked) {
      return response.badRequest({ message: 'You already checked out this book' })
    }

    const checkout = await Checkout.create({
      userId: user.id,
      bookId: book.id,
      checkoutDate: DateTime.now(),
      expectedCheckinDate: DateTime.now().plus({ days: 10 }),
    })

    return response.ok(checkout)
  }

  public async checkin({ auth, params }: HttpContextContract) {
    const user = auth.user!
    const checkout = await Checkout.query()
      .where('book_id', params.id)
      .where('user_id', user.id)
      .whereNull('checkin_date')
      .firstOrFail()

    checkout.checkinDate = DateTime.now()
    await checkout.save()

    return { message: 'Book returned successfully', checkout }
  }
}
