import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, column, beforeSave, beforeCreate, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'
import Checkout from './Checkout'
export default class User extends BaseModel {
  [x: string]: any
  @column({ isPrimary: true })
  public id: string

 @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public type: 'reader' | 'librarian'

  @column()
  public profilePhoto: string | null

  @column()
  public emailVerified: boolean

  @column()
  public verificationToken: string | null

  @column.dateTime()
  public verificationTokenExpiry: DateTime | any

  @column()
  public resetToken: string | null

  @column.dateTime()
  public resetTokenExpiry: DateTime | any

  @column()
  public photo: string | null

  @hasMany(() => Checkout)
  public checkouts: HasMany<typeof Checkout>


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime | null

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeCreate()
  public static assignUuid(model: User) {
    model.id = uuidv4()
  }
}
