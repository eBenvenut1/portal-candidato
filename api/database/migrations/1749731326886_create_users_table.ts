import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().unique()
      table.string('role').notNullable()
      table.string('full_name').notNullable()
      table.string('email', 80).notNullable().unique()
      table.string('password').notNullable()
      table.string('habilidade').nullable()
      table.string('formacao').notNullable()
      table.string('endereco').notNullable()
      table.string('cep').notNullable()
      table.string('telefone', 11).notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}