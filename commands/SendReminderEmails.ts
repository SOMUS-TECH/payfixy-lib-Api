import { BaseCommand } from '@adonisjs/core/build/standalone'
import Checkout from 'App/Models/Checkout'
import Mail from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class SendReminderEmails extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'emails:remind-checkins'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Send email reminders for books due in 2 days'

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest` 
     * afterwards.
     */
    loadApp: false,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call 
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run () {
    const twoDaysFromNow = DateTime.now().plus({ days: 2 }).startOf('day')
    const tomorrow = DateTime.now().plus({ days: 3 }).startOf('day')

    const checkouts = await Checkout.query()
      .where('notified_before_due', false)
      .whereBetween('expected_checkin_date', [twoDaysFromNow.toSQL(), tomorrow.toSQL()])
      .preload('user')
      .preload('book')

    for (const checkout of checkouts) {
      try {
        await Mail.send((message) => {
          message
            .to(checkout.user.email)
            .from('barrbarabanks@gmail.com')
            .subject('Reminder: Book Return Due Soon')
            .htmlView('emails/reminder', {
              user: checkout.user,
              book: checkout.book,
              dueDate: checkout.expectedCheckinDate,
            })
        })

        checkout.notifiedBeforeDue = true
        await checkout.save()
        this.logger.info(`Reminder sent to ${checkout.user.email}`)
      } catch (err) {
        this.logger.error(`❌ Failed to send reminder to ${checkout.user.email}: ${err.message}`)
      }
    }


    //overdue books Notification to Librarian
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
  }
}
