import cron from 'node-cron'
import Mail from '@ioc:Adonis/Addons/Mail'
import Checkout from 'App/Models/Checkout'
import { DateTime } from 'luxon'
import User from 'App/Models/User'

export default class Scheduler {
  public static async start() {
    // Runs every day at 8 AM
    cron.schedule('0 8 * * *', async () => {
      const today = DateTime.now()
      const inTwoDays = today.plus({ days: 2 }).startOf('day')

      const checkouts = await Checkout.query()
        .whereNull('checkinDate')
        .andWhere('expectedCheckinDate', '=', inTwoDays.toSQLDate())
        .preload('user')
        .preload('book')

      for (const checkout of checkouts) {
        const user = checkout.user
        const book = checkout.book

        await Mail.send((message) => {
          message
            .to(user.email)
            .from('barrbarabanks@gmail.com')
            .subject('Reminder: Book Return Due in 2 Days')
            .htmlView('emails/reminder', {
              user,
              book,
              dueDate: checkout.expectedCheckinDate,
            })
        })
      }



        const todays = DateTime.now().startOf('day')

        // Fetch overdue books
        const overdueCheckouts = await Checkout.query()
        .whereNull('checkinDate')
        .andWhere('expectedCheckinDate', '<', todays.toSQLDate()) // ✅ Fixed here
        .andWhere('overdueNotified', false)
        .preload('book')
        .preload('user')

        const librarian = await User.query().where('type', 'librarian').first()

        for (const checkout of overdueCheckouts) {
        try {
            await Mail.send((message) => {
            message
                .to(librarian!.email)
                .from('noreply@payfixy.com')
                .subject('Overdue Book Alert')
                .htmlView('emails/overdue', {
                checkout,
                book: checkout.book,
                user: checkout.user,
                })
            })

            checkout.overdueNotified = true
            await checkout.save()
        } catch (error) {
            console.error('Overdue notification failed:', error)
            // Retry logic here (if needed)
        }
        }

      console.log(`📧 Sent ${checkouts.length} reminder(s) at ${today.toISOTime()}`)
    })
  }
}
