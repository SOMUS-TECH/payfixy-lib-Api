import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'checkouts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.raw('UUID()'))
      table.uuid('book_id').references('id').inTable('books').onDelete('CASCADE')
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('checkout_date', { useTz: true }).defaultTo(this.now())      
      table.timestamp('expected_checkin_date', { useTz: true }).defaultTo(this.now()) 
      table.timestamp('checkin_date', { useTz: true }).nullable()
      table.boolean('notified_before_due').defaultTo(false)
      table.boolean('overdue_notified').defaultTo(false)
     
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
