import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

export default class extends BaseSeeder {
 public async run () {
    await User.firstOrCreate(
      { email: 'librarian@payfixy.com' },
      {
        firstName: 'Default',
        lastName: 'Librarian',
        email: 'librarian@payfixy.com',
        password: await Hash.make('password123'), // Strong password preferred
        type: 'librarian',
        emailVerified: true,
      }
    )
  }
}
