import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('verification_token').nullable()
      table.timestamp('verification_token_expiry').nullable()
      table.string('reset_token').nullable()
      table.timestamp('reset_token_expiry').nullable()
      table.string('photo').nullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('verification_token')
      table.dropColumn('verification_token_expiry')
      table.dropColumn('reset_token')
      table.dropColumn('reset_token_expiry')
      table.dropColumn('photo')
    })
  }
}
