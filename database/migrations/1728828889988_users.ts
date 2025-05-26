import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.raw('UUID()'))
      table.string('first_name')
      table.string('last_name')
      table.string('email').unique().notNullable()
      table.string('password').notNullable()
      table.enum('type', ['reader', 'librarian']).defaultTo('reader')
      table.string('profile_photo')
      table.boolean('email_verified').defaultTo(false)

       /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
