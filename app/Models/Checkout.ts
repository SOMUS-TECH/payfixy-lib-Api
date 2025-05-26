import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Book from './Book'
import { v4 as uuidv4 } from 'uuid'


export default class Checkout extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public bookId: string

  @column()
  public userId: string

  @column.dateTime()
  public checkoutDate: DateTime

  @column.dateTime()
  public expectedCheckinDate: DateTime

  @column.dateTime()
  public checkinDate: DateTime | null

  @column()
  public notifiedBeforeDue: boolean

  @column()
  public overdueNotified: boolean

  @belongsTo(() => Book)
  public book: BelongsTo<typeof Book>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(checkout: Checkout) {
    checkout.id = uuidv4()
  }
}
