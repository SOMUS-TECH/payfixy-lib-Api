import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, BelongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Checkout from './Checkout'
import User from './User'
import { v4 as uuidv4 } from 'uuid'

export default class Book extends BaseModel {
   @column({ isPrimary: true })
  public id: string

  @column()
  public title: string

  @column()
  public isbn: string

  @column()
  public revisionNumber: string | null

  @column.date()
  public publishedDate: DateTime 

  @column()
  public publisher: string

  @column()
  public authors: string // JSON.stringify([author1, author2])

  @column()
  public genre: string

  @column()
  public coverImage: string

  @column()
  public addedBy: string

  @belongsTo(() => User, {
    foreignKey: 'addedBy',
  })
  public librarian: BelongsTo<typeof User>

  @hasMany(() => Checkout)
  public checkouts: HasMany<typeof Checkout>

  @column.dateTime({ autoCreate: true })
  public dateAdded: DateTime | any | string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

   @beforeCreate()
  public static assignUuid(book: Book) {
    book.id = uuidv4()
  }
}
