import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'books'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.raw('UUID()'))
      table.string('title').notNullable()
      table.string('isbn').notNullable().unique()
      table.string('revision_number').nullable()
      table.date('published_date').nullable()
      table.string('publisher').nullable()
      table.json('authors').notNullable() // array of names
      table.string('genre').nullable()
      table.string('cover_image').nullable()
      table.uuid('added_by').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('date_added', { useTz: true }).defaultTo(this.now())
   

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
