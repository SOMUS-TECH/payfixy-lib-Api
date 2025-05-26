import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Book from 'App/Models/Book'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs/promises'
import Env from '@ioc:Adonis/Core/Env'
import { DateTime } from 'luxon'

cloudinary.config({
  cloud_name: Env.get('CLOUDINARY_CLOUD_NAME'),
  api_key: Env.get('CLOUDINARY_API_KEY'),
  api_secret: Env.get('CLOUDINARY_API_SECRET'),
})

export default class BooksController {
  public async index({}: HttpContextContract) {
    return await Book.all()
  }

  public async search({ request }: HttpContextContract) {
    const q = request.input('q')
    return await Book.query()
      .whereILike('title', `%${q}%`)
      .orWhereILike('isbn', `%${q}%`)
      .orWhereILike('publisher', `%${q}%`)
  }

  public async show({ params }: HttpContextContract) {
    return await Book.findOrFail(params.id)
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const user = auth.user!
    if (user.type !== 'librarian') {
      return { error: 'Only librarians can add books' }
    }

    const payload = request.only([
      'title', 'isbn', 'revision_number', 'published_date', 'publisher',
      'authors', 'genre'
    ])

     const existingBook = await Book.query().where('isbn', payload['isbn']).first()
    if (existingBook) {
    return response.badRequest({ message: 'A book with this ISBN already exists.' })
    }

    const coverImage = request.file('cover_image', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png'],
    })

    if (coverImage) {
      const uploaded = await cloudinary.uploader.upload(coverImage.tmpPath!, {
        folder: 'book_covers',
      })
      await fs.unlink(coverImage.tmpPath!)
      payload['cover_image'] = uploaded.secure_url
    }


    // Ensure authors is saved as JSON string
    if (typeof payload['authors'] === 'string') {
        try {
            // Try parsing authors if it's stringified JSON from form-data
            const parsed = JSON.parse(payload['authors'])
            if (Array.isArray(parsed)) {
            payload['authors'] = JSON.stringify(parsed)
            } else {
            payload['authors'] = JSON.stringify([parsed])
            }
        } catch {
            // Fallback: wrap it in an array
            payload['authors'] = JSON.stringify([payload['authors']])
        }
    }
    payload['added_by'] = user.id
    payload['date_added'] = DateTime.now()
   

    const book = await Book.create(payload)
    return book
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const user = auth.user!
    if (user.type !== 'librarian') {
      return { error: 'Only librarians can update books' }
    }

    const book = await Book.findOrFail(params.id)

    const updateData = request.only([
      'title', 'isbn', 'revision_number', 'published_date',
      'publisher', 'authors', 'genre'
    ])

    const coverImage = request.file('cover_image', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png'],
    })

    if (coverImage) {
      const uploaded = await cloudinary.uploader.upload(coverImage.tmpPath!, {
        folder: 'book_covers',
      })
      await fs.unlink(coverImage.tmpPath!)
      updateData['cover_image'] = uploaded.secure_url
    }

    // Ensure authors is saved as JSON string
    if (typeof updateData['authors'] === 'string') {
        try {
            // Try parsing authors if it's stringified JSON from form-data
            const parsed = JSON.parse(updateData['authors'])
            if (Array.isArray(parsed)) {
            updateData['authors'] = JSON.stringify(parsed)
            } else {
            updateData['authors'] = JSON.stringify([parsed])
            }
        } catch {
            // Fallback: wrap it in an array
            updateData['authors'] = JSON.stringify([updateData['authors']])
        }
    }

    book.merge(updateData)
    await book.save()
    return book
  }

  public async checkedOutList({ auth }: HttpContextContract) {
    const user = auth.user!
    if (user.type !== 'librarian') {
      return { error: 'Only librarians can view this' }
    }

    const books = await Book.query().has('checkouts', '>', 0).preload('checkouts', (checkoutQuery) => {
      checkoutQuery.whereNull('checkin_date').preload('user')
    })

    return books
  }
}
